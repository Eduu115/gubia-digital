import { mkdir, readdir, readFile } from 'node:fs/promises';
import path from 'node:path';
import { parse } from 'yaml';
import sharp from 'sharp';

const WIDTH = 1200;
const HEIGHT = 630;

export function fitTitle(title: string, max = 46): string {
  const clean = title.replace(/\s+/g, ' ').trim();
  if (clean.length <= max) return clean;
  return `${clean.slice(0, max - 1).trimEnd()}…`;
}

export function escapeXml(value: string): string {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;');
}

export function ogOverlay(title: string): string {
  const line = escapeXml(fitTitle(title));
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg width="${WIDTH}" height="${HEIGHT}" viewBox="0 0 ${WIDTH} ${HEIGHT}" xmlns="http://www.w3.org/2000/svg">
  <rect x="0" y="500" width="${WIDTH}" height="130" fill="#1C2B4A"/>
  <rect x="0" y="500" width="${WIDTH}" height="6" fill="#FF6A13"/>
  <text x="48" y="552" fill="#F6F1E7" font-family="Helvetica, Arial, sans-serif" font-size="22">Gubia Digital</text>
  <text x="48" y="598" fill="#FFFFFF" font-family="Helvetica, Arial, sans-serif" font-size="34">${line}</text>
</svg>`;
}

async function frontTitle(dir: string): Promise<string> {
  const source = await readFile(path.join(dir, 'es.mdx'), 'utf8');
  const match = source.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  const data = match ? (parse(match[1] ?? '') as { titulo?: string }) : {};
  return data.titulo?.trim() || path.basename(dir);
}

async function writeCard(dir: string, imageRel: string, title: string, outFile: string) {
  const imagePath = path.join(dir, imageRel.replace(/^\.\//, ''));
  const cover = await sharp(imagePath)
    .resize(WIDTH, HEIGHT, { fit: 'cover', position: 'attention' })
    .toBuffer();
  await mkdir(path.dirname(outFile), { recursive: true });
  await sharp(cover)
    .composite([{ input: Buffer.from(ogOverlay(title)) }])
    .webp({ quality: 82 })
    .toFile(outFile);
}

export async function generateOgImages(contentDir: string, outDir: string): Promise<string[]> {
  const written: string[] = [];
  for (const kind of ['casos', 'proyectos'] as const) {
    const base = path.join(contentDir, kind);
    let entries: string[] = [];
    try {
      const dirs = await readdir(base, { withFileTypes: true });
      entries = dirs.filter((entry) => entry.isDirectory()).map((entry) => entry.name);
    } catch {
      continue;
    }
    const yamlName = kind === 'casos' ? 'caso.yaml' : 'proyecto.yaml';
    for (const slug of entries) {
      if (slug.startsWith('_')) continue;
      const dir = path.join(base, slug);
      let data: { publicar?: boolean; portada?: string };
      try {
        data = parse(await readFile(path.join(dir, yamlName), 'utf8')) as typeof data;
      } catch {
        continue;
      }
      if (!data.publicar || !data.portada) continue;
      const outFile = path.join(outDir, kind, `${slug}.webp`);
      await writeCard(dir, data.portada, await frontTitle(dir), outFile);
      written.push(outFile);
    }
  }
  return written;
}

const isCli = (process.argv[1] ?? '').includes('og.ts');

if (isCli) {
  const contentDir = path.resolve(process.cwd(), 'src/content');
  const outDir = path.resolve(process.cwd(), 'public/og');
  const files = await generateOgImages(contentDir, outDir);
  console.log(`og: ${files.length} imagen${files.length === 1 ? '' : 'es'}`);
}
