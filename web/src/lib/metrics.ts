export type Mejor = 'menor' | 'mayor';

export interface MetricImprovement {
  improved: boolean;
  /** Porcentaje absoluto de cambio, redondeado. */
  pct: number;
  /** Veces (antes/después) solo cuando «menor» y el después no es 0. */
  times: number | null;
}

export function metricImprovement(before: number, after: number, mejor: Mejor): MetricImprovement {
  const improved = mejor === 'menor' ? after < before : after > before;
  const delta =
    mejor === 'menor'
      ? before === 0
        ? 0
        : (before - after) / before
      : before === 0
        ? 0
        : (after - before) / before;
  const times = mejor === 'menor' && after !== 0 ? before / after : null;
  return {
    improved,
    pct: Math.round(Math.abs(delta) * 100),
    times,
  };
}
