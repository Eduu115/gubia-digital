import type { Bilingual } from './site';

export const faq: { q: Bilingual; a: Bilingual }[] = [
  {
    q: { es: '¿Cuánto cuesta?', en: 'How much does it cost?' },
    a: {
      es: 'Depende del alcance. Te damos un precio cerrado en la propuesta.',
      en: 'It depends on scope. You get a fixed price in the proposal.',
    },
  },
  {
    q: { es: '¿Cuánto se tarda?', en: 'How long does it take?' },
    a: {
      es: 'Una ampliación pequeña va de 1 a 2 semanas. Una ampliación grande o una web completa, de 2 a 4 semanas, o de 3 a 6 si hay más funcionalidades. El plazo cerrado va en la propuesta.',
      en: 'A small addition takes 1 to 2 weeks. A large addition or a full site takes 2 to 4 weeks, or 3 to 6 if there is more functionality. The fixed schedule is in the proposal.',
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
