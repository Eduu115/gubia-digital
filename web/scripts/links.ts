import { existsSync } from 'node:fs';
import { readdir, readFile } from 'node:fs/promises';
import path from 'node:path';

const ATTR = /(?:href|src)="([^"]+)"/g;

export function localTargets(html: string): string[] {
  const found = new Set<string>();
  for (const match of html.matchAll(ATTR)) {
    const raw = match[1]?.trim() ?? '';
    if (!raw || raw.startsWith('#') || raw.startsWith('mailto:') || raw.startsWith('tel:') || raw.startsWith('data:')) {
      continue;
    }
    if (/^https?:\/\//i.test(raw)) continue;
    found.add(raw.split('#')[0]?.split('?')[0] ?? raw);
  }
  return [...found];
}

export function resolves(distDir: string, pageFile: string, target: string): boolean {
  const base = target.startsWith('/')
    ? path.join(distDir, target.replace(/^\//, ''))
    : path.resolve(path.dirname(pageFile), target);
  const candidates = [base, path.join(base, 'index.html'), `${base}.html`];
  return candidates.some((candidate) => existsSync(candidate));
}

async function htmlFiles(dir: string): Promise<string[]> {
  const out: string[] = [];
  const entries = await readdir(dir, { withFileTypes: true });
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...(await htmlFiles(full)));
    else if (entry.name.endsWith('.html')) out.push(full);
  }
  return out;
}

export async function brokenLinks(distDir: string): Promise<string[]> {
  const errors: string[] = [];
  for (const file of await htmlFiles(distDir)) {
    const html = await readFile(file, 'utf8');
    for (const target of localTargets(html)) {
      if (!resolves(distDir, file, target)) {
        errors.push(`${path.relative(distDir, file)} → ${target}`);
      }
    }
  }
  return errors;
}

const isCli = (process.argv[1] ?? '').includes('links.ts');

if (isCli) {
  const distDir = path.resolve(process.cwd(), 'dist');
  const errors = await brokenLinks(distDir);
  if (errors.length > 0) {
    for (const error of errors) console.error(`enlace roto: ${error}`);
    process.exit(1);
  }
  console.log('links OK');
}
