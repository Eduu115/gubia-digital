import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const bilingual = z.object({ es: z.string(), en: z.string() });

const sector = z.enum([
  'hosteleria',
  'comercio',
  'belleza',
  'salud-bienestar',
  'deporte',
  'educacion',
  'servicios-profesionales',
  'construccion-reformas',
  'inmobiliaria',
  'cultura-ocio',
  'industria',
  'tecnologia',
  'asociacion',
  'otro',
]);

const servicio = z.enum([
  'web-nueva',
  'rediseno',
  'tienda-online',
  'seo-local',
  'branding',
  'mantenimiento',
  'consultoria',
  'app-a-medida',
]);

const metricaClave = z.enum([
  'lighthouse-rendimiento',
  'lighthouse-accesibilidad',
  'lighthouse-seo',
  'lighthouse-buenas-practicas',
  'lcp',
  'cls',
  'inp',
  'peso-pagina',
  'peticiones',
  'custom',
]);

const comparativa = z.object({
  id: z.string(),
  dispositivo: z.enum(['desktop', 'movil']),
  antes: z.string(),
  despues: z.string(),
  alt: z.object({ antes: bilingual, despues: bilingual }),
  pie: bilingual.optional(),
});

const captura = z.object({
  id: z.string(),
  dispositivo: z.enum(['desktop', 'movil']),
  src: z.string(),
  alt: bilingual,
  pie: bilingual.optional(),
});

const metrica = z.object({
  id: z.string().optional(),
  clave: metricaClave,
  antes: z.number(),
  despues: z.number(),
  fuente: z.string(),
  fechaAntes: z.string(),
  fechaDespues: z.string(),
  etiqueta: bilingual.optional(),
  unidad: z.string().optional(),
  mejor: z.enum(['menor', 'mayor']).optional(),
});

const casos = defineCollection({
  loader: glob({ pattern: '*/caso.yaml', base: './src/content/casos' }),
  schema: z.object({
    cliente: z.string(),
    anonimo: z.boolean().default(false),
    clienteAnonimo: bilingual.optional(),
    publicar: z.boolean(),
    destacado: z.boolean().default(false),
    orden: z.number().default(100),
    sector,
    ubicacion: z.string(),
    fecha: z.string(),
    duracionSemanas: z.number().optional(),
    servicios: z.array(servicio).min(1),
    stack: z.array(z.string()).optional(),
    urlEnVivo: z.string().url().optional(),
    logo: z.string().optional(),
    portada: z.string(),
    permisos: z.object({
      publicarCaso: z.boolean(),
      mostrarLogo: z.boolean().optional(),
      testimonio: z.boolean().optional(),
      fechaConsentimiento: z.string().optional(),
      medio: z.string().optional(),
    }),
    puntoDePartida: z.object({
      tipo: z.enum(['web', 'sin-web', 'otro']),
      descripcion: bilingual,
      imagen: z.string().optional(),
      altImagen: bilingual.optional(),
    }),
    comparativas: z.array(comparativa).optional(),
    capturas: z.array(captura).optional(),
    metricas: z.array(metrica).optional(),
    testimonio: z
      .object({
        autor: z.string(),
        cargo: bilingual,
        texto: bilingual,
        idiomaOriginal: z.enum(['es', 'en']),
      })
      .optional(),
    informes: z.object({ es: z.string().optional(), en: z.string().optional() }).optional(),
  }),
});

const casosTexto = defineCollection({
  loader: glob({ pattern: '*/*.{md,mdx}', base: './src/content/casos' }),
  schema: z.object({
    titulo: z.string().max(70),
    resumen: z.string().max(160),
    descripcionSeo: z.string().max(155),
  }),
});

const proyectos = defineCollection({
  loader: glob({ pattern: '*/proyecto.yaml', base: './src/content/proyectos' }),
  schema: z.object({
    nombre: z.string(),
    publicar: z.boolean(),
    destacado: z.boolean().default(false),
    orden: z.number().default(100),
    estado: z.enum(['produccion', 'desarrollo', 'pausado', 'archivado']),
    tipo: z.enum(['producto', 'herramienta', 'experimento', 'open-source']),
    tagline: bilingual,
    rol: bilingual,
    fechaInicio: z.string(),
    fechaFin: z.string().optional(),
    stack: z.array(z.string()).min(1),
    enlaces: z
      .object({
        web: z.string().url().optional(),
        repo: z.string().url().optional(),
        demo: z.string().url().optional(),
        articulo: z.string().url().optional(),
      })
      .optional(),
    portada: z.string(),
    capturas: z.array(captura).optional(),
    cifras: z
      .array(z.object({ valor: z.string(), etiqueta: bilingual }))
      .max(4)
      .optional(),
  }),
});

const proyectosTexto = defineCollection({
  loader: glob({ pattern: '*/*.{md,mdx}', base: './src/content/proyectos' }),
  schema: z.object({
    titulo: z.string().max(70),
    resumen: z.string().max(160),
    descripcionSeo: z.string().max(155),
  }),
});

export const collections = { casos, casosTexto, proyectos, proyectosTexto };
