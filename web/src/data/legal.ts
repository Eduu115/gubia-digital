import type { Lang, RouteKey } from '../i18n/routes';
import { site, siteMode } from './site';

export type LegalBlock = { heading: string; body: string[] };

type LegalKey = Extract<RouteKey, 'avisoLegal' | 'privacidad' | 'cookies'>;

const copy: Record<LegalKey, Record<Lang, { description: string; blocks: LegalBlock[] }>> = {
  avisoLegal: {
    es: {
      description: 'Aviso legal de Gubia Digital. Responsable: Eduardo Serrano.',
      blocks: [
        {
          heading: 'Quién publica',
          body: [
            `${site.person} es el titular de este sitio y lo publica con el nombre ${site.name}. Ese nombre es su forma de firmar el trabajo; no es una marca registrada. El contacto es ${site.email} y el teléfono ${site.phoneDisplay}.`,
            'Esta web es un portfolio: muestra trabajo ya hecho y proyectos propios. No ofrece servicios ni precios.',
          ],
        },
        {
          heading: 'A qué se dedica',
          body: [
            'Gubia Digital es ese nombre. El trabajo que se ve aquí ya está hecho. No hay catálogo de servicios ni precios.',
          ],
        },
        {
          heading: 'Propiedad',
          body: [
            'Los textos y la marca de este sitio son de Eduardo Serrano. Los casos de clientes se publican con su permiso. API Arena, saveToWin y serdrive son proyectos propios.',
          ],
        },
        {
          heading: 'Enlaces',
          body: [
            'Hay enlaces a webs de clientes y a proyectos propios. Cada una tiene su propio responsable.',
          ],
        },
        {
          heading: 'Ley',
          body: ['Se aplica la ley española.'],
        },
      ],
    },
    en: {
      description: 'Legal notice for Gubia Digital. Responsible person: Eduardo Serrano.',
      blocks: [
        {
          heading: 'Who publishes this site',
          body: [
            `${site.person} owns this site and publishes it under the name ${site.name}. That name is how he signs the work; it is not a registered trademark. Contact: ${site.email} and ${site.phoneDisplay}.`,
            'This website is a portfolio: it shows finished work and personal projects. It does not offer services or prices.',
          ],
        },
        {
          heading: 'What the business does',
          body: [
            'Gubia Digital is that name. The work shown here is already done. There is no service menu and no prices.',
          ],
        },
        {
          heading: 'Ownership',
          body: [
            'The copy and the brand on this site belong to Eduardo Serrano. Client work is published with their permission. API Arena, saveToWin and serdrive are his own projects.',
          ],
        },
        {
          heading: 'Links',
          body: ['Links go out to client sites and to his own projects. Each one has its own owner.'],
        },
        {
          heading: 'Law',
          body: ['Spanish law applies.'],
        },
      ],
    },
  },
  privacidad: {
    es: {
      description: 'Política de privacidad de Gubia Digital: qué datos pide el formulario y cuánto se guardan.',
      blocks: [
        {
          heading: 'Responsable',
          body: [
            `${site.person}, bajo el nombre ${site.name}. Escribe a ${site.email} o llama al ${site.phoneDisplay}.`,
          ],
        },
        {
          heading: 'Qué datos',
          body: [
            'Si envías el formulario: nombre, email, teléfono si lo das, mensaje, idioma y la página desde la que llegaste.',
            'Guardamos un hash de la dirección IP, no la IP en claro, para limitar envíos repetidos. No armamos un perfil comercial con eso.',
          ],
        },
        {
          heading: 'Para qué',
          body: [
            'Para leer tu mensaje y contestarte. No vendemos esos datos ni los usamos para publicidad.',
          ],
        },
        {
          heading: 'Por qué podemos',
          body: [
            'Porque lo pides al marcar la casilla y enviar el mensaje.',
          ],
        },
        {
          heading: 'Cuánto tiempo',
          body: ['Los mensajes se borran a los 12 meses.'],
        },
        {
          heading: 'Dónde están',
          body: [
            'En una base de datos del servidor que opera el responsable. No se ceden a una red de anuncios.',
          ],
        },
        {
          heading: 'Tus derechos',
          body: [
            'Puedes pedir acceso, rectificación, supresión, oposición, limitación y portabilidad. Escríbenos al email. También puedes reclamar ante la Agencia Española de Protección de Datos (aepd.es).',
          ],
        },
        {
          heading: 'Menores',
          body: ['El formulario es para negocios. No pedimos datos de menores.'],
        },
      ],
    },
    en: {
      description: 'Gubia Digital privacy policy: what the form collects and how long it is kept.',
      blocks: [
        {
          heading: 'Who is responsible',
          body: [
            `${site.person}, under the name ${site.name}. Email ${site.email} or call ${site.phoneDisplay}.`,
          ],
        },
        {
          heading: 'What we collect',
          body: [
            'If you send the form: name, email, phone if you give it, message, language, and the page you came from.',
            'We store a hash of the IP address, not the raw IP, to limit repeated submissions. We do not build a marketing profile from it.',
          ],
        },
        {
          heading: 'Why',
          body: ['To read your message and reply. We do not sell the data or use it for advertising.'],
        },
        {
          heading: 'Legal basis',
          body: [
            'You ask us to, by ticking the box and sending the message.',
          ],
        },
        {
          heading: 'How long',
          body: ['Messages are deleted after 12 months.'],
        },
        {
          heading: 'Where',
          body: [
            'In a database on the server operated by the person responsible. They are not passed to an ad network.',
          ],
        },
        {
          heading: 'Your rights',
          body: [
            'You can ask for access, correction, deletion, objection, restriction and portability. Email us. You can also complain to the Spanish Data Protection Agency (aepd.es).',
          ],
        },
        {
          heading: 'Children',
          body: ['The form is for businesses. We do not ask for data about children.'],
        },
      ],
    },
  },
  cookies: {
    es: {
      description: 'Gubia Digital no usa cookies de analítica ni de publicidad. No hay banner.',
      blocks: [
        {
          heading: 'Qué hay',
          body: [
            'Esta web no instala cookies de analítica ni de publicidad. Por eso no hay banner de consentimiento.',
            'El formulario no usa cookies.',
          ],
        },
        {
          heading: 'Cookies técnicas',
          body: [
            'Si el acceso pasa por Cloudflare, puede aparecer una cookie técnica de seguridad, necesaria para la conexión. No la usamos para hacer un perfil.',
            'Cuando activemos un filtro contra envíos automáticos en el formulario, servirá solo para distinguir personas de bots.',
          ],
        },
      ],
    },
    en: {
      description: 'Gubia Digital does not use analytics or advertising cookies. There is no banner.',
      blocks: [
        {
          heading: 'What is in use',
          body: [
            'This site does not set analytics or advertising cookies. That is why there is no consent banner.',
            'The form does not use cookies.',
          ],
        },
        {
          heading: 'Technical cookies',
          body: [
            'If traffic passes through Cloudflare, a technical security cookie may appear. It is there for the connection. We do not use it to build a profile.',
            'When we turn on a filter against automated form posts, it will only separate people from bots.',
          ],
        },
      ],
    },
  },
};

export function legalDocument(key: LegalKey, lang: Lang) {
  const page = copy[key][lang];
  if (siteMode !== 'empresa') return page;
  if (key === 'avisoLegal' && lang === 'es') {
    return {
      ...page,
      blocks: page.blocks.map((block) => {
        if (block.heading === 'Quién publica') {
          return {
            ...block,
            body: [
              `${site.person} ofrece servicios bajo el nombre ${site.name}. El contacto es ${site.email} y el teléfono ${site.phoneDisplay}.`,
              `NIF: ${site.nif || 'pendiente'}. Domicilio: ${site.domicilio || 'pendiente'}.`,
            ],
          };
        }
        if (block.heading === 'A qué se dedica') {
          return {
            ...block,
            body: [
              'Gubia Digital diseña y desarrolla aplicaciones web. El precio y el plazo se cierran en cada propuesta.',
            ],
          };
        }
        return block;
      }),
    };
  }
  if (key === 'avisoLegal' && lang === 'en') {
    return {
      ...page,
      blocks: page.blocks.map((block) => {
        if (block.heading === 'Who publishes this site') {
          return {
            ...block,
            body: [
              `${site.person} offers services under the name ${site.name}. Contact: ${site.email} and ${site.phoneDisplay}.`,
              `Tax ID: ${site.nif || 'pending'}. Address: ${site.domicilio || 'pending'}.`,
            ],
          };
        }
        if (block.heading === 'What the business does') {
          return {
            ...block,
            body: ['Gubia Digital designs and builds web applications. Price and schedule are fixed in each proposal.'],
          };
        }
        return block;
      }),
    };
  }
  return page;
}
