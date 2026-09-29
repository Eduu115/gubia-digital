import { describe, expect, it } from 'vitest';
import { metricImprovement } from './metrics';

describe('metricImprovement', () => {
  it('calcula veces y porcentaje cuando menos es mejor', () => {
    const result = metricImprovement(4.2, 0.9, 'menor');
    expect(result.improved).toBe(true);
    expect(result.pct).toBe(79);
    expect(result.times).toBeCloseTo(4.666, 2);
  });

  it('calcula el porcentaje cuando más es mejor', () => {
    const result = metricImprovement(61, 100, 'mayor');
    expect(result.improved).toBe(true);
    expect(result.pct).toBe(64);
    expect(result.times).toBeNull();
  });

  it('no marca mejora si el valor empeora', () => {
    expect(metricImprovement(1, 3, 'menor').improved).toBe(false);
    expect(metricImprovement(80, 40, 'mayor').improved).toBe(false);
  });

  it('no divide por cero', () => {
    expect(metricImprovement(2, 0, 'menor').times).toBeNull();
    expect(metricImprovement(2, 0, 'menor').pct).toBe(100);
    expect(metricImprovement(0, 1, 'mayor').pct).toBe(0);
  });
});
