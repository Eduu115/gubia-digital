# Sesión — Gubia Digital (handoff vivo)

| Campo | Valor |
|-------|-------|
| Fecha | 2026-09-29 |
| Fase actual | **Identidad pública rellenada.** Foto, logo de Ana Mari, NIF y domicilio siguen pendientes. El homelab no se ha tocado. |
| Estado | **listo para retomar** |
| Marca | **kit gana al §9.2 del plan** (verde #1B4D3E, naranja #FF6A13, tinta #1C2B4A, crema #F6F1E7; Space Grotesk + Inter) |
| Design read | Landing B2B local pymes: tallado, contraste fuerte; tokens kit. Dials: VARIANCE 6 / MOTION 3 / DENSITY 4 |
| DESIGN.md | `/DESIGN.md` — Awesome Design MD **cal** + tokens kit |
| Skills | taste (kit, dials 6/3/4) + awesome-design-md (cal) + web-design-guidelines (repaso de componentes nuevos) + playwright-cli (esta sesión) |

## Ramas

Trabajo partido en PRs apiladas. Cada una sale de la anterior; se mergean en este orden:

| Rama | Qué entra |
|------|-----------|
| `chore/foundations` | Gitignore, docs, diseño, nginx y compose de la web |
| `feat/sitio-web` | Astro: páginas, i18n, componentes, contenido `_demo`, tests |
| `feat/caso-ana-mari` | Caso publicado Confecciones Ana Mari (sin el PDF) |
| `feat/contact-api` | API de contacto, proxy `/api` y servicio en compose |
| `feat/seo` | JSON-LD, robots.txt e imagen OG por caso |
| `feat/ci` | Workflow, comprobación de enlaces y e2e Playwright |

## Hecho

- ~13:00 — Handoff + lectura plan/contrato/skills. Repo vacío salvo docs.
- ~13:01 — `DESIGN.md` (estilo cal + kit). Scaffold Astro 7.3.5 + monorepo pnpm. Deps MDX, sitemap, Tailwind v4, Fontsource, sharp.
- ~13:02 — Assets kit: logos, favicons, OG. Imágenes demo compare desde capturas Ana Mari (mismas dims 3019×1599).
- ~13:03–13:08 — i18n ES/EN (`routes`, `ui`, utils), tokens `@theme`, BaseLayout/Header/Footer/LangSwitch, data (servicios/proceso/faq), content collections Zod, `_demo` casos/proyectos.
- ~13:08 — Compare (`<gubia-compare>`), MetricDelta, CaseCard, ProjectCard, ContactForm (mock hasta API), vistas y rutas §6.2, legales con placeholders, 404, SELLO stub, infra stubs.
- ~13:09 — `pnpm --filter web build` OK (19 páginas; `_demo` no sale en build prod).
- ~13:10 — Verificación playwright-cli 0.1.22 (ver sección).
- ~13:35 — MDX: `Comparativa`, `Captura`, `Metrica`, `Nota`. Vite inyecta `caso` y `lang` (Astro 7 ya no usa remark por defecto).
- ~13:36 — `CompareGroup`, `StartingPoint`, `Testimonial`, `FigureStat`, `Chip`. Caso demo usa Nota, Metrica y Captura dentro del MDX.
- ~13:37 — `content:check` real + vitest (métricas y proporción de imágenes). `prebuild` lo ejecuta.
- ~13:38 — `/_kit` y `/en/_kit` solo en `astro dev` (no salen en `dist`).
- ~13:40 — Compare: el recorte deja el «antes» a la izquierda. Teclado ±1 verificado.
- ~13:42 — Fechas de métrica con `Intl`; `tabular-nums`; `scroll-padding-top` por la cabecera fija.
- ~13:55 — Caso publicado `confecciones-ana-mari` (mercería y arreglos en Getafe, no panadería). Textos del informe del kit. Sin métricas ni testimonio inventados. `_demo` (panadería ficticia) sale del índice y de la home; sus capturas ya no son las de Ana Mari.
- ~14:10 — Informe PDF de Ana Mari **fuera de la web**. Sigue en el kit. La ficha ya no lo enlaza.
- ~14:13 — `contact-api` (Hono + SQLite): validación, honeypot, timing, Turnstile si hay secreto, rate limit, aviso ntfy/SMTP si hay config, reintento y purga. 9 tests. El formulario de `/contacto/` llega a `/gracias/` con la API en `:8787`.
- ~15:00 — SEO: `robots.txt`, JSON-LD (servicio, FAQ, migas, CreativeWork), OG 1200×630 del caso Ana Mari, `noindex` en gracias y 404. `width`/`height` en las tarjetas.
- ~15:13 — CI: `.github/workflows/ci.yml` corre content:check, vitest, build, enlaces internos y 4 e2e (idioma, teclado del comparador, `?ref=footer`, formulario sin JS). Lighthouse no entra todavía.
- ~18:05 — Identidad: Eduardo Serrano, `hola@gubiadigital.com`, teléfono y WhatsApp `+34 711 510 387`, LinkedIn y GitHub. Aviso legal, privacidad y cookies escritos sin NIF ni domicilio. Proyectos: API Arena, saveToWin y serdrive (en desarrollo, sin enlace al dominio). Foto y logo de Ana Mari, pendientes.
- ~18:45 — El dev de `:4321` seguía con el fixture `_demo` (API Arena con el logo). El índice ya no lo enseña. Cada proyecto tiene su propio artículo, no la ficha compartida.

## Decisiones

- Marca: kit gana al §9.2 del plan.
- Awesome Design MD: `cal` (ritmo/whitespace); colores/tipo del kit.
- Inter + Space Grotesk: kit (override taste).
- CTA: **tinta sobre naranja** (blanco del kit falla AA).
- Motion: CSS only + nudge Compare; sin GSAP/Motion libs.
- Ramas y PRs apiladas: ver la tabla de arriba. `main` no se toca hasta el merge.
- Caso Ana Mari: **publicado** por instrucción del titular (2026-09-29). Es mercería y confecciones en Getafe, web en vivo `https://confemerana.es/`. El HTML canónico cita `confeccionesanamari.es`, que hoy no resuelve.
- Fecha de entrega en ficha: `2026-09`, por el `Last-Modified` de la web (25 sep 2026). El informe trae `[00/00/2026]`.
- Sin métricas de laboratorio, sin testimonio y sin logo: el informe no los trae.
- Stack de la web nueva: no consta en el informe. No se afirma.
- La portada del caso muestra la comparativa `home`. Catálogo, arreglos, nosotros y contacto van en la narrativa.
- `_demo` no entra en índices ni en la home. Sigue en `/_kit` y, en dev, en `/casos/_demo/`.
- Formulario: en dev, Vite hace proxy de `/api` a `contact-api` en `:8787`. Sin JS la API responde 303 a `/gracias/`. Si la API no responde, el formulario enseña `hola@gubiadigital.com`.
- Bio pública: desarrollo para negocios, sin empleador ni cargo. La de LinkedIn se usó solo como materia prima.
- serdrive.com hoy no sirve la landing (el HTTPS no resuelve y el HTTP enseña el proxy por defecto). No se enlaza hasta que la sirva.
- Fechas de proyecto: mes de creación del repo público, no un lanzamiento comercial.
- Informe PDF de Ana Mari: **no publicar** de momento. Original en `kits/gubia-digital-kit/proyectos/confecciones-ana-mari/Informe-Rediseno-Confecciones-Ana-Mari.pdf`. Comentario en `caso.yaml`. Retomar más adelante (qué se enseña y a quién).
- Lighthouse CI queda fuera hasta medir la web. No se fija un presupuesto que aún no hemos comprobado.
- Imagen OG: se genera en `prebuild` con sharp (portada + barra tinta/naranja). Tipografía del rótulo: Helvetica, porque el SVG no embebe Space Grotesk. Salida en `web/public/og/` (gitignored).
- Comparador: `<Picture>` con AVIF y WebP (480, 960, 1440, 2160). El presupuesto de Lighthouse no se enciende: la home da 100 de rendimiento en una pasada, pero el LCP de laboratorio sigue en 1,7 s (objetivo 1,5 s).
- Turnstile, ntfy y SMTP quedan apagados hasta que existan secretos en `contact-api/.env` (plantilla en `.env.example`). Sin secreto de Turnstile la API no lo exige.
- Astro 7 (Sätteri): no hace falta `@astrojs/markdown-remark`. Los atributos `caso`/`lang` los pone un plugin de Vite (`astro.config.mjs`).
- `/_kit` se inyecta solo si `command === 'dev'`.
- La ficha del caso sigue mostrando métricas y comparador (plan §7.3). El MDX de `_demo` repite la métrica LCP para probar `<Metrica>`.

## Siguiente paso

1. **No rehacer** el caso Ana Mari ni publicar el PDF. Fecha `2026-09`, dominio `confemerana.es`, testimonio apagado.
2. Cuando Edu las pase: foto de perfil y logo de la tienda.
3. Cuando conste el alta: NIF y domicilio en el aviso legal y en privacidad. El canónico del sitio sigue en `gubiadigital.example` hasta que el dominio resuelva.
4. Precios «desde»: sin publicar. Plazo de respuesta: sin cifra, solo email o WhatsApp.
5. Cuando haya secretos: `TURNSTILE_SECRET`, ntfy y SMTP. Falta el widget de Turnstile (site key).
6. **No ejecutar** el despliegue del homelab hasta que Edu confirme el runbook.

## Cómo verificar

```bash
cd /Users/dudu/Desktop/personal/apps/gubiadigital
pnpm test
pnpm content:check
pnpm --filter web build
cd web && pnpm exec astro dev --host 127.0.0.1 --port 4321
# http://127.0.0.1:4321/casos/confecciones-ana-mari/  ·  /en/work/confecciones-ana-mari/  ·  /_kit (solo DEV)
```

Dev server de esta sesión: `:4321`.

## Verificación playwright (2026-09-29 ~13:42)

CLI: `/opt/homebrew/bin/playwright-cli` v0.1.22 · base `http://127.0.0.1:4321`

| Comprobación | Resultado |
|--------------|-----------|
| `/casos/_demo/`: Nota, Captura, Metrica en el MDX, Compare `is-enhanced` | OK |
| Slider teclado ArrowLeft 50 → 49; aria «Antes 49 % · Después 51 %»; clip `inset(0 0 0 50%)` | OK |
| `/en/work/_demo/` H1 EN + nota EN + «4.7× faster» | OK |
| `/_kit` y `/en/_kit` en dev, `noindex` | OK |
| Viewport 390: `<details>` + H1 | OK |
| `dist/` sin `_kit` | OK |
| `pnpm test` 11 tests · `content:check` OK · `astro build` 19 páginas | OK |
| Caso Ana Mari en home, `/casos/` y ficha ES/EN; 5 comparadores; PDF; sin «panadería» | OK |
| `?ref=footer` nombra a Confecciones Ana Mari | OK |

Los errores de consola del primer arranque eran el WebSocket de Vite (HMR), no de la página.
