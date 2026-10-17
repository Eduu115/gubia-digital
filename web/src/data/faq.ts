import type { Bilingual } from './site';
import { siteMode } from './site';

const portfolio: { q: Bilingual; a: Bilingual }[] = [
  {
    q: { es: '¿Esta web vende servicios?', en: 'Does this site sell services?' },
    a: {
      es: 'No. Gubia Digital es el nombre del portfolio de Eduardo Serrano. Hay casos ya hechos y proyectos propios. No hay precios.',
      en: 'No. Gubia Digital is the name of Eduardo Serrano’s portfolio. It shows finished work and personal projects. There are no prices.',
    },
  },
  {
    q: { es: '¿Cuánto se tarda?', en: 'How long does it take?' },
    a: {
      es: 'Una ampliación pequeña del trabajo mostrado va de 1 a 2 semanas. Una web completa, de 2 a 6, según lo que hubiera que construir.',
      en: 'A small addition in the work shown takes 1 to 2 weeks. A full site takes 2 to 6, depending on what had to be built.',
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
      es: 'En los casos, el código quedó en manos de quien encargó el trabajo.',
      en: 'In the case studies, the code stayed with the person who commissioned the work.',
    },
  },
  {
    q: { es: '¿La web es mía?', en: 'Is the website mine?' },
    a: {
      es: 'Sí. Código y dominio a nombre de quien encargó el trabajo.',
      en: 'Yes. Code and domain in the name of the person who commissioned it.',
    },
  },
  {
    q: { es: '¿Hacéis tiendas online?', en: 'Do you build online stores?' },
    a: {
      es: 'En algún caso sí, cuando el trabajo lo pedía. Aquí no se contrata ninguna.',
      en: 'In some of the work, yes, when it called for one. Nothing is for sale on this site.',
    },
  },
];

const empresa: { q: Bilingual; a: Bilingual }[] = [
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
      es: 'Una ampliación pequeña va de 1 a 2 semanas. Una web completa, de 2 a 6, según las funcionalidades. El plazo se cierra en la propuesta.',
      en: 'A small addition takes 1 to 2 weeks. A full site takes 2 to 6, depending on features. The schedule is fixed in the proposal.',
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
      es: 'Sí, cuando el negocio lo necesita. Lo vemos en la propuesta.',
      en: 'Yes, when the business needs one. We look at it in the proposal.',
    },
  },
];

export const faq = siteMode === 'empresa' ? empresa : portfolio;
