import type { Bilingual } from './site';
import { siteMode } from './site';

export type Servicio = {
  id: string;
  nombre: Bilingual;
  descripcion: Bilingual;
  precioDesde?: number; // TODO(edu): decidir si se muestran
};

const empresa = siteMode === 'empresa';

export const servicios: Servicio[] = [
  {
    id: 'web-nueva',
    nombre: { es: 'Web nueva', en: 'New website' },
    descripcion: empresa
      ? {
          es: 'Una web clara para que te encuentren y te contacten. Hecha a medida, no de plantilla genérica.',
          en: 'A clear site so people find you and get in touch. Custom-built, not a generic template.',
        }
      : {
          es: 'Una web clara, hecha a medida, como se ve en los casos.',
          en: 'A clear custom site, as the case studies show.',
        },
  },
  {
    id: 'rediseno',
    nombre: { es: 'Rediseño', en: 'Redesign' },
    descripcion: empresa
      ? {
          es: 'Partimos de lo que ya tienes, medimos, y dejamos una web rápida y usable en móvil.',
          en: 'We start from what you have, measure it, and leave a fast mobile-friendly site.',
        }
      : {
          es: 'Partir de una web que ya existía y dejarla rápida y usable en el móvil.',
          en: 'Starting from a site that already existed and leaving it fast and usable on a phone.',
        },
  },
  {
    id: 'seo-local',
    nombre: { es: 'SEO local y presencia', en: 'Local SEO & presence' },
    descripcion: empresa
      ? {
          es: 'Para que tu negocio aparezca cuando alguien busca cerca. Ficha, contenidos y técnica base.',
          en: 'So your business shows up when someone searches nearby. Listing, content and baseline tech.',
        }
      : {
          es: 'Presencia para que un negocio local se encuentre cuando alguien busca cerca.',
          en: 'A presence so a local business can be found when someone searches nearby.',
        },
  },
];
