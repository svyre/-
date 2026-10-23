import { env } from 'cloudflare:workers';
import { initialState, difficultyId, settle, validatePlan, evaluate, capital, GOALS, type DifficultyId, type GameState, type GoalId, type Plan, type Report } from '@/lib/game';
type Team={id:string;name:string;tokenHash:string;state:GameState;plans:Plan[];reports:Report[];pending:Plan|null};
type Room={title:string;goal:GoalId;difficulty:DifficultyId;phase:'lobby'|'playing'|'finished';month:number;teams:Team[];roundSeconds:number;deadline:number;paused:boolean;pauseAt:number};
type Row={code:string;host_hash:string;data:string;version:number;expires_at:number};
class UserError extends Error { constructor(message:string,public status=400){super(message);} }
const response=(body:unknown,status=200)=>Response.json(body,{status,headers:{'Cache-Control':'no-store'}});
async function hash(value:string){return [...new Uint8Array(await crypto.subtle.digest('SHA-256',new TextEncoder().encode(value)))].map(x=>x.toString(16).padStart(2,'0')).join('');}
const cleanName=(s:unknown,fallback:string)=>typeof s==='string'?s.trim().replace(/[\u0000-\u001f<>]/g,'').slice(0,32)||fallback:fallback;
function view(room:Room,code:string,host:boolean,team?:Team){return {code,title:room.title,goal:room.goal,difficulty:room.difficulty,phase:room.phase,month:room.month,roundSeconds:room.roundSeconds,deadline:room.deadline,paused:room.paused,
  teams:room.teams.map(t=>({id:t.id,name:t.name,ready:!!t.pending,capital:capital(t.state),education:t.state.education,energy:t.state.energy,score:evaluate(t.state,room.goal,t.plans.at(-1),Math.max(0,room.month-1),room.difficulty).total,...(host?{state:t.state,reports:t.reports,plans:t.plans}:{})})),
  ...(team?{me:{id:team.id,name:team.name,state:team.state,reports:team.reports,plans:team.plans,pending:team.pending}}:{})};}
export async function POST(req:Request){
  try{
    if(!env.DB)throw new UserError('Комнаты пока недоступны. Одиночная игра работает без подключения.',503);
    const origin=req.headers.get('origin');if(origin&&origin!==new URL(req.url).origin)throw new UserError('Недопустимый источник запроса.',403);
    const raw=await req.text();if(raw.length>20000)throw new UserError('Слишком большой запрос.');
    let b:any;try{b=JSON.parse(raw);}catch{throw new UserError('Неверный формат запроса.');}if(!b||typeof b!=='object')throw new UserError('Неверный формат запроса.');
    const db=env.DB;
    if(b.action==='create'){
      const goal=(Object.keys(GOALS).includes(b.goal)?b.goal:'capital') as GoalId;
      if(b.difficulty!==undefined&&difficultyId(b.difficulty)!==b.difficulty)throw new UserError('Выбери доступную сложность.');
      const difficulty=difficultyId(b.difficulty);
      const token=crypto.randomUUID()+crypto.randomUUID(),hostHash=await hash(token),alphabet='ABCDEFGHJKMNPQRSTUVWXYZ23456789';
      const room:Room={title:cleanName(b.title,'Финансовая лаборатория'),goal,difficulty,phase:'lobby',month:0,teams:[],roundSeconds:Math.min(300,Math.max(60,Number(b.roundSeconds)||150)),deadline:0,paused:false,pauseAt:0};
      await db.prepare('DELETE FROM game_rooms WHERE expires_at < ?').bind(Date.now()).run();
      for(let attempt=0;attempt<4;attempt++){const bytes=crypto.getRandomValues(new Uint8Array(6)),code=[...bytes].map(x=>alphabet[x%alphabet.length]).join('');try{await db.prepare('INSERT INTO game_rooms (code,host_hash,data,version,created_at,expires_at) VALUES (?,?,?,0,?,?)').bind(code,hostHash,JSON.stringify(room),Date.now(),Date.now()+7*86400000).run();return response({token,role:'host',room:view(room,code,true)});}catch(e){if(attempt===3)throw e;}}
    }
    const code=typeof b.code==='string'?b.code.toUpperCase().replace(/\s/g,''):'';
    if(!/^[A-Z2-9]{6}$/.test(code))throw new UserError('Код комнаты состоит из 6 букв и цифр.');
    const bearer=req.headers.get('authorization')?.replace(/^Bearer /,'')||'';const tokenHash=bearer?await hash(bearer):'';
    for(let attempt=0;attempt<4;attempt++){
      const row=await db.prepare('SELECT code,host_hash,data,version,expires_at FROM game_rooms WHERE code = ?').bind(code).first<Row>();
      if(!row||row.expires_at<Date.now())throw new UserError('Комната не найдена или срок её хранения истёк.',404);
      const room=JSON.parse(row.data) as Room;room.difficulty=difficultyId(room.difficulty);const host=!!tokenHash&&tokenHash===row.host_hash;let team=room.teams.find(x=>x.tokenHash===tokenHash);let newToken:string|undefined;
      if(b.action==='join'){
        if(room.phase!=='lobby')throw new UserError('Игра уже началась. Попроси ведущего создать новую комнату.');
        if(room.teams.length>=24)throw new UserError('В комнате уже 24 команды.');
        const name=cleanName(b.name,'Команда');if(room.teams.some(x=>x.name.toLowerCase()===name.toLowerCase()))throw new UserError('Такая команда уже есть. Выбери другое название.');
        newToken=crypto.randomUUID()+crypto.randomUUID();team={id:crypto.randomUUID(),name,tokenHash:await hash(newToken),state:initialState(room.difficulty),plans:[],reports:[],pending:null};room.teams.push(team);
      }else{
        if(!host&&!team)throw new UserError('Нет доступа к этой игровой сессии. Вернись по сохранённому входу на этом устройстве.',403);
        if(b.action==='read')return response({role:host?'host':'team',room:view(room,code,host,team)});
        if(['start','advance','pause','remove'].includes(b.action)&&!host)throw new UserError('Это действие доступно ведущему.',403);
        if(b.action==='start'){
          if(room.phase!=='lobby'||room.teams.length===0)throw new UserError('Для старта нужна хотя бы одна команда в лобби.');room.phase='playing';room.deadline=Date.now()+room.roundSeconds*1000;
        }else if(b.action==='submit'){
          if(!team||room.phase!=='playing'||room.paused)throw new UserError('Сейчас нельзя отправить решение.');
          if(b.month!==room.month)throw new UserError('Ведущий уже перешёл к другому месяцу. Обнови состояние.',409);
          if(team.pending)throw new UserError('Решение уже принято. Ждём следующий раунд.',409);
          const err=validatePlan(b.plan,team.state,room.month,false,room.difficulty);if(err)throw new UserError(err);settle(team.state,b.plan,room.month,room.goal,true,room.difficulty);team.pending=b.plan;
        }else if(b.action==='advance'){
          if(room.phase!=='playing'||room.paused)throw new UserError('Сначала возобнови игру.');
          if(b.month!==room.month)throw new UserError('Этот месяц уже завершён.',409);
          if(room.teams.some(t=>!t.pending))throw new UserError('Дождись решений всех команд.');
          for(const t of room.teams){const plan=t.pending!;const report=settle(t.state,plan,room.month,room.goal,true,room.difficulty);t.state=report.after;t.plans.push(plan);t.reports.push(report);t.pending=null;}
          room.month++;room.deadline=Date.now()+room.roundSeconds*1000;if(room.month>=12)room.phase='finished';
        }else if(b.action==='pause'){
          if(room.phase!=='playing')throw new UserError('Пауза доступна во время игры.');
          if(room.paused){room.deadline+=Date.now()-room.pauseAt;room.paused=false;}else{room.pauseAt=Date.now();room.paused=true;}
        }else if(b.action==='remove'){
          if(room.phase!=='lobby')throw new UserError('Удаление команды доступно до старта.');room.teams=room.teams.filter(t=>t.id!==b.teamId);
        }else throw new UserError('Неизвестное действие.');
      }
      const update=await db.prepare('UPDATE game_rooms SET data = ?, version = version + 1 WHERE code = ? AND version = ?').bind(JSON.stringify(room),code,row.version).run();
      if(update.meta.changes){return response({...(newToken?{token:newToken}:{}),role:host?'host':'team',room:view(room,code,host,team)});}
    }
    throw new UserError('Данные обновились одновременно. Повтори действие.',409);
  }catch(e){if(e instanceof UserError)return response({error:e.message},e.status);if(e instanceof Error&&/На переводы|Плану не хватает/.test(e.message))return response({error:e.message},400);console.error('Room operation failed',e);return response({error:'Не удалось обновить комнату. Попробуй ещё раз; твой прогресс сохранён.'},500);}
}
