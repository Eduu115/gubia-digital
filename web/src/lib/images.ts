import type { ImageMetadata } from 'astro';

const modules = import.meta.glob<{ default: ImageMetadata }>(
  '/src/content/**/*.{webp,png,jpg,jpeg,svg}',
  { eager: true },
);

const pdfs = import.meta.glob<string>('/src/content/**/*.pdf', {
  query: '?url',
  import: 'default',
  eager: true,
});

export function resolveContentPdf(kind: 'casos' | 'proyectos', slug: string, rel: string): string | undefined {
  const clean = rel.replace(/^\.\//, '');
  const needle = `/src/content/${kind}/${slug}/${clean}`;
  const entry = Object.entries(pdfs).find(([path]) => path.replace(/\\/g, '/').includes(needle));
  return entry?.[1];
}

export function resolveContentImage(
  kind: 'casos' | 'proyectos',
  slug: string,
  rel: string,
): ImageMetadata | undefined {
  const clean = rel.replace(/^\.\//, '');
  const needle = `/src/content/${kind}/${slug}/${clean}`;
  const entry = Object.entries(modules).find(([path]) => path.replace(/\\/g, '/').endsWith(needle) || path.includes(`${kind}/${slug}/${clean}`));
  return entry?.[1]?.default;
}
