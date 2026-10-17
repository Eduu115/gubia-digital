import type { Bilingual } from './site';
import { siteMode } from './site';

const portfolio: { titulo: Bilingual; texto: Bilingual }[] = [
  {
    titulo: { es: 'Charla', en: 'Chat' },
    texto: {
      es: 'Se mira el punto de partida y qué había que dejar claro.',
      en: 'It starts from what was there and what had to be made clear.',
    },
  },
  {
    titulo: { es: 'Relato', en: 'Account' },
    texto: {
      es: 'El trabajo se cuenta con lo que se hizo, sin precios.',
      en: 'The work is told through what was built, without prices.',
    },
  },
  {
    titulo: { es: 'Diseño y desarrollo', en: 'Design & build' },
    texto: {
      es: 'Diseño y desarrollo, con las revisiones que hicieron falta.',
      en: 'Design and build, with the review rounds it took.',
    },
  },
  {
    titulo: { es: 'Entrega', en: 'Handoff' },
    texto: {
      es: 'El resultado queda publicado aquí cuando hay permiso.',
      en: 'The result is published here when there is permission.',
    },
  },
];

const empresa: { titulo: Bilingual; texto: Bilingual }[] = [
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
      es: 'Alcance claro y precio cerrado. Sin sorpresas a mitad de camino.',
      en: 'Clear scope and a fixed price. No surprises halfway through.',
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

export const proceso = siteMode === 'empresa' ? empresa : portfolio;
