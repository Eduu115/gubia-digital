export interface Bilingual {
  es?: string;
  en?: string;
}

export interface CasoYaml {
  anonimo?: boolean;
  clienteAnonimo?: Bilingual;
  publicar?: boolean;
  logo?: string;
  permisos?: {
    publicarCaso?: boolean;
    mostrarLogo?: boolean;
    testimonio?: boolean;
    fechaConsentimiento?: string;
  };
  puntoDePartida?: { tipo?: string };
  comparativas?: Array<{
    id?: string;
    dispositivo?: string;
    antes?: string;
    despues?: string;
    alt?: { antes?: Bilingual; despues?: Bilingual };
  }>;
  capturas?: Array<{
    id?: string;
    src?: string;
    alt?: Bilingual;
  }>;
  metricas?: Array<{
    id?: string;
    clave?: string;
    fuente?: string;
    fechaAntes?: string;
    fechaDespues?: string;
    etiqueta?: Bilingual;
    unidad?: string;
    mejor?: string;
  }>;
  testimonio?: unknown;
}

export interface Frontmatter {
  resumen?: string;
  descripcionSeo?: string;
}

export interface ImageInfo {
  bytes: number;
  aspect?: number;
}

export interface PreparedCaso {
  slug: string;
  data: CasoYaml;
  hasEs: boolean;
  hasEn: boolean;
  esFront?: Frontmatter;
  enFront?: Frontmatter;
  mdx: { comparativa: string[]; captura: string[]; metrica: string[] };
  /** Rutas tal como aparecen en el YAML (`./img/x.webp`). */
  files: Record<string, ImageInfo | undefined>;
}

const MB = 3 * 1024 * 1024;

function filled(value?: Bilingual): boolean {
  return Boolean(value?.es?.trim() && value?.en?.trim());
}

function norm(rel: string): string {
  return rel.replace(/^\.\//, '');
}

export function extractMdxRefs(source: string): PreparedCaso['mdx'] {
  const grab = (tag: string) => {
    const re = new RegExp(`<${tag}\\b([^>]*)>`, 'gi');
    const ids: string[] = [];
    for (const match of source.matchAll(re)) {
      const id = match[1]?.match(/\bid\s*=\s*["']([^"']+)["']/i);
      ids.push(id?.[1] ?? '');
    }
    return ids;
  };
  return {
    comparativa: grab('Comparativa'),
    captura: grab('Captura'),
    metrica: grab('Metrica'),
  };
}

function aspectOff(a: number, b: number): boolean {
  const base = Math.max(a, b);
  if (base === 0) return true;
  return Math.abs(a - b) / base > 0.01;
}

export function collectCasoIssues(caso: PreparedCaso): { errors: string[]; warnings: string[] } {
  const errors: string[] = [];
  const warnings: string[] = [];
  const { slug, data } = caso;
  const at = (message: string) => errors.push(`${slug}: ${message}`);

  if (data.publicar && !caso.hasEs) {
    at('publicado sin es.mdx');
  }
  if (!caso.hasEn) {
    warnings.push(`${slug}: falta en.mdx`);
  }

  for (const [lang, front] of [
    ['es', caso.esFront],
    ['en', caso.enFront],
  ] as const) {
    if (!front) continue;
    if ((front.resumen?.length ?? 0) > 160) {
      warnings.push(`${slug}: resumen ${lang} supera 160 caracteres`);
    }
    if ((front.descripcionSeo?.length ?? 0) > 155) {
      warnings.push(`${slug}: descripcionSeo ${lang} supera 155 caracteres`);
    }
  }

  if (data.anonimo && !filled(data.clienteAnonimo)) {
    at('anonimo sin clienteAnonimo en es y en');
  }
  if (data.permisos?.publicarCaso && !data.permisos.fechaConsentimiento?.trim()) {
    at('permisos.publicarCaso sin fechaConsentimiento');
  }
  if (data.testimonio && data.permisos?.testimonio !== true) {
    at('hay testimonio sin permisos.testimonio');
  }
  if (data.logo && data.permisos?.mostrarLogo !== true) {
    at('hay logo sin permisos.mostrarLogo');
  }

  const tipo = data.puntoDePartida?.tipo;
  const comparativas = data.comparativas ?? [];
  const capturas = data.capturas ?? [];
  if (tipo === 'web' && comparativas.length === 0) {
    at('puntoDePartida web sin comparativas');
  }
  if ((tipo === 'sin-web' || tipo === 'otro') && capturas.length === 0) {
    at(`puntoDePartida ${tipo} sin capturas`);
  }

  const byId = new Map<string, string[]>();
  for (const item of comparativas) {
    const id = item.id?.trim() ?? '';
    if (!id) {
      at('comparativa sin id');
      continue;
    }
    const devices = byId.get(id) ?? [];
    devices.push(item.dispositivo ?? '');
    byId.set(id, devices);

    if (!filled(item.alt?.antes) || !filled(item.alt?.despues)) {
      at(`comparativa "${id}" sin alt en es y en`);
    }
    for (const rel of [item.antes, item.despues]) {
      if (!rel) {
        at(`comparativa "${id}" sin imagen`);
        continue;
      }
      const info = caso.files[norm(rel)];
      if (!info) {
        at(`imagen no encontrada: ${rel}`);
        continue;
      }
      if (info.bytes > MB) at(`imagen supera 3 MB: ${rel}`);
    }
    if (item.antes && item.despues) {
      const before = caso.files[norm(item.antes)];
      const after = caso.files[norm(item.despues)];
      if (before?.aspect && after?.aspect && aspectOff(before.aspect, after.aspect)) {
        at(
          `comparativa "${id}" tiene distinta relación de aspecto (antes ${before.aspect.toFixed(3)}, después ${after.aspect.toFixed(3)})`,
        );
      }
    }
  }

  for (const [id, devices] of byId) {
    const unique = new Set(devices);
    const pairOk = devices.length === 2 && unique.has('desktop') && unique.has('movil');
    if (devices.length > 1 && !pairOk) {
      at(`id repetido en comparativas: "${id}" (solo se permite el par desktop + movil)`);
    }
  }

  const capturaIds = new Set<string>();
  for (const item of capturas) {
    const id = item.id?.trim() ?? '';
    if (!id) {
      at('captura sin id');
      continue;
    }
    if (capturaIds.has(id)) at(`id repetido en capturas: "${id}"`);
    capturaIds.add(id);
    if (!filled(item.alt)) at(`captura "${id}" sin alt en es y en`);
    if (!item.src) {
      at(`captura "${id}" sin src`);
    } else {
      const info = caso.files[norm(item.src)];
      if (!info) at(`imagen no encontrada: ${item.src}`);
      else if (info.bytes > MB) at(`imagen supera 3 MB: ${item.src}`);
    }
  }

  const metricaIds = new Set<string>();
  for (const item of data.metricas ?? []) {
    const id = (item.id ?? item.clave ?? '').trim();
    if (!id) {
      at('métrica sin id ni clave');
      continue;
    }
    if (metricaIds.has(id)) at(`id repetido en métricas: "${id}"`);
    metricaIds.add(id);
    if (!item.fuente?.trim() || !item.fechaAntes?.trim() || !item.fechaDespues?.trim()) {
      at(`métrica "${id}" sin fuente o fechas`);
    }
    if (item.clave === 'custom' && (!filled(item.etiqueta) || !item.unidad?.trim() || !item.mejor)) {
      at(`métrica custom "${id}" sin etiqueta, unidad o mejor`);
    }
  }

  const knownComparativa = new Set(comparativas.map((item) => item.id).filter(Boolean));
  const knownCaptura = capturaIds;
  const knownMetrica = metricaIds;
  for (const id of caso.mdx.comparativa) {
    if (!id || !knownComparativa.has(id)) at(`MDX usa <Comparativa id="${id}"> y no existe`);
  }
  for (const id of caso.mdx.captura) {
    if (!id || !knownCaptura.has(id)) at(`MDX usa <Captura id="${id}"> y no existe`);
  }
  for (const id of caso.mdx.metrica) {
    if (!id || !knownMetrica.has(id)) at(`MDX usa <Metrica id="${id}"> y no existe`);
  }

  for (const [rel, info] of Object.entries(caso.files)) {
    if (info && info.bytes > MB) {
      const message = `${slug}: imagen supera 3 MB: ${rel}`;
      if (!errors.includes(message) && !errors.some((error) => error.includes(rel) && error.includes('3 MB'))) {
        errors.push(message);
      }
    }
  }

  return { errors, warnings };
}
