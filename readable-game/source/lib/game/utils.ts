export const clone = <T>(v: T): T => JSON.parse(JSON.stringify(v));

export const rub = (n: number) =>
  new Intl.NumberFormat('ru-RU', { maximumFractionDigits: 0 }).format(Math.round(n)) + ' ₽';

export const percent = (n: number) =>
  new Intl.NumberFormat('ru-RU', { maximumFractionDigits: 2 }).format(n) + '%';

export const roundMoney = (n: number) => Math.round(n * 100) / 100;

export const clamp = (n: number, a = 0, b = 100) => Math.min(b, Math.max(a, n));
