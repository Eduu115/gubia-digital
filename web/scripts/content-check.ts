import { readdir, readFile, stat } from 'node:fs/promises';
import path from 'node:path';
import { parse } from 'yaml';
import sharp from 'sharp';
import {
  collectCasoIssues,
  extractMdxRefs,
  type CasoYaml,
  type Frontmatter,
  type ImageInfo,
  type PreparedCaso,
} from './content-rules';

const IMAGE_RE = /\.(webp|png|jpe?g)$/i;

function frontmatter(source: string): Frontmatter {
  const match = source.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!match) return {};
  const data = parse(match[1] ?? '') as Frontmatter | null;
  return data ?? {};
}

async function imageInfo(file: string): Promise<ImageInfo> {
  const info = await stat(file);
  const meta = await sharp(file).metadata();
  const aspect = meta.width && meta.height ? meta.width / meta.height : undefined;
  return { bytes: info.size, aspect };
}

export async function checkContentRoot(contentDir: string): Promise<{ errors: string[]; warnings: string[] }> {
  const errors: string[] = [];
  const warnings: string[] = [];
  const casosDir = path.join(contentDir, 'casos');

  let slugs: string[] = [];
  try {
    const entries = await readdir(casosDir, { withFileTypes: true });
    slugs = entries.filter((entry) => entry.isDirectory()).map((entry) => entry.name);
  } catch {
    errors.push(`no existe ${casosDir}`);
    return { errors, warnings };
  }

  for (const slug of slugs) {
    const dir = path.join(casosDir, slug);
    const yamlPath = path.join(dir, 'caso.yaml');
    let raw: string;
    try {
      raw = await readFile(yamlPath, 'utf8');
    } catch {
      errors.push(`${slug}: falta caso.yaml`);
      continue;
    }

    const data = (parse(raw) ?? {}) as CasoYaml;
    const readText = async (name: string) => {
      try {
        return await readFile(path.join(dir, name), 'utf8');
      } catch {
        return undefined;
      }
    };

    const es = await readText('es.mdx');
    const en = await readText('en.mdx');
    const mdx = extractMdxRefs(`${es ?? ''}\n${en ?? ''}`);

    const referenced = new Set<string>();
    for (const item of data.comparativas ?? []) {
      if (item.antes) referenced.add(item.antes.replace(/^\.\//, ''));
      if (item.despues) referenced.add(item.despues.replace(/^\.\//, ''));
    }
    for (const item of data.capturas ?? []) {
      if (item.src) referenced.add(item.src.replace(/^\.\//, ''));
    }
    if (data.logo) referenced.add(data.logo.replace(/^\.\//, ''));

    const files: PreparedCaso['files'] = {};
    const walk = async (folder: string) => {
      let entries;
      try {
        entries = await readdir(folder, { withFileTypes: true });
      } catch {
        return;
      }
      for (const entry of entries) {
        const abs = path.join(folder, entry.name);
        if (entry.isDirectory()) {
          await walk(abs);
          continue;
        }
        if (!IMAGE_RE.test(entry.name)) continue;
        const rel = path.relative(dir, abs).split(path.sep).join('/');
        files[rel] = await imageInfo(abs);
      }
    };
    await walk(dir);
    for (const rel of referenced) {
      if (!(rel in files)) files[rel] = undefined;
    }

    const prepared: PreparedCaso = {
      slug,
      data,
      hasEs: es !== undefined,
      hasEn: en !== undefined,
      esFront: es ? frontmatter(es) : undefined,
      enFront: en ? frontmatter(en) : undefined,
      mdx,
      files,
    };
    const issues = collectCasoIssues(prepared);
    errors.push(...issues.errors);
    warnings.push(...issues.warnings);
  }

  return { errors, warnings };
}

const isCli = (process.argv[1] ?? '').includes('content-check.ts');

async function main() {
  const contentDir = path.resolve(process.cwd(), 'src/content');
  const { errors, warnings } = await checkContentRoot(contentDir);
  for (const warning of warnings) console.warn(`aviso: ${warning}`);
  if (errors.length > 0) {
    for (const error of errors) console.error(`error: ${error}`);
    process.exit(1);
  }
  console.log(`content:check OK (${warnings.length} avisos)`);
}

if (isCli) {
  main().catch((error: unknown) => {
    console.error(error);
    process.exit(1);
  });
}
