import {
  MONTHS,
  SHORT_MONTHS,
  capital,
  initialState,
  rub,
  type DifficultyId,
  type Report,
} from '@/lib/game';

export function CapitalChart({
  reports,
  alternative,
  difficulty,
}: {
  reports: Report[];
  alternative?: Report[];
  difficulty: DifficultyId;
}) {
  const a = [capital(initialState(difficulty)), ...reports.map((r) => capital(r.after))];
  const b = alternative
    ? [capital(initialState(difficulty)), ...alternative.map((r) => capital(r.after))]
    : [];
  const min = Math.min(0, ...a, ...b);
  const max = Math.max(50000, ...a, ...b);
  const range = max - min || 1;
  const x = (i: number) => 44 + (i / Math.max(12, reports.length)) * 660;
  const y = (v: number) => 178 - ((v - min) / range) * 142;
  const path = (values: number[]) =>
    values.map((v, i) => `${i ? 'L' : 'M'} ${x(i)} ${y(v)}`).join(' ');
  return (
    <div className="capital-chart">
      <div className="chart-key">
        <span>
          <i />
          Твой капитал
        </span>
        {alternative && (
          <span>
            <i className="alternative" />
            Другой выбор
          </span>
        )}
      </div>
      <svg viewBox="0 0 740 220" role="img" aria-label="Изменение капитала по месяцам">
        <defs>
          <linearGradient id="chart-fill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#83a7eb" stopOpacity=".35" />
            <stop offset="100%" stopColor="#83a7eb" stopOpacity="0" />
          </linearGradient>
        </defs>
        {[0, 0.5, 1].map((v) => (
          <g key={v}>
            <line
              x1="44"
              x2="708"
              y1={y(min + range * v)}
              y2={y(min + range * v)}
              stroke="#e6e9e3"
              strokeDasharray="4 4"
            />
            <text x="2" y={y(min + range * v) + 4} fontSize="10" fill="#7b847e">
              {Math.round((min + range * v) / 1000)}к
            </text>
          </g>
        ))}
        <path d={path(a) + ` L ${x(a.length - 1)} 180 L 44 180 Z`} fill="url(#chart-fill)" />
        <path d={path(a)} fill="none" stroke="#275fce" strokeWidth="3" strokeLinejoin="round" />
        {a.map((v, i) => (
          <circle key={i} cx={x(i)} cy={y(v)} r="3" fill="#275fce">
            <title>
              {i ? MONTHS[i - 1] : 'Старт'}: {rub(v)}
            </title>
          </circle>
        ))}
        {b.length > 0 && (
          <path d={path(b)} fill="none" stroke="#132d50" strokeWidth="3" strokeDasharray="7 5" />
        )}
        {SHORT_MONTHS.map((m, i) => (
          <text key={m} x={x(i + 1)} y="208" textAnchor="middle" fontSize="10" fill="#7b847e">
            {m}
          </text>
        ))}
      </svg>
    </div>
  );
}
