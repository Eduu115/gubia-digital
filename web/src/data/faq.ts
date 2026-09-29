import type { Bilingual } from './site';

export const faq: { q: Bilingual; a: Bilingual }[] = [
  {
    q: { es: '¿Cuánto cuesta?', en: 'How much does it cost?' },
    a: {
      es: 'Depende del alcance. Te damos un precio cerrado en la propuesta. TODO(edu): rangos si se publican.',
      en: 'It depends on scope. You get a fixed price in the proposal. TODO(edu): publish ranges if decided.',
    },
  },
  {
    q: { es: '¿Cuánto se tarda?', en: 'How long does it take?' },
    a: {
      es: 'Un rediseño típico de pyme local suele ir de pocas semanas a un par de meses, según contenido y revisiones. TODO(edu): plazos reales.',
      en: 'A typical local-business redesign takes a few weeks to a couple of months, depending on content and reviews. TODO(edu): real timelines.',
    },
  },
  {
    q: { es: '¿Qué necesito aportar?', en: 'What do I need to provide?' },
    a: {
      es: 'Fotos, textos básicos, horarios, cómo quieres que te contacten, y acceso a dominio o redes si hace falta.',
      en: 'Photos, basic copy, opening hours, how you want people to contact you, and domain or social access if needed.',
    },
  },
  {
    q: { es: '¿Quién mantiene la web?', en: 'Who maintains the site?' },
    a: {
      es: 'Puedes hacerlo tú o contratar mantenimiento con nosotros. Sin permanencia.',
      en: 'You can do it yourself or hire us for maintenance. No lock-in.',
    },
  },
  {
    q: { es: '¿La web es mía?', en: 'Is the website mine?' },
    a: {
      es: 'Sí. Código y dominio a tu nombre.',
      en: 'Yes. Code and domain in your name.',
    },
  },
  {
    q: { es: '¿Hacéis tiendas online?', en: 'Do you build online stores?' },
    a: {
      es: 'Sí, cuando el negocio lo necesita. Lo valoramos en la propuesta.',
      en: 'Yes, when the business needs one. We scope it in the proposal.',
    },
  },
];
