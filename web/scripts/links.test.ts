import { mkdir, mkdtemp, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { afterEach, describe, expect, it } from 'vitest';
import { brokenLinks, localTargets, resolves } from './links';

describe('localTargets', () => {
  it('ignora externos, anclas y mailto', () => {
    const html = '<a href="/casos/">Casos</a><a href="https://confemerana.es/">web</a><a href="#faq">faq</a><a href="mailto:a@b.c">m</a>';
    expect(localTargets(html)).toEqual(['/casos/']);
  });
});

describe('brokenLinks', () => {
  const dirs: string[] = [];
  afterEach(async () => {
    const { rm } = await import('node:fs/promises');
    await Promise.all(dirs.splice(0).map((dir) => rm(dir, { recursive: true, force: true })));
  });

  it('falla si el destino interno no está en dist', async () => {
    const root = await mkdtemp(path.join(tmpdir(), 'gubia-links-'));
    dirs.push(root);
    await mkdir(path.join(root, 'casos'), { recursive: true });
    await writeFile(path.join(root, 'index.html'), '<a href="/casos/">ok</a><a href="/no-existe/">mal</a>');
    await writeFile(path.join(root, 'casos/index.html'), '<img src="/favicon.ico" alt="">');
    expect(resolves(root, path.join(root, 'index.html'), '/casos/')).toBe(true);
    const errors = await brokenLinks(root);
    expect(errors.some((error) => error.includes('/no-existe/'))).toBe(true);
    expect(errors.some((error) => error.includes('favicon.ico'))).toBe(true);
  });
});
