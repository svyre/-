// Поиск ситуаций по сохранённым идентификаторам и выбранным решениям.

import { SCENARIOS } from './situations/core';
import { NEW_SITUATIONS } from './situations/extended';
import { EXTRA_SITUATIONS } from './situations/legacy';
import type { Plan, Scenario } from './types';

/** Stable ids are stored with each plan so history and replays survive a new shuffle. */
export const SITUATION_IDS = [
  ...SCENARIOS.map((_, m) => `main-${m}`),
  ...Object.keys(EXTRA_SITUATIONS),
  ...Object.keys(NEW_SITUATIONS),
];

export function getScenario(id: string): Scenario | undefined {
  if (/^main-(?:[0-9]|1[01])$/.test(id)) return SCENARIOS[Number(id.slice(5))];
  return Object.hasOwn(EXTRA_SITUATIONS, id)
    ? EXTRA_SITUATIONS[id].scenario
    : Object.hasOwn(NEW_SITUATIONS, id)
      ? NEW_SITUATIONS[id]
      : undefined;
}

export function planScenario(p: Pick<Plan, 'scenario'>, month: number): Scenario {
  return (p.scenario && getScenario(p.scenario)) || SCENARIOS[month];
}

export function planSituationIds(p: Plan, month: number): string[] {
  return [p.scenario || `main-${month}`, ...(p.extras || []).map((e) => e.scenario)];
}

export function extraSituationIds(month: number, seed: number, count: number = 1): string[] {
  const pair = [`${month}-0`, `${month}-1`];
  if (((seed >>> 0) ^ (Math.imul(month + 1, 2654435761) >>> 0)) & 1) pair.reverse();
  return pair.slice(0, Math.max(0, Math.min(2, count)));
}

export function selectedExtraOptions(p: Plan, _month: number) {
  return (p.extras || []).map((event) => {
    const scenario = getScenario(event.scenario);
    return {
      event,
      scenario,
      option: scenario?.options.find((option) => option.id === event.choice),
    };
  });
}
