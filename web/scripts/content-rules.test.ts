import { describe, expect, it } from 'vitest';
import { collectCasoIssues, extractMdxRefs, type PreparedCaso } from './content-rules';

function caso(overrides: Partial<PreparedCaso> = {}): PreparedCaso {
  return {
    slug: 'demo',
    data: {
      publicar: false,
      permisos: { publicarCaso: false, testimonio: true },
      puntoDePartida: { tipo: 'web' },
      comparativas: [
        {
          id: 'home',
          dispositivo: 'desktop',
          antes: './img/antes.webp',
          despues: './img/despues.webp',
          alt: {
            antes: { es: 'antes', en: 'before' },
            despues: { es: 'después', en: 'after' },
          },
        },
      ],
      metricas: [
        {
          clave: 'lcp',
          fuente: 'lab',
          fechaAntes: '2026-01-01',
          fechaDespues: '2026-02-01',
        },
      ],
    },
    hasEs: true,
    hasEn: true,
    mdx: { comparativa: [], captura: [], metrica: [] },
    files: {
      'img/antes.webp': { bytes: 1000, aspect: 1.6 },
      'img/despues.webp': { bytes: 1000, aspect: 1.6 },
    },
    ...overrides,
  };
}

describe('extractMdxRefs', () => {
  it('lee los id de los componentes', () => {
    const refs = extractMdxRefs('<Comparativa id="home" />\n<Captura id="detalle"></Captura>\n<Metrica id="lcp" />');
    expect(refs).toEqual({ comparativa: ['home'], captura: ['detalle'], metrica: ['lcp'] });
  });
});

describe('collectCasoIssues', () => {
  it('acepta un caso coherente', () => {
    expect(collectCasoIssues(caso()).errors).toEqual([]);
  });

  it('falla si antes y después no comparten proporción', () => {
    const issues = collectCasoIssues(
      caso({
        files: {
          'img/antes.webp': { bytes: 1000, aspect: 2 },
          'img/despues.webp': { bytes: 1000, aspect: 1 },
        },
      }),
    );
    expect(issues.errors.some((error) => error.includes('relación de aspecto'))).toBe(true);
  });

  it('falla si el MDX cita un id que no existe', () => {
    const issues = collectCasoIssues(
      caso({ mdx: { comparativa: ['carta'], captura: [], metrica: [] } }),
    );
    expect(issues.errors.some((error) => error.includes('Comparativa'))).toBe(true);
  });

  it('avisa si falta la narrativa en inglés', () => {
    const issues = collectCasoIssues(caso({ hasEn: false }));
    expect(issues.warnings.some((warning) => warning.includes('en.mdx'))).toBe(true);
    expect(issues.errors).toEqual([]);
  });

  it('falla si un caso publicado no tiene es.mdx', () => {
    const issues = collectCasoIssues(
      caso({
        hasEs: false,
        data: { ...caso().data, publicar: true },
      }),
    );
    expect(issues.errors.some((error) => error.includes('es.mdx'))).toBe(true);
  });
});
