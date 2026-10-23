'use client';

import { ArrowRight, ArrowUpRight, CheckCircle2, Clock3, Flag, GitBranch, GraduationCap, House, Play, ShieldCheck, Users } from 'lucide-react';
import { Badge, LaunchArt, PartnerMark } from './shared';
import { DIFFICULTIES, difficultyId, rub, type DifficultyId, type Solo } from '@/lib/game';
import { DifficultyBars } from './DifficultyPicker';

type HomeProps = {
  solo: Solo | null;
  onSolo: () => void;
  onDifficulty: (d:DifficultyId) => void;
  onJoin: () => void;
  onCreate: () => void;
  onGuide: () => void;
  onResults: () => void;
};

export function Home({ solo, onDifficulty, onSolo, onJoin, onCreate, onGuide, onResults }: HomeProps) {
  const level=difficultyId(solo?.difficulty),start=DIFFICULTIES[level];
  return <>
    <div className="home-heading">
      <Badge><Clock3 size={14} />45 минут<span className="badge-divider" />12 месяцев</Badge>
    </div>

    <section className="home-hero">
      <div className="hero-copy">
        <span className="hero-label"><span />12 месяцев самостоятельной жизни</span>
        <div className="hero-partnership"><PartnerMark /></div>
        <h1>Первый год<br /><span>на себе</span></h1>
        <p>Распредели бюджет, найди подработку и прими 12 решений. Узнай, к чему приведёт твоя стратегия.</p>
        <div className="hero-actions">
          <button className="button primary" onClick={onSolo}>
            {solo ? (solo.month === 12 ? 'Посмотреть результат' : 'Продолжить свой год') : 'Начать свой год'}<ArrowRight size={19} />
          </button>
          <button className="button secondary" onClick={onJoin}>Войти по коду</button>
        </div>
        <div className="hero-meta">
          <span><CheckCircle2 size={17} />{rub(start.cash+start.savings)} на старте</span>
          <span><CheckCircle2 size={17} />{solo?`Уровень «${start.name}»`:'Три уровня сложности'}</span>
        </div>
      </div>
      <LaunchArt difficulty={level} />
    </section>

    <div className="section-label modes-heading">
      <div><h2>Выбери, как играть</h2><p>Самостоятельно или на занятии</p></div>
    </div>
    <div className="mode-grid">
      <button className="mode-card" onClick={onSolo}>
        <div className="mode-card-top"><span className="mode-icon"><Play size={23} /></span><Badge>В своём темпе</Badge></div>
        <h3>Самостоятельная игра</h3>
        <p>Планируй год в своём темпе. Сравнивай решения и их последствия без спешки.</p>
        <div className="mode-link">{solo ? 'Продолжить игру' : 'Играть одному'}<ArrowRight size={18} /></div>
      </button>
      <button className="mode-card" onClick={onJoin}>
        <div className="mode-card-top"><span className="mode-icon"><Users size={24} /></span><Badge>2–4 человека</Badge></div>
        <h3>Командная игра</h3>
        <p>Обсуждайте решения и сравнивайте стратегии в общем игровом мире.</p>
        <div className="mode-link">Войти по коду<ArrowRight size={18} /></div>
      </button>
      <button className="mode-card teacher-mode" onClick={onCreate}>
        <div className="mode-card-top"><span className="mode-icon"><GraduationCap size={25} /></span><Badge>Для занятия</Badge></div>
        <h3>Провести занятие</h3>
        <p>Собери класс, управляй раундами и помоги разобраться в результатах.</p>
        <div className="mode-link">Создать урок<ArrowRight size={18} /></div>
      </button>
    </div>

    <section className="home-difficulties" aria-labelledby="difficulty-title">
      <div className="section-label"><div><span className="eyebrow">ТВОЙ ТЕМП · ТВОЯ СТРАТЕГИЯ</span><h2 id="difficulty-title">Один год. Три уровня.</h2><p>Начни с комфортного или проверь себя в условиях посложнее.</p></div></div>
      <div className="difficulty-home-grid">
        {(Object.entries(DIFFICULTIES) as [DifficultyId,typeof start][]).map(([id,d])=><button className={'difficulty-home-card level-'+id} key={id} onClick={()=>onDifficulty(id)}>
          <div className="difficulty-home-top"><DifficultyBars level={id}/><Badge>{d.label}</Badge></div>
          <h3>{d.name}</h3><p>{d.description}</p>
          <dl><div><dt>На старте</dt><dd>{rub(d.cash+d.savings)}</dd></div><div><dt>Поддержка в месяц</dt><dd>{rub(d.support)}</dd></div><div><dt>Свободное время</dt><dd>{d.hours} ч</dd></div></dl>
          <span className="mode-link">Выбрать уровень<ArrowRight size={17}/></span>
        </button>)}
      </div>
    </section>

    <div className="home-bottom">
      <section className="panel path-panel">
        <div className="section-label">
          <div><span className="eyebrow">12 месяцев · 12 новых ситуаций</span><h2>От первого бюджета до своей стратегии</h2></div>
          <button className="text-button" onClick={onGuide}>Как всё устроено<ArrowUpRight size={16} /></button>
        </div>
        <div className="topic-path">
          {[{ n: '01', icon: House, title: 'Освоиться', text: 'Жильё, бюджет, первый выбор' }, { n: '02', icon: ShieldCheck, title: 'Проверить себя', text: 'Договоры, риски, резерв' }, { n: '03', icon: Flag, title: 'Найти баланс', text: 'Капитал, учёба и ресурс' }].map(({ n, icon: Icon, title, text }) => <div key={n}>
            <span className="topic-icon"><Icon size={21} /></span><span className="topic-num">{n}</span><h4>{title}</h4><p>{text}</p>
          </div>)}
        </div>
      </section>
      <aside className="panel quote-panel">
        <GitBranch size={28} /><h3>А что, если<br />решить иначе?</h3>
        <p>В финале измени один выбор и посмотри, как сложился бы твой год.</p>
        <button className="text-button" onClick={solo && solo.month > 0 ? onResults : onGuide}>Сравни два варианта решения<ArrowRight size={17} /></button>
      </aside>
    </div>
  </>;
}
