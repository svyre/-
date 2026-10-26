export const clone = <T>(v: T): T => JSON.parse(JSON.stringify(v));

const rubleFormatter = new Intl.NumberFormat('ru-RU', { maximumFractionDigits: 0 });
const percentFormatter = new Intl.NumberFormat('ru-RU', { maximumFractionDigits: 2 });

export const rub = (n: number) => rubleFormatter.format(Math.round(n)) + ' ₽';

export const percent = (n: number) => percentFormatter.format(n) + '%';

export const roundMoney = (n: number) => Math.round(n * 100) / 100;

export const clamp = (n: number, a = 0, b = 100) => Math.min(b, Math.max(a, n));
