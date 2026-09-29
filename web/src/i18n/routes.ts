export const routes = {
  home: { es: '/', en: '/en/' },
  casos: { es: '/casos/', en: '/en/work/' },
  caso: { es: '/casos/[slug]/', en: '/en/work/[slug]/' },
  proyectos: { es: '/proyectos/', en: '/en/projects/' },
  proyecto: { es: '/proyectos/[slug]/', en: '/en/projects/[slug]/' },
  nosotros: { es: '/nosotros/', en: '/en/about/' },
  contacto: { es: '/contacto/', en: '/en/contact/' },
  gracias: { es: '/gracias/', en: '/en/thanks/' },
  avisoLegal: { es: '/aviso-legal/', en: '/en/legal-notice/' },
  privacidad: { es: '/privacidad/', en: '/en/privacy/' },
  cookies: { es: '/cookies/', en: '/en/cookies/' },
} as const;

export type RouteKey = keyof typeof routes;
export type Lang = 'es' | 'en';
