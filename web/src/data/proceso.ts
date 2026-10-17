import type { Bilingual } from './site';

export const proceso: { titulo: Bilingual; texto: Bilingual }[] = [
  {
    titulo: { es: 'Charla', en: 'Chat' },
    texto: {
      es: 'Nos cuentas el negocio, a quién atiendes y qué quieres conseguir.',
      en: 'You tell us about the business, who you serve and what you want to achieve.',
    },
  },
  {
    titulo: { es: 'Propuesta', en: 'Proposal' },
    texto: {
      es: 'Definimos qué hay que construir y cómo se va a usar.',
      en: 'We define what has to be built and how it will be used.',
    },
  },
  {
    titulo: { es: 'Diseño y desarrollo', en: 'Design & build' },
    texto: {
      es: 'Iteramos contigo. Revisiones acordadas hasta que quede tallado.',
      en: 'We iterate with you. Agreed review rounds until it feels right.',
    },
  },
  {
    titulo: { es: 'Entrega', en: 'Handoff' },
    texto: {
      es: 'Dominio y código a tu nombre. Mantenimiento opcional, sin permanencia.',
      en: 'Domain and code in your name. Optional maintenance, no lock-in.',
    },
  },
];
