import { mkdtemp, mkdir, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { afterEach, describe, expect, it } from 'vitest';
import sharp from 'sharp';
import { checkContentRoot } from './content-check';

const dirs: string[] = [];

afterEach(async () => {
  await Promise.all(dirs.splice(0).map((dir) => rm(dir, { recursive: true, force: true })));
});

describe('checkContentRoot', () => {
  it('detecta un par de imágenes con distinta proporción', async () => {
    const root = await mkdtemp(path.join(tmpdir(), 'gubia-content-'));
    dirs.push(root);
    const caso = path.join(root, 'casos', 'torcido');
    const img = path.join(caso, 'img');
    await mkdir(img, { recursive: true });
    await sharp({
      create: { width: 200, height: 100, channels: 3, background: { r: 20, g: 40, b: 30 } },
    })
      .webp()
      .toFile(path.join(img, 'antes.webp'));
    await sharp({
      create: { width: 100, height: 100, channels: 3, background: { r: 200, g: 80, b: 20 } },
    })
      .webp()
      .toFile(path.join(img, 'despues.webp'));
    await writeFile(
      path.join(caso, 'caso.yaml'),
      `publicar: false
permisos:
  publicarCaso: false
puntoDePartida:
  tipo: web
comparativas:
  - id: home
    dispositivo: desktop
    antes: ./img/antes.webp
    despues: ./img/despues.webp
    alt:
      antes: { es: "a", en: "a" }
      despues: { es: "b", en: "b" }
`,
    );
    await writeFile(path.join(caso, 'es.mdx'), '---\ntitulo: Demo\nresumen: Demo\ndescripcionSeo: Demo\n---\n');

    const { errors } = await checkContentRoot(root);
    expect(errors.some((error) => error.includes('relación de aspecto'))).toBe(true);
  });
});
