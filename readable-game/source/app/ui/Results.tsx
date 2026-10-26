import type { CharacterId } from '@/lib/character';
import {
  DIFFICULTIES,
  GOALS,
  HOUSING,
  MONTHS,
  ROOM_ITEMS,
  capital,
  debt,
  evaluate,
  getScenario,
  planScenario,
  replay,
  rub,
  type Solo,
} from '@/lib/game';
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  Check,
  Download,
  Flag,
  GitBranch,
  History,
  RotateCcw,
  TriangleAlert,
} from 'lucide-react';
import { useState } from 'react';
import { CapitalChart } from './CapitalChart';
import { HistoryList } from './History';
import { FinalRoom } from './PlayerRoom';
import { Badge, Meter, downloadCsv } from './shared';
export function Results({
  data,
  onBack,
  onRestart,
}: {
  data: Solo & { character?: CharacterId };
  onBack: () => void;
  onRestart: () => void;
}) {
  const [changed, setChanged] = useState(0);
  const [choice, setChoice] = useState('');
  const [alt, setAlt] = useState<ReturnType<typeof replay> | null>(null);
  const [error, setError] = useState('');
  const [tab, setTab] = useState<'overview' | 'history'>('overview');
  const done = data.month >= 12;
  const stats = evaluate(
    data.state,
    data.goal,
    data.plans.at(-1),
    Math.max(0, data.month - 1),
    data.difficulty,
  );
  const compare = () => {
    try {
      setAlt(replay(data.reports, changed, choice, data.goal, data.difficulty));
      setError('');
    } catch (e) {
      setAlt(null);
      setError(e instanceof Error ? e.message : 'Этот вариант требует другого плана времени.');
    }
  };
  const exportReport = () =>
    downloadCsv('na-sebe-report.csv', [
      ['Сложность', DIFFICULTIES[data.difficulty].name],
      [],
      [
        'Месяц',
        'Решение',
        'Деньги на руках',
        'Накопления',
        'Фонд',
        'Долг',
        'Капитал',
        'Учёба',
        'Ресурс',
        'Навыки',
        'Баллы',
        'Жильё',
        'Покупки в комнату',
        'Вещи из ситуаций',
        'Помощь комнаты: учёба',
        'Помощь комнаты: ресурс',
      ],
      ...data.reports.map((r) => [
        MONTHS[r.month],
        [
          planScenario(r.plan, r.month).options.find((o) => o.id === r.plan.choice)?.title,
          ...(r.extras || []).map(
            (e) => getScenario(e.scenario)?.options.find((o) => o.id === e.choice)?.title,
          ),
        ]
          .filter(Boolean)
          .join(' / '),
        r.after.cash,
        r.after.savings,
        r.after.fund,
        debt(r.after),
        capital(r.after),
        r.after.education,
        r.after.energy,
        r.after.skills,
        r.score,
        HOUSING.find((h) => h.id === r.plan.housing)?.name || '',
        (r.room?.purchased || []).map((id) => ROOM_ITEMS[id].name).join(' / '),
        (r.room?.gifted || []).map((id) => ROOM_ITEMS[id].name).join(' / '),
        r.room?.education || 0,
        r.room?.energy || 0,
      ]),
    ]);
  return (
    <>
      <div className="page-heading">
        <div>
          <span className="eyebrow">
            {done ? 'ТВОЙ ПЕРВЫЙ ГОД / ИТОГИ' : 'ТВОЯ СТРАТЕГИЯ / ПРОМЕЖУТОЧНЫЙ РЕЗУЛЬТАТ'}
          </span>
          <h1>
            {done ? 'Первый год — за плечами' : 'Каждый месяц — шаг вперёд'}
            <span className="lime-dot">.</span>
          </h1>
          <p>
            {data.name} · {DIFFICULTIES[data.difficulty].name} · {GOALS[data.goal].name} ·{' '}
            {data.month} из 12 месяцев
          </p>
        </div>
        <div className="heading-actions">
          {!done && (
            <button className="button secondary" onClick={onBack}>
              <ArrowLeft size={16} />К игре
            </button>
          )}
          <button
            className="button secondary"
            disabled={!data.reports.length}
            onClick={exportReport}
          >
            <Download size={16} />
            Отчёт
          </button>
        </div>
      </div>
      <div className="tab-bar">
        <button className={tab === 'overview' ? 'selected' : ''} onClick={() => setTab('overview')}>
          <Flag size={17} />
          Мой результат
        </button>
        <button className={tab === 'history' ? 'selected' : ''} onClick={() => setTab('history')}>
          <History size={17} />
          Вся история
        </button>
      </div>
      {tab === 'history' ? (
        <HistoryList reports={data.reports} />
      ) : (
        <>
          <section className="results-hero">
            <div>
              <Badge tone="green">
                {done
                  ? stats.achieved
                    ? 'Цель достигнута'
                    : 'Год завершён'
                  : 'История продолжается'}
              </Badge>
              <h2>
                {stats.total >= 80
                  ? 'Есть чем гордиться.'
                  : stats.total >= 60
                    ? 'Сильная основа для следующего шага.'
                    : 'Уже есть опыт, на который можно опереться.'}
              </h2>
              <p>
                {done
                  ? 'Посмотри, какие решения помогли, а какие потребовали пересмотра.'
                  : 'Это промежуточные баллы. Дальнейшие решения ещё изменят результат.'}
              </p>
              <div className="results-main-values">
                <div>
                  <span>Твой капитал</span>
                  <b>{rub(capital(data.state))}</b>
                </div>
                <div>
                  <span>Чистый запас базовых расходов</span>
                  <b>{stats.reserveMonths.toFixed(1)} мес.</b>
                </div>
              </div>
            </div>
            <div className="score-circle">
              <svg viewBox="0 0 160 160">
                <circle cx="80" cy="80" r="67" fill="none" stroke="#38506d" strokeWidth="10" />
                <circle
                  cx="80"
                  cy="80"
                  r="67"
                  fill="none"
                  stroke="#d6f67c"
                  strokeWidth="10"
                  strokeLinecap="round"
                  strokeDasharray={`${(stats.total / 100) * 421} 421`}
                  transform="rotate(-90 80 80)"
                />
              </svg>
              <div>
                <strong>{stats.total}</strong>
                <span>из 100 баллов</span>
              </div>
            </div>
          </section>
          <div className="results-grid">
            <section className="panel score-parts">
              <h2>Из чего сложился результат</h2>
              {stats.parts.map((p) => (
                <div key={p.name}>
                  <div>
                    <span>{p.name}</span>
                    <b>
                      {p.value}
                      <small> / {p.max}</small>
                    </b>
                  </div>
                  <Meter value={(p.value / p.max) * 100} />
                </div>
              ))}
              <p className="soft-note">
                Баллы описывают твою игровую стратегию. Это ориентир для обсуждения, а не школьная
                оценка.
              </p>
            </section>
            <section className="panel results-goal">
              <Flag size={26} />
              <span className="eyebrow">{GOALS[data.goal].name}</span>
              <h2>
                {stats.goalProgress}%<span> пути к цели</span>
              </h2>
              <Meter value={stats.goalProgress} />
              <div className="goal-checks">
                {[
                  {
                    ok: capital(data.state) >= GOALS[data.goal].target,
                    text: `Капитал от ${rub(GOALS[data.goal].target)}`,
                  },
                  { ok: data.state.education >= 60, text: 'Учёба от 60 баллов' },
                  { ok: data.state.energy >= 35, text: 'Ресурс от 35 баллов' },
                  { ok: data.state.cash >= 0, text: 'Без дефицита на финише' },
                  ...(data.goal === 'career'
                    ? [{ ok: data.state.skills >= 4, text: 'Не меньше 4 навыков' }]
                    : []),
                ].map((x, i) => (
                  <div key={i} className={x.ok ? 'checked' : ''}>
                    <span>{x.ok ? <Check size={12} /> : <span />}</span>
                    {x.text}
                  </div>
                ))}
              </div>
            </section>
          </div>
          <section className="panel">
            <div className="section-label">
              <h2>Твоя финансовая траектория</h2>
              <Badge>{data.month} месяцев</Badge>
            </div>
            <CapitalChart
              reports={data.reports}
              alternative={alt?.reports}
              difficulty={data.difficulty}
            />
          </section>
          {done && (
            <FinalRoom
              state={data.state}
              housing={data.plans.at(-1)?.housing || 'dorm'}
              character={data.character || 'boy'}
            />
          )}
          {data.reports.length > 0 && (
            <section className="panel counterfactual">
              <div className="section-label">
                <div>
                  <span className="eyebrow">
                    <GitBranch size={15} />
                    СРАВНЕНИЕ РЕШЕНИЙ
                  </span>
                  <h2>А что, если решить иначе?</h2>
                </div>
                <RotateCcw size={24} />
              </div>
              <p>
                Измени решение в первой ситуации выбранного месяца. Остальные ситуации, события
                рынка и планы останутся теми же. Если денег на последующие переводы не хватит, они
                сократятся; потребуется больше времени или покупка окажется повторной после другого
                решения — сравнение остановится с пояснением.
              </p>
              <div className="counter-controls">
                <label className="field">
                  Какой месяц
                  <select
                    value={changed}
                    onChange={(e) => {
                      setChanged(Number(e.target.value));
                      setChoice('');
                      setAlt(null);
                      setError('');
                    }}
                  >
                    {data.reports.map((r) => (
                      <option key={r.month} value={r.month}>
                        {MONTHS[r.month]} — {planScenario(r.plan, r.month).title}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="field">
                  Что попробовать
                  <select
                    value={choice}
                    onChange={(e) => {
                      setChoice(e.target.value);
                      setAlt(null);
                      setError('');
                    }}
                  >
                    <option value="">Выбери другой вариант</option>
                    {planScenario(data.reports[changed].plan, changed)
                      .options.filter((o) => o.id !== data.reports[changed]?.plan.choice)
                      .map((o) => (
                        <option key={o.id} value={o.id}>
                          {o.title}
                        </option>
                      ))}
                  </select>
                </label>
                <button className="button primary" disabled={!choice} onClick={compare}>
                  Сравнить
                  <ArrowUpRight size={17} />
                </button>
              </div>
              {error && (
                <div className="alert orange">
                  <TriangleAlert size={17} />
                  {error}
                </div>
              )}
              {alt && (
                <>
                  <div className="comparison-results">
                    <div>
                      <span>Твой исходный капитал</span>
                      <b>{rub(capital(data.state))}</b>
                      <small>
                        Учёба {data.state.education} · ресурс {data.state.energy}
                      </small>
                    </div>
                    <ArrowRight size={22} />
                    <div>
                      <span>При другом решении</span>
                      <b>{rub(capital(alt.state))}</b>
                      <small>
                        Учёба {alt.state.education} · ресурс {alt.state.energy}
                      </small>
                    </div>
                    <div className="comparison-delta">
                      <span>Разница капитала</span>
                      <b
                        className={
                          capital(alt.state) >= capital(data.state) ? 'green-text' : 'red-text'
                        }
                      >
                        {capital(alt.state) > capital(data.state) ? '+' : ''}
                        {rub(capital(alt.state) - capital(data.state))}
                      </b>
                      <small>
                        {alt.trimmed
                          ? `Переводы скорректированы на ${rub(alt.trimmed)}`
                          : 'Остальные денежные планы сохранены'}
                      </small>
                    </div>
                  </div>
                  <p className="soft-note">
                    Это сравнение в рамках заданной модели. Оно показывает влияние одного выбора при
                    фиксированных внешних событиях.
                  </p>
                </>
              )}
            </section>
          )}
          {done && (
            <div className="restart-row">
              <p>
                Попробуй другую цель или стратегию.
                <br />
                <span>Теперь у тебя есть опыт первого года.</span>
              </p>
              <button className="button primary" onClick={onRestart}>
                Начать новую историю
                <ArrowUpRight size={18} />
              </button>
            </div>
          )}
        </>
      )}
    </>
  );
}
