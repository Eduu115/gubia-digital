import type { Lang } from './routes';

type Dict = Record<string, Record<Lang, string>>;

export const ui: Dict = {
  'nav.casos': { es: 'Casos', en: 'Work' },
  'nav.proyectos': { es: 'Proyectos', en: 'Projects' },
  'nav.nosotros': { es: 'Nosotros', en: 'About' },
  'nav.contacto': { es: 'Contacto', en: 'Contact' },
  'nav.cta': { es: 'Pide presupuesto', en: 'Get a quote' },
  'nav.menu': { es: 'Menú', en: 'Menu' },
  'nav.close': { es: 'Cerrar', en: 'Close' },
  'skip': { es: 'Saltar al contenido', en: 'Skip to content' },
  'lang.es': { es: 'ES', en: 'ES' },
  'lang.en': { es: 'EN', en: 'EN' },
  'lang.label': { es: 'Idioma', en: 'Language' },

  'hero.title': {
    es: 'Tu negocio, bien tallado en internet',
    en: 'Your business, crafted for the web',
  },
  'hero.sub': {
    es: 'Webs a medida para pymes locales. Precio cerrado, sin sorpresas.',
    en: 'Custom sites for local businesses. Fixed price, no surprises.',
  },
  'hero.cta.primary': { es: 'Pide presupuesto', en: 'Get a quote' },
  'hero.cta.secondary': { es: 'Ver casos', en: 'See work' },
  'hero.fallback': {
    es: 'Oficio digital para negocios de barrio',
    en: 'Digital craft for neighborhood businesses',
  },

  'garantias.precio': { es: 'Precio cerrado', en: 'Fixed price' },
  'garantias.tuya': { es: 'Web tuya (código y dominio a tu nombre)', en: 'Your site (code and domain in your name)' },
  'garantias.carga': { es: 'Pensada para cargar rápido', en: 'Built to load fast' },
  'garantias.permanencia': { es: 'Sin permanencia', en: 'No lock-in' },

  'casos.title': { es: 'Casos', en: 'Selected work' },
  'casos.cta': { es: '¿Tu negocio es el siguiente?', en: 'Is your business next?' },
  'casos.empty': {
    es: 'Pronto publicaremos los primeros casos con permiso de los clientes.',
    en: 'We will publish the first cases once clients give permission.',
  },
  'casos.all': { es: 'Ver todos los casos', en: 'View all work' },

  'servicios.title': { es: 'Qué hacemos', en: 'What we do' },
  'proceso.title': { es: 'Cómo trabajamos', en: 'How we work' },
  'proyectos.title': { es: 'Lo que construimos por nuestra cuenta', en: 'What we build on our own' },
  'faq.title': { es: 'Preguntas frecuentes', en: 'FAQ' },
  'cta.title': { es: 'Cuéntanos tu negocio', en: 'Tell us about your business' },
  'cta.sub': {
    es: 'Respondemos en un plazo razonable. TODO(edu): plazo exacto.',
    en: 'We reply within a reasonable time. TODO(edu): exact SLA.',
  },

  'compare.before': { es: 'Antes', en: 'Before' },
  'compare.after': { es: 'Después', en: 'After' },
  'compare.label': { es: 'Comparar antes y después', en: 'Compare before and after' },
  'compare.desktop': { es: 'Escritorio', en: 'Desktop' },
  'compare.mobile': { es: 'Móvil', en: 'Mobile' },

  'form.name': { es: 'Nombre', en: 'Name' },
  'form.email': { es: 'Email', en: 'Email' },
  'form.phone': { es: 'Teléfono / WhatsApp', en: 'Phone / WhatsApp' },
  'form.business': { es: 'Nombre del negocio', en: 'Business name' },
  'form.businessType': { es: 'Tipo de negocio', en: 'Business type' },
  'form.need': { es: 'Qué necesitas', en: 'What you need' },
  'form.web': { es: 'Web actual (si tienes)', en: 'Current website (if any)' },
  'form.budget': { es: 'Presupuesto orientativo', en: 'Rough budget' },
  'form.timeline': { es: 'Plazo', en: 'Timeline' },
  'form.message': { es: 'Mensaje', en: 'Message' },
  'form.consent': {
    es: 'He leído y acepto la política de privacidad',
    en: 'I have read and accept the privacy policy',
  },
  'form.submit': { es: 'Enviar', en: 'Send' },
  'form.sending': { es: 'Enviando…', en: 'Sending…' },
  'form.error': {
    es: 'No hemos podido enviar el formulario. Escríbenos por email o WhatsApp.',
    en: 'We could not send the form. Reach us by email or WhatsApp.',
  },
  'form.optional': { es: 'opcional', en: 'optional' },
  'form.budget.unknown': { es: 'No lo sé', en: 'Not sure' },
  'form.timeline.relaxed': { es: 'Sin prisa', en: 'No rush' },
  'form.timeline.month': { es: 'En 1 mes', en: 'Within a month' },
  'form.timeline.urgent': { es: 'Urgente', en: 'Urgent' },
  'form.need.nueva': { es: 'Web nueva', en: 'New website' },
  'form.need.rediseno': { es: 'Rediseño', en: 'Redesign' },
  'form.need.tienda': { es: 'Tienda online', en: 'Online store' },
  'form.need.seo': { es: 'Aparecer en Google / SEO local', en: 'Show up on Google / local SEO' },
  'form.need.mantenimiento': { es: 'Mantenimiento', en: 'Maintenance' },
  'form.need.otra': { es: 'Otra', en: 'Other' },

  'footer.nav': { es: 'Navegación', en: 'Navigation' },
  'footer.legal': { es: 'Legal', en: 'Legal' },
  'footer.aviso': { es: 'Aviso legal', en: 'Legal notice' },
  'footer.privacidad': { es: 'Privacidad', en: 'Privacy' },
  'footer.cookies': { es: 'Cookies', en: 'Cookies' },
  'footer.tagline': { es: 'Webs a medida, con oficio.', en: 'Custom websites, with craft.' },
  'footer.rights': { es: 'Gubia Digital', en: 'Gubia Digital' },

  'gracias.title': { es: 'Mensaje recibido', en: 'Message received' },
  'gracias.body': {
    es: 'Te responderemos pronto. Mientras tanto, puedes ver nuestros casos.',
    en: 'We will get back to you soon. Meanwhile, take a look at our work.',
  },

  '404.title': { es: 'Página no encontrada', en: 'Page not found' },
  '404.body': {
    es: 'Esa ruta no existe. Prueba con una de estas secciones.',
    en: 'That path does not exist. Try one of these sections.',
  },

  'ref.banner': {
    es: 'Vienes de la web de {cliente}. Así es como la hicimos.',
    en: 'You came from {cliente}\'s website. This is how we built it.',
  },
  'ref.cta': { es: 'Pide presupuesto', en: 'Get a quote' },
  'ref.close': { es: 'Cerrar', en: 'Close' },

  'metric.before': { es: 'Antes', en: 'Before' },
  'metric.after': { es: 'Después', en: 'After' },
  'starting.title': { es: 'Punto de partida', en: 'Starting point' },
  'case.next': { es: 'Siguiente caso', en: 'Next case' },
  'case.cta': {
    es: '¿Quieres un antes/después así para tu negocio?',
    en: 'Want a before/after like this for your business?',
  },
  'case.report': { es: 'Informe completo (PDF)', en: 'Full report (PDF)' },
  'case.live': { es: 'Ver web en vivo', en: 'View live site' },
  'translated': { es: '(traducido)', en: '(translated)' },

  'sector.hosteleria': { es: 'Hostelería', en: 'Hospitality' },
  'sector.comercio': { es: 'Comercio', en: 'Retail' },
  'sector.belleza': { es: 'Belleza', en: 'Beauty' },
  'sector.salud-bienestar': { es: 'Salud y bienestar', en: 'Health & wellness' },
  'sector.deporte': { es: 'Deporte', en: 'Sports' },
  'sector.educacion': { es: 'Educación', en: 'Education' },
  'sector.servicios-profesionales': { es: 'Servicios profesionales', en: 'Professional services' },
  'sector.construccion-reformas': { es: 'Construcción y reformas', en: 'Construction' },
  'sector.inmobiliaria': { es: 'Inmobiliaria', en: 'Real estate' },
  'sector.cultura-ocio': { es: 'Cultura y ocio', en: 'Culture & leisure' },
  'sector.industria': { es: 'Industria', en: 'Industry' },
  'sector.tecnologia': { es: 'Tecnología', en: 'Technology' },
  'sector.asociacion': { es: 'Asociación', en: 'Nonprofit' },
  'sector.otro': { es: 'Otro', en: 'Other' },

  'servicio.web-nueva': { es: 'Web nueva', en: 'New website' },
  'servicio.rediseno': { es: 'Rediseño', en: 'Redesign' },
  'servicio.tienda-online': { es: 'Tienda online', en: 'Online store' },
  'servicio.seo-local': { es: 'SEO local', en: 'Local SEO' },
  'servicio.branding': { es: 'Branding', en: 'Branding' },
  'servicio.mantenimiento': { es: 'Mantenimiento', en: 'Maintenance' },
  'servicio.consultoria': { es: 'Consultoría', en: 'Consulting' },
  'servicio.app-a-medida': { es: 'App a medida', en: 'Custom app' },

  'estado.produccion': { es: 'En producción', en: 'In production' },
  'estado.desarrollo': { es: 'En desarrollo', en: 'In development' },
  'estado.pausado': { es: 'Pausado', en: 'Paused' },
  'estado.archivado': { es: 'Archivado', en: 'Archived' },

  'legal.placeholder': {
    es: 'Datos legales pendientes. TODO(edu): titular, NIF, domicilio.',
    en: 'Legal details pending. TODO(edu): legal entity, tax ID, address.',
  },
  'kit.title': { es: 'Kit de componentes', en: 'Component kit' },
  'kit.lead': {
    es: 'Solo en desarrollo. No se publica.',
    en: 'Development only. Not published.',
  },
};

export function uiT(key: keyof typeof ui | string, lang: Lang): string {
  const entry = ui[key];
  return entry?.[lang] ?? key;
}
