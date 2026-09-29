import { describe, expect, it } from 'vitest';
import { escapeXml, fitTitle, ogOverlay } from './og';

describe('og', () => {
  it('recorta títulos largos y escapa el SVG', () => {
    expect(fitTitle('a'.repeat(60)).endsWith('…')).toBe(true);
    expect(escapeXml('A & B <C>')).toBe('A &amp; B &lt;C&gt;');
    expect(ogOverlay('Caso & Ana')).toContain('Caso &amp; Ana');
    expect(ogOverlay('título')).toContain('#1C2B4A');
  });
});
