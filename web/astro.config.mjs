// @ts-check
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

/** Añade caso y lang a Comparativa/Captura/Metrica según la ruta del MDX. */
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
      const match = clean.match(/\/casos\/([^/]+)\/(es|en)\.mdx$/);
      if (!match) return;
      const slug = match[1];
      const lang = match[2];
      const next = code.replace(/<(Comparativa|Captura|Metrica)\b([^>]*?)(\/?>)/g, (full, tag, attrs, end) => {
        let extra = attrs;
        if (!/\bcaso\s*=/.test(attrs)) extra += ` caso="${slug}"`;
        if (!/\blang\s*=/.test(attrs)) extra += ` lang="${lang}"`;
        return `<${tag}${extra}${end}`;
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
