// @ts-check
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

/** Añade caso/proyecto y lang a los componentes MDX según la ruta del archivo. */
function injectContentRefs() {
  return {
    name: 'gubia-content-refs',
    enforce: 'pre',
    /**
     * @param {string} code
     * @param {string} id
     */
    transform(code, id) {
      const clean = id.split('?')[0] ?? id;
      const caso = clean.match(/\/casos\/([^/]+)\/(es|en)\.mdx$/);
      if (caso) {
        const slug = caso[1];
        const lang = caso[2];
        const next = code.replace(/<(Comparativa|Captura|Metrica)\b([^>]*?)(\/?>)/g, (full, tag, attrs, end) => {
          let extra = attrs;
          if (!/\bcaso\s*=/.test(attrs)) extra += ` caso="${slug}"`;
          if (!/\blang\s*=/.test(attrs)) extra += ` lang="${lang}"`;
          return `<${tag}${extra}${end}`;
        });
        if (next === code) return;
        return next;
      }
      const proyecto = clean.match(/\/proyectos\/([^/]+)\/(es|en)\.mdx$/);
      if (!proyecto) return;
      const slug = proyecto[1];
      const next = code.replace(/<Figura\b([^>]*?)(\/?>)/g, (full, attrs, end) => {
        if (/\bproyecto\s*=/.test(attrs)) return full;
        return `<Figura${attrs} proyecto="${slug}"${end}`;
      });
      if (next === code) return;
      return next;
    },
  };
}

export default defineConfig({
  site: 'https://gubiadigital.example', // TODO(edu): dominio real
  output: 'static',
  integrations: [
    mdx(),
    sitemap({ i18n: { defaultLocale: 'es', locales: { es: 'es-ES', en: 'en-US' } } }),
    {
      name: 'dev-kit',
      hooks: {
        'astro:config:setup': ({ command, injectRoute }) => {
          if (command !== 'dev') return;
          injectRoute({
            pattern: '/_kit',
            entrypoint: './src/pages-dev/kit.astro',
            prerender: true,
          });
          injectRoute({
            pattern: '/en/_kit',
            entrypoint: './src/pages-dev/kit-en.astro',
            prerender: true,
          });
        },
      },
    },
  ],
  i18n: {
    locales: ['es', 'en'],
    defaultLocale: 'es',
    routing: { prefixDefaultLocale: false },
  },
  vite: {
    plugins: [injectContentRefs(), tailwindcss()],
    server: {
      proxy: {
        '/api': 'http://127.0.0.1:8787',
      },
    },
  },
  image: {
    service: { entrypoint: 'astro/assets/services/sharp' },
  },
});
