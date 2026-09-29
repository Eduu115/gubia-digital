import type { Bilingual } from './site';

export type Servicio = {
  id: string;
  nombre: Bilingual;
  descripcion: Bilingual;
  precioDesde?: number; // TODO(edu): decidir si se muestran
};

export const servicios: Servicio[] = [
  {
    id: 'web-nueva',
    nombre: { es: 'Web nueva', en: 'New website' },
    descripcion: {
      es: 'Una web clara para que te encuentren y te contacten. Hecha a medida, no de plantilla genérica.',
      en: 'A clear site so people find you and get in touch. Custom-built, not a generic template.',
    },
  },
  {
    id: 'rediseno',
    nombre: { es: 'Rediseño', en: 'Redesign' },
    descripcion: {
      es: 'Partimos de lo que ya tienes, medimos, y dejamos una web rápida y usable en móvil.',
      en: 'We start from what you have, measure it, and leave a fast mobile-friendly site.',
    },
  },
  {
    id: 'seo-local',
    nombre: { es: 'SEO local y presencia', en: 'Local SEO & presence' },
    descripcion: {
      es: 'Para que tu negocio aparezca cuando alguien busca cerca. Ficha, contenidos y técnica base.',
      en: 'So your business shows up when someone searches nearby. Listing, content and baseline tech.',
    },
  },
];
