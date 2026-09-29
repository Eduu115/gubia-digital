import { routes, type Lang, type RouteKey } from './routes';

export function localizedPath(key: RouteKey, lang: Lang, params?: Record<string, string>): string {
  let path: string = routes[key][lang];
  if (params) {
    for (const [k, v] of Object.entries(params)) {
      path = path.replace(`[${k}]`, v);
    }
  }
  return path;
}

export function t(
  dict: Record<string, Record<Lang, string>>,
  key: string,
  lang: Lang,
): string {
  return dict[key]?.[lang] ?? key;
}

export function formatNumber(value: number, lang: Lang, options?: Intl.NumberFormatOptions): string {
  return new Intl.NumberFormat(lang === 'es' ? 'es-ES' : 'en-US', options).format(value);
}

export function formatMonth(ym: string, lang: Lang): string {
  const [y, m] = ym.split('-').map(Number);
  const d = new Date(y, (m || 1) - 1, 1);
  return new Intl.DateTimeFormat(lang === 'es' ? 'es-ES' : 'en-US', {
    month: 'short',
    year: 'numeric',
  }).format(d);
}

export function alternateLang(lang: Lang): Lang {
  return lang === 'es' ? 'en' : 'es';
}
