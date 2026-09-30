import { getCollection, type CollectionEntry } from 'astro:content';

export type Caso = CollectionEntry<'casos'>;
export type CasoTexto = CollectionEntry<'casosTexto'>;
export type Proyecto = CollectionEntry<'proyectos'>;

function slugFromId(id: string): string {
  // glob id examples: "_demo/caso" or "_demo/es"
  return id.split('/')[0] ?? id;
}

export function isDevVisible(entry: { id: string; data: { publicar: boolean } }, dev = import.meta.env.DEV) {
  const slug = slugFromId(entry.id);
  if (slug.startsWith('_')) return dev;
  return entry.data.publicar;
}

export async function getPublishedCasos() {
  const all = await getCollection('casos');
  return all
    .filter((c) => {
      const slug = slugFromId(c.id);
      if (slug.startsWith('_')) return false;
      return c.data.publicar && c.data.permisos.publicarCaso;
    })
    .sort((a, b) => a.data.orden - b.data.orden);
}

/** Rutas de ficha: publicados y, en dev, las carpetas `_demo`. */
export async function getCasePaths() {
  const published = await getPublishedCasos();
  if (!import.meta.env.DEV) return published;
  const all = await getCollection('casos');
  const fixtures = all.filter((c) => slugFromId(c.id).startsWith('_'));
  const seen = new Set(published.map((c) => casoSlug(c)));
  return [...published, ...fixtures.filter((c) => !seen.has(casoSlug(c)))];
}

export async function getCasoEntry(slug: string) {
  const published = await getPublishedCasos();
  const found = published.find((c) => casoSlug(c) === slug);
  if (found) return found;
  if (!import.meta.env.DEV || !slug.startsWith('_')) return undefined;
  const all = await getCollection('casos');
  return all.find((c) => casoSlug(c) === slug);
}

export async function getFeaturedCasos() {
  const casos = await getPublishedCasos();
  return casos.filter((c) => c.data.destacado);
}

export async function getPublishedProyectos() {
  const all = await getCollection('proyectos');
  return all
    .filter((p) => !slugFromId(p.id).startsWith('_') && p.data.publicar)
    .sort((a, b) => a.data.orden - b.data.orden);
}

export function casoSlug(entry: Caso): string {
  return slugFromId(entry.id);
}

export function proyectoSlug(entry: Proyecto): string {
  return slugFromId(entry.id);
}

export async function getCasoTexto(slug: string, lang: 'es' | 'en') {
  const texts = await getCollection('casosTexto');
  return texts.find((t) => t.id === `${slug}/${lang}`);
}

export async function getProyectoTexto(slug: string, lang: 'es' | 'en') {
  const texts = await getCollection('proyectosTexto');
  return texts.find((t) => t.id === `${slug}/${lang}`);
}

const METRIC_META: Record<
  string,
  { es: string; en: string; unidad: string; mejor: 'menor' | 'mayor' }
> = {
  'lighthouse-rendimiento': { es: 'Rendimiento', en: 'Performance', unidad: '/100', mejor: 'mayor' },
  'lighthouse-accesibilidad': { es: 'Accesibilidad', en: 'Accessibility', unidad: '/100', mejor: 'mayor' },
  'lighthouse-seo': { es: 'SEO', en: 'SEO', unidad: '/100', mejor: 'mayor' },
  'lighthouse-buenas-practicas': {
    es: 'Buenas prácticas',
    en: 'Best practices',
    unidad: '/100',
    mejor: 'mayor',
  },
  lcp: { es: 'Carga del contenido principal', en: 'Largest Contentful Paint', unidad: ' s', mejor: 'menor' },
  cls: { es: 'Estabilidad visual', en: 'Cumulative Layout Shift', unidad: '', mejor: 'menor' },
  inp: { es: 'Respuesta a la interacción', en: 'Interaction to Next Paint', unidad: ' ms', mejor: 'menor' },
  'peso-pagina': { es: 'Peso de la página', en: 'Page weight', unidad: ' KB', mejor: 'menor' },
  peticiones: { es: 'Peticiones', en: 'Requests', unidad: '', mejor: 'menor' },
};

export function resolveMetric(
  m: {
    id?: string;
    clave: string;
    etiqueta?: { es: string; en: string };
    unidad?: string;
    mejor?: 'menor' | 'mayor';
  },
  lang: 'es' | 'en',
) {
  if (m.clave === 'custom') {
    return {
      id: m.id ?? 'custom',
      label: m.etiqueta?.[lang] ?? 'Custom',
      unidad: m.unidad ?? '',
      mejor: m.mejor ?? 'mayor',
    };
  }
  const meta = METRIC_META[m.clave];
  return {
    id: m.id ?? m.clave,
    label: meta?.[lang] ?? m.clave,
    unidad: meta?.unidad ?? '',
    mejor: meta?.mejor ?? 'menor',
  };
}

/** Resolve relative image path from content YAML against /src/content/... */
export function contentImageUrl(collectionFolder: 'casos' | 'proyectos', slug: string, rel: string) {
  const clean = rel.replace(/^\.\//, '');
  return `/content-assets/${collectionFolder}/${slug}/${clean}`;
}
