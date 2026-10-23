import assert from 'node:assert/strict';
import fs from 'node:fs';
import ts from 'typescript';
import { DatabaseSync } from 'node:sqlite';
const output=ts.transpileModule(fs.readFileSync(new URL('../lib/game.ts',import.meta.url),'utf8'),{compilerOptions:{target:ts.ScriptTarget.ES2022,module:ts.ModuleKind.ES2022}}).outputText;
const gameUrl='data:text/javascript;base64,'+Buffer.from(output).toString('base64');
const g=await import(gameUrl);
const sqlite=new DatabaseSync(':memory:');
sqlite.exec(fs.readFileSync(new URL('../drizzle/0000_powerful_jazinda.sql',import.meta.url),'utf8'));
const DB={prepare(sql){let values=[];return {bind(...args){values=args;return this;},async first(){return sqlite.prepare(sql).get(...values)||null;},async run(){const r=sqlite.prepare(sql).run(...values);return {meta:{changes:Number(r.changes)}};}};}};
globalThis.__naSvoihTestEnv={DB};
let routeSource=ts.transpileModule(fs.readFileSync(new URL('../app/api/room/route.ts',import.meta.url),'utf8'),{compilerOptions:{target:ts.ScriptTarget.ES2022,module:ts.ModuleKind.ES2022}}).outputText;
routeSource=routeSource.replace(/import \{ env \} from ['"]cloudflare:workers['"];?/, 'const env=globalThis.__naSvoihTestEnv;').replace("'@/lib/game'",JSON.stringify(gameUrl)).replace('"@/lib/game"',JSON.stringify(gameUrl));
const route=await import('data:text/javascript;base64,'+Buffer.from(routeSource).toString('base64'));

const endpoint='http://127.0.0.1:4173/api/room';let requests=0;
async function api(action,data={},token,expected=200,headers={}){requests++;const r=await route.POST(new Request(endpoint,{method:'POST',headers:{'Content-Type':'application/json',...(token?{Authorization:'Bearer '+token}:{}),...headers},body:JSON.stringify({action,...data})}));const body=await r.json();assert.equal(r.status,expected,`${action}: ${r.status}, ${JSON.stringify(body).slice(0,180)}`);return body;}
const host=await api('create',{title:'Integration test',goal:'career'});const code=host.room.code;
await api('read',{code},undefined,403);
await api('read',{code},'invalid-token',403);
const [a,b]=await Promise.all([api('join',{code,name:'Команда Альфа'}),api('join',{code,name:'Команда Бета'})]);
await api('join',{code,name:'команда альфа'},undefined,400);
await api('start',{code},a.token,403);
await api('start',{code},host.token);
await api('join',{code,name:'Поздний участник'},undefined,400);
await api('advance',{code,month:0},host.token,400);
await api('pause',{code},host.token);
await api('submit',{code,month:0,plan:g.defaultPlan(0)},a.token,400);
await api('pause',{code},host.token);
await api('submit',{code,month:1,plan:g.defaultPlan(0)},a.token,409);
await api('submit',{code,month:0,plan:{...g.defaultPlan(0),invest:-1}},a.token,400);
await api('read',{code},a.token,403,{origin:'https://untrusted.example'});
for(let month=0;month<12;month++){
  await Promise.all([api('submit',{code,month,plan:g.defaultPlan(month)},a.token),api('submit',{code,month,plan:g.defaultPlan(month)},b.token)]);
  await api('submit',{code,month,plan:g.defaultPlan(month)},a.token,409);
  const ready=await api('read',{code},host.token);assert.equal(ready.room.teams.filter(t=>t.ready).length,2);
  const advanced=await api('advance',{code,month},host.token);assert.equal(advanced.room.month,month+1);
  if(month===0){await api('advance',{code,month},host.token,409);const personal=await api('read',{code},a.token);assert.equal(personal.room.me.reports.length,1);assert.ok(personal.room.teams.every(t=>!('state' in t)&&!('reports' in t)));assert.ok(!JSON.stringify(personal).includes('tokenHash'));assert.ok(!JSON.stringify(personal).includes('host_hash'));}
}
const final=await api('read',{code},b.token);assert.equal(final.room.phase,'finished');assert.equal(final.room.me.reports.length,12);assert.ok(final.room.teams.every(t=>Number.isFinite(t.capital)));
assert.equal(final.room.difficulty,'balance');
await api('create',{difficulty:'invalid'},undefined,400);
for(const difficulty of ['first','challenge']){
  const h=await api('create',{title:'Level '+difficulty,difficulty});const c=h.room.code;
  assert.equal(h.room.difficulty,difficulty);
  const t=await api('join',{code:c,name:'Test team',difficulty:'balance'});
  assert.equal(t.room.difficulty,difficulty);assert.deepEqual(t.room.me.state,g.initialState(difficulty));
  await api('start',{code:c,difficulty:'balance'},h.token);
  const timePlan={...g.defaultPlan(0),job:'part',study:48,choice:'service'};
  assert.equal(g.planHours(timePlan,0),122);
  if(difficulty==='challenge')await api('submit',{code:c,month:0,plan:timePlan,difficulty:'first'},t.token,400);
  const plan=difficulty==='first'?timePlan:g.defaultPlan(0);
  await api('submit',{code:c,month:0,plan,difficulty:'balance'},t.token);
  const advanced=await api('advance',{code:c,month:0,difficulty:'balance'},h.token);
  const expected=g.settle(g.initialState(difficulty),plan,0,'capital',true,difficulty);
  assert.deepEqual(advanced.room.teams[0].state,expected.after);
  assert.equal(advanced.room.teams[0].score,expected.score);
}
// A saved room without the new field retains its state and balanced rules.
const legacy=await api('create',{});const stored=sqlite.prepare('SELECT data FROM game_rooms WHERE code = ?').get(legacy.room.code);
const oldRoom=JSON.parse(stored.data);delete oldRoom.difficulty;sqlite.prepare('UPDATE game_rooms SET data = ? WHERE code = ?').run(JSON.stringify(oldRoom),legacy.room.code);
const restored=await api('read',{code:legacy.room.code},legacy.token);assert.equal(restored.room.difficulty,'balance');
const legacyTeam=await api('join',{code:legacy.room.code,name:'Legacy team'});assert.deepEqual(legacyTeam.room.me.state,g.INITIAL);
console.log(JSON.stringify({status:'PASS',requests,teams:2,months:12,checks:['concurrent joins and submissions','server-side room permissions','pause and readiness enforcement','stale month rejection','hidden tokens and peer plans','cross-origin rejection','full year persistence','common difficulty and server-side enforcement','legacy room compatibility']}));
