# Gubia Digital — Plan de implementación de la web

> Documento para el agente de código (Claude Code / Cursor). Léelo entero, junto con `CONTRATO-CONTENIDO.md`, antes de escribir una sola línea.
> Versión 1 · 29/09/2026 · Autor funcional: Edu

---

## 0. Instrucciones para el agente

1. **Trabaja por fases (§10).** Al terminar cada fase: resumen de lo hecho, cómo probarlo, checklist de la *Definition of Done* marcada, y **para**. Edu revisa antes de pasar a la siguiente.
2. **No inventes contenido real.** Nada de clientes, cifras, testimonios, precios ni datos legales inventados. Todo lo que falte va como `TODO(edu): …` (buscable con grep). Para desarrollar componentes usa el caso ficticio `_demo` (ver §5.4), que nunca se publica.
3. **Cero dependencias de terceros en runtime** salvo las dos permitidas: Cloudflare Turnstile (solo en formularios) y Cloudflare Web Analytics. Nada de Google Fonts remoto, CDNs de JS, jQuery, GSAP, ni frameworks UI. Si crees que hace falta React u otra isla, justifícalo antes.
4. **El esquema de contenido es un contrato.** Implementa exactamente lo definido en `CONTRATO-CONTENIDO.md`. Si necesitas cambiarlo, propónlo; hay otro agente que genera contenido con ese formato.
5. **Homelab: cuidado.** En el servidor corren otros servicios (Nextcloud con datos irreemplazables, APIArena, un asistente personal…). Prohibido: `docker compose down -v` en stacks ajenos, `docker system prune --volumes`, `docker volume prune`, tocar redes/volúmenes que no sean de este proyecto. Antes de cualquier cambio en infra del servidor, enseña el plan y espera confirmación.
6. Git: una rama por fase (`fase-0-cimientos`, …), Conventional Commits, PR al cerrar la fase.
7. Node 22 LTS o superior, **pnpm**, TypeScript `strict`.

---

## 1. Objetivo

Web de **Gubia Digital** (dúo freelance: desarrollo web y consultoría para pymes locales, posicionamiento low cost) que cumple tres funciones:

| # | Función | Cómo se nota en la web |
|---|---------|------------------------|
| 1 | **Captar clientes** | Landing con propuesta clara, prueba social, formulario de contacto que cualifica el lead. |
| 2 | **Demostrar el trabajo** | Casos de clientes terminados con **antes/después interactivo**, métricas medidas e informe descargable. Proyectos propios (p. ej. API Arena) que demuestran capacidad técnica. |
| 3 | **Ser el destino de los créditos** | Las webs de clientes llevan en el footer un enlace «Web: Gubia Digital» que aterriza **en el caso de ese cliente**. Los proyectos propios llevan un sello grande. |

La propia web es la mejor demo: tiene que cargar al instante, ser accesible y verse impecable en móvil.

### Métricas de éxito
- Lighthouse ≥ 95 en las 4 categorías (móvil) en todas las páginas.
- LCP < 1,5 s, CLS < 0,05, INP < 200 ms.
- JS en la landing < 15 KB gzip (sin contar Turnstile, que se carga tarde).
- Peso de la landing < 500 KB en la primera carga.
- WCAG 2.2 AA.

---

## 2. Decisiones ya tomadas

| Tema | Decisión | Motivo |
|------|----------|--------|
| Framework | **Astro 7.x** (estable actual: 7.3.x) + MDX | Web estática, contenido en ficheros, JS casi cero. |
| Estilos | **Tailwind CSS v4** (`@tailwindcss/vite`), tokens en `@theme` | Rapidez + tokens de marca en CSS. |
| Idiomas | **ES + EN desde el día 1**. ES sin prefijo (`/`), EN en `/en/` | El cliente objetivo es local (ES); EN para proyectos propios y visibilidad. |
| Hosting | **Homelab** (Docker) + **Cloudflare Tunnel** | Decisión de Edu. Mitigaciones de disponibilidad en §9.6. |
| Contenido | Ficheros en el repo con esquema validado (Content Layer, `glob()` loader) | Otro agente genera los casos a partir de informes. |
| Formulario | Microservicio propio `contact-api` (Hono) | La web sigue siendo 100 % estática y portable. |
| Analítica | Cloudflare Web Analytics (sin cookies) | Sin banner de cookies y sin coste de RAM. |
| Fuentes | Self-hosted vía Fontsource | RGPD: no se llama a Google Fonts. |

---

## 3. Arquitectura

```
                    ┌──────────────── Cloudflare ────────────────┐
 Visitante ──HTTPS──▶  DNS · CDN/caché · WAF · Web Analytics      │
                    │  Turnstile · Access (solo preview)          │
                    └───────────────┬────────────────────────────┘
                                    │ Cloudflare Tunnel (cloudflared, ya existente)
                     ┌──────────────┴──────────────┐
          path ^/api/│                             │ resto
                     ▼                             ▼
          ┌────────────────────┐        ┌──────────────────────┐
          │ gubia-contact      │        │ gubia-web            │
          │ Node 22 + Hono     │        │ nginx:alpine          │
          │ SQLite (volumen)   │        │ sirve /dist estático  │
          │ → ntfy (móvil)     │        │ mem_limit 64m         │
          │ → email (SMTP)     │        └──────────────────────┘
          │ mem_limit 128m     │
          └────────────────────┘
```

- **gubia-web**: build de Astro (`output: 'static'`) servido por nginx. Sin Node en runtime.
- **gubia-contact**: único componente dinámico. Recibe el formulario, valida, guarda y avisa.
- Mismo hostname para web y API (enrutado por path en el ingress del tunnel) → sin CORS.
- `preview.DOMINIO`: mismo stack, protegido con **Cloudflare Access** (OTP por email para Edu y su socio). Sirve para revisar antes de publicar y mientras falten los datos legales (§11).

---

## 4. Estructura del repositorio

```
gubia-web/
├─ web/                          # Astro
│  ├─ astro.config.mjs
│  ├─ src/
│  │  ├─ content.config.ts       # colecciones + esquemas Zod (según CONTRATO)
│  │  ├─ content/
│  │  │  ├─ casos/<slug>/        # caso.yaml + es.mdx + en.mdx + img/ + informes
│  │  │  └─ proyectos/<slug>/    # proyecto.yaml + es.mdx + en.mdx + img/
│  │  ├─ data/                   # site.ts, servicios.ts, faq.ts, proceso.ts (bilingües)
│  │  ├─ i18n/
│  │  │  ├─ ui.ts                # diccionario de textos de interfaz ES/EN
│  │  │  ├─ routes.ts            # mapa de rutas localizadas (§6.2)
│  │  │  └─ utils.ts             # t(), localizedPath(), formatNumber()…
│  │  ├─ components/
│  │  │  ├─ ui/                  # Button, Chip, Badge, Section, Container, LangSwitch…
│  │  │  ├─ case/                # Compare, CompareGroup, MetricDelta, StartingPoint, CaseCard, Testimonial…
│  │  │  ├─ project/             # ProjectCard, ProjectHero, FigureStat…
│  │  │  ├─ sections/            # Hero, FeaturedCases, Services, Process, OwnProjects, FAQ, ContactCTA…
│  │  │  └─ mdx/                 # componentes disponibles dentro del MDX (§5.3)
│  │  ├─ views/                  # vistas compartidas ES/EN: HomeView, CaseView, …
│  │  ├─ layouts/BaseLayout.astro
│  │  ├─ pages/                  # wrappers finos por idioma (§6.1)
│  │  ├─ scripts/                # custom elements y enhancements (compare, referral, form)
│  │  └─ styles/global.css       # Tailwind + @theme
│  ├─ public/                    # favicon, robots.txt, brand/ (SVG del sello, solo referencia)
│  ├─ scripts/content-check.ts   # validaciones cruzadas de contenido (§5.5)
│  ├─ tests/                     # vitest (unit) + playwright (e2e)
│  └─ Dockerfile                 # multi-stage: node:22-alpine → nginx:alpine
├─ contact-api/
│  ├─ src/                       # index.ts, routes/contact.ts, lib/{turnstile,ntfy,mail,db,ratelimit}.ts
│  ├─ tests/
│  └─ Dockerfile
├─ infra/
│  ├─ compose.yaml
│  ├─ nginx.conf
│  ├─ cloudflared-ingress.example.yml
│  ├─ deploy.sh                  # despliegue manual en el homelab (fase 5)
│  └─ .env.example
├─ docs/
│  ├─ PLAN-IMPLEMENTACION.md     # este documento
│  ├─ CONTRATO-CONTENIDO.md
│  ├─ SELLO.md                   # kit de crédito para footers (§8)
│  └─ RUNBOOK.md                 # despliegue, fallback, backups
├─ .github/workflows/ci.yml
├─ pnpm-workspace.yaml
└─ README.md
```

Las páginas de `pages/` son **wrappers finos**: `pages/casos/[slug].astro` y `pages/en/work/[slug].astro` solo resuelven el idioma y renderizan `views/CaseView.astro`. Ninguna lógica duplicada entre idiomas.

---

## 5. Contenido

### 5.1 Colecciones

Definidas en `src/content.config.ts` con `glob()` loader y Zod de `astro/zod` (Zod 4). El detalle campo a campo está en **`CONTRATO-CONTENIDO.md`**; aquí solo el diseño:

| Colección | Patrón | Qué contiene |
|-----------|--------|--------------|
| `casos` | `casos/*/caso.yaml` | Datos del caso: cliente, fechas, stack, imágenes antes/después, métricas, testimonio, permisos. Los textos cortos van bilingües (`{es, en}`). |
| `casosTexto` | `casos/*/{es,en}.mdx` | Narrativa larga por idioma + título, resumen y descripción SEO. |
| `proyectos` | `proyectos/*/proyecto.yaml` | Datos del proyecto propio. |
| `proyectosTexto` | `proyectos/*/{es,en}.mdx` | Narrativa por idioma. |

- El **slug** es el nombre de la carpeta y es igual en ambos idiomas.
- Los datos que no se traducen (números, fechas, imágenes) viven **una sola vez** en el YAML → no hay deriva entre idiomas.
- Imágenes colocadas junto al YAML y resueltas con el helper `image()` del esquema. Si en la versión instalada `image()` no resolviera rutas relativas desde YAML, alternativa: `import.meta.glob('/src/content/**/img/*.{png,jpg,webp}', { eager: true })` y resolver por ruta. Documenta la opción elegida.
- PDFs de informes: resolverlos con `import.meta.glob('/src/content/casos/**/*.pdf', { query: '?url', import: 'default', eager: true })` para obtener URL con hash.

### 5.2 Reglas de publicación
- Solo se renderiza lo que tenga `publicar: true` **y** `permisos.publicarCaso: true` (casos).
- En `/en/` solo aparecen casos/proyectos con `en.mdx`. Si falta, el build avisa (warning) pero no falla; si `publicar: true` y falta `es.mdx`, el build **falla**.
- `destacado` + `orden` controlan qué sale en la landing.
- Caso con `anonimo: true`: se muestra `clienteAnonimo` en vez del nombre, sin logo, sin enlace en vivo y sin banner `?ref=`.

### 5.3 Componentes disponibles dentro del MDX
Se inyectan vía `<Content components={…} />`, así el MDX no necesita imports:

| Componente | Uso |
|------------|-----|
| `<Comparativa id="home" />` | Inserta en la narrativa el antes/después con ese `id` del YAML (con pestañas si hay escritorio y móvil). |
| `<Captura id="reservas" />` | Inserta una captura de `capturas[]`. |
| `<Metrica id="lcp" />` | Inserta una tarjeta de métrica del YAML (`id` o, si no hay, `clave`). |
| `<Nota>…</Nota>` | Caja destacada (aclaraciones, contexto). |

Si el MDX referencia un `id` inexistente, el build falla con el nombre del caso y el `id`.

### 5.4 Caso de demostración
Crea `src/content/casos/_demo/` con datos claramente ficticios («Panadería Demo»), `publicar: false`. Se muestra **solo en `astro dev`** (`import.meta.env.DEV`) para poder maquetar. Igual con `proyectos/_demo/`. Las imágenes de demo pueden ser capturas generadas de dos versiones de una página de prueba o placeholders con las proporciones correctas.

### 5.5 Validación de contenido (`pnpm content:check`)
Además de Zod, un script que falla con mensajes claros si:
- una comparativa tiene `antes` y `despues` con **distinta relación de aspecto** (tolerancia 1 %);
- falta un `alt` en cualquier idioma;
- una métrica no tiene `fuente` o fechas;
- hay `testimonio` sin `permisos.testimonio: true`;
- hay `logo` sin `permisos.mostrarLogo: true`;
- un caso publicado no tiene `es.mdx`;
- `puntoDePartida.tipo: web` sin ninguna comparativa, o `sin-web`/`otro` sin ninguna captura;
- `anonimo: true` sin `clienteAnonimo`, o `permisos.publicarCaso: true` sin `fechaConsentimiento`;
- `id` repetido en `comparativas` (salvo un par `desktop` + `movil`), `capturas` o `metricas`;
- una métrica `custom` sin `etiqueta`, `unidad` o `mejor`;
- el MDX usa `<Comparativa>`, `<Captura>` o `<Metrica>` con un `id` que no existe;
- una imagen fuente supera 3 MB.

Avisa (sin fallar) de: falta `en.mdx`, `resumen` > 160 caracteres, `descripcionSeo` > 155.
Se ejecuta en CI y como `prebuild`.

---

## 6. Rutas e i18n

### 6.1 Configuración
```
i18n: { locales: ['es', 'en'], defaultLocale: 'es', routing: { prefixDefaultLocale: false } }
```
Sin redirección automática por `Accept-Language` (malo para SEO y para compartir enlaces). Solo el selector de idioma.

### 6.2 Mapa de rutas (`i18n/routes.ts`)

| Clave | ES | EN |
|-------|----|----|
| home | `/` | `/en/` |
| casos | `/casos/` | `/en/work/` |
| caso | `/casos/[slug]/` | `/en/work/[slug]/` |
| proyectos | `/proyectos/` | `/en/projects/` |
| proyecto | `/proyectos/[slug]/` | `/en/projects/[slug]/` |
| nosotros | `/nosotros/` | `/en/about/` |
| contacto | `/contacto/` | `/en/contact/` |
| gracias | `/gracias/` | `/en/thanks/` |
| avisoLegal | `/aviso-legal/` | `/en/legal-notice/` |
| privacidad | `/privacidad/` | `/en/privacy/` |
| cookies | `/cookies/` | `/en/cookies/` |

- `localizedPath(clave, lang, params?)` es la **única** forma de construir enlaces internos.
- El selector de idioma mapea la página actual a su equivalente (misma clave + mismo slug). Si el equivalente no existe (caso sin `en.mdx`), lleva al índice de esa sección en el otro idioma.
- Cada página emite `<link rel="alternate" hreflang="es|en|x-default">` y `canonical`.
- Números y fechas con `Intl` según idioma (`0,9 s` / `0.9 s`; `oct 2026` / `Oct 2026`).

---

## 7. Páginas

### 7.1 Landing (`/`, `/en/`)
Orden de secciones:

1. **Header**: logo, navegación (Casos · Proyectos · Nosotros · Contacto), selector ES/EN, CTA «Pide presupuesto». En móvil, menú con `<details>` o `<dialog>` (sin librerías), accesible.
2. **Hero**: titular + subtítulo + CTA principal (→ formulario) y secundario (→ casos). A la derecha (debajo en móvil), **el antes/después del caso destacado nº 1**, interactivo desde el primer segundo. Es el «wow» de la web. Si aún no hay ningún caso publicado, se sustituye por una composición estática de marca.
   - Propuestas de titular (Edu decide): «Tu negocio, bien tallado en internet» · «Webs que trabajan para tu negocio. Precio cerrado, sin sorpresas». → `TODO(edu)`.
3. **Garantías** (franja corta, 3–4 ítems): p. ej. precio cerrado · web tuya (código y dominio a tu nombre) · carga en menos de 1 s · sin permanencia. Cada garantía es una promesa comercial → `TODO(edu)` para confirmar. **Nada de cifras de vanidad** («+50 clientes») mientras no sean reales.
4. **Casos destacados**: rejilla de tarjetas (captura «después» + cliente + sector + mejor métrica en formato `4,2 s → 0,9 s`). Diseñada para verse bien con **1, 2 o 3 casos**; la última celda es siempre una tarjeta CTA «¿Tu negocio es el siguiente?».
5. **Servicios / packs**: 3 tarjetas desde `data/servicios.ts`. Precio «desde» opcional por pack (`TODO(edu)`: decidir si se muestran precios; en posicionamiento low cost suele convertir mejor mostrarlos).
6. **Cómo trabajamos**: 4 pasos (charla → propuesta con precio cerrado → diseño y desarrollo con revisiones → entrega y mantenimiento).
7. **Proyectos propios**: «Lo que construimos por nuestra cuenta». API Arena en grande (demuestra que no se hacen solo plantillas) + resto en tarjetas.
8. **Testimonios**: se oculta entera si no hay ninguno con permiso.
9. **FAQ**: `<details>/<summary>` nativo. Preguntas base: cuánto cuesta, cuánto se tarda, qué necesito aportar, quién mantiene la web, es mía la web, hacéis tiendas online. `TODO(edu)` para las respuestas.
10. **CTA final + formulario** (el mismo componente que `/contacto`) + alternativas: email y WhatsApp.
11. **Footer**: navegación, legales, idioma, email, redes.

### 7.2 Índice de casos (`/casos/`)
Rejilla de `CaseCard`. Filtros por sector y servicio **solo cuando haya ≥ 6 casos** (antes sobran). Filtros sin JS obligatorio: enlaces con query o chips que filtran con un script mínimo; sin JS se ve todo.

### 7.3 Caso (`/casos/[slug]/`)
1. Migas + **H1** (título del MDX) + cliente + resultado en una línea.
2. **Ficha**: sector, ubicación, fecha, duración, servicios, stack, enlace a la web en vivo.
3. **Métricas** antes → después (`MetricDelta`): valor antes, valor después, mejora (% o ×), flecha y color según `mejor: menor|mayor`. Nota al pie con fuente y fechas.
4. **Antes/después** (`CompareGroup`): pestañas Escritorio / Móvil si existen ambas; si hay varias comparativas (home, carta, contacto…), se listan en orden.
   - Si `puntoDePartida.tipo` es `sin-web` u `otro`: en lugar del slider, tarjeta **«Punto de partida»** (p. ej. «Solo tenían perfil de Google Maps e Instagram») con captura opcional, y luego el «después».
5. **Narrativa** (MDX): Punto de partida · Qué hicimos · Resultado · (Detalles técnicos).
6. **Testimonio** (si hay permiso). En EN, si el original es ES, se marca «(traducido)».
7. **Informe completo** descargable (PDF del idioma, si existe).
8. **CTA**: «¿Quieres un antes/después así para tu negocio?» → formulario. Enlace al siguiente caso.

**Banner de referencia**: si la URL trae `?ref=footer`, un script mínimo muestra un aviso fijo abajo (toast, sin mover el layout → CLS 0): «Vienes de la web de {cliente}. Así es como la hicimos.» con botón cerrar y CTA. Se recuerda cerrado en `sessionStorage` (envuelto en try/catch).

### 7.4 Proyectos (`/proyectos/`, `/proyectos/[slug]/`)
Índice con `ProjectCard` (portada, nombre, tagline, estado, stack). Detalle: hero con nombre + tagline + estado (En producción / En desarrollo / Pausado), rol, cifras clave (`FigureStat`: «9 microservicios»…), enlaces (web, repo, demo), capturas, narrativa MDX.

### 7.5 Nosotros (`/nosotros/`)
Quiénes somos, cómo trabajamos, por qué low cost no significa chapuza. **Sin apellidos, empleador actual ni fotos hasta que Edu lo confirme** (`TODO(edu)`, ver §11).

### 7.6 Contacto (`/contacto/`) y Gracias (`/gracias/`)
Formulario completo (§9.4) + email + WhatsApp. `/gracias/` confirma recepción, dice en cuánto se responde (`TODO(edu)`) y enlaza a casos.

### 7.7 Legales
Aviso legal (LSSI-CE art. 10), privacidad (RGPD) y cookies. Textos con marcadores `{{TITULAR}}`, `{{NIF}}`, `{{DOMICILIO}}`, `{{EMAIL}}` → `TODO(edu)`. **El agente no redacta datos legales reales.** Con solo Cloudflare Web Analytics (sin cookies) y Turnstile (necesaria por seguridad), la página de cookies lo declara y **no hay banner**. Si en el futuro se añade analítica con cookies, hay que añadir gestión de consentimiento.

### 7.8 404
Página de marca con buscador de secciones (enlaces), en ambos idiomas (nginx sirve la 404 según prefijo `/en/`).

---

## 8. Kit de crédito para footers (`docs/SELLO.md`)

Objetivo: que cada web de cliente sea un escaparate y que quien pinche aterrice en **su caso**, no en la home.

### 8.1 Variantes
| Variante | Dónde | Aspecto | Enlace |
|----------|-------|---------|--------|
| **A · Crédito discreto** | Footer de webs de clientes | Texto pequeño «Web: Gubia Digital» + marca mínima. Usa `currentColor` para heredar el color del footer del cliente. | `https://DOMINIO/casos/<slug>/?ref=footer` (EN: `/en/work/<slug>/?ref=footer`) |
| **B · Sello grande** | Proyectos propios de Edu | Bloque destacado: «Diseñado y desarrollado por Gubia Digital · ¿Quieres algo así? →» | `https://DOMINIO/?ref=proyecto-<slug>` |

### 8.2 Reglas
- **SVG inline** en el snippet, nunca `<img src="https://DOMINIO/…">`: si el homelab cae, el footer del cliente no puede quedarse con una imagen rota.
- Texto del enlace = la marca. **Nunca palabras clave** tipo «diseño web Madrid» (Google lo trata como esquema de enlaces). Usar `rel="nofollow"`: el valor es tráfico y credibilidad, no SEO, y así la cuenta nueva no se arriesga.
- Mismo tab (sin `target="_blank"`).
- `SELLO.md` incluye snippets listos para pegar en **HTML, JSX y Astro**, en claro y oscuro, y cómo elegir el slug.
- Añadir a los presupuestos una cláusula: derecho a mostrar el proyecto en el portfolio y a incluir el crédito en el footer, retirable a petición del cliente. (Nota para Edu, no para el código.)

---

## 9. Especificaciones técnicas

### 9.1 Dirección de diseño
- **Concepto: «tallado»**. Una gubia es una herramienta de talla: precisión, oficio, trabajo hecho a mano. La web se siente **directa, sólida y con contraste fuerte**, nada recargada.
- **Motivo gráfico**: el corte en «U» de la gubia. Usos: subrayado de palabras clave del titular (trazo naranja), separadores de sección, viñetas. Discreto, no decorativo por decorar.
- **Logo**: pendiente (`TODO(edu)`). Mientras tanto, logotipo tipográfico con la fuente de titulares.
- Secciones alternas **papel** / **tinta** (oscuras) para ritmo. Sin modo oscuro conmutable en v1.
- Capturas de escritorio dentro de un marco de navegador en CSS; las de móvil, en marco de teléfono en CSS.
- Movimiento mínimo: transiciones cortas, respeta `prefers-reduced-motion`, sin scroll-jacking ni librerías de animación.

### 9.2 Tokens de marca
Verde, naranja y azul con roles fijos (no los tres a la vez compitiendo). **Semántica útil**: el **verde es «después»/mejora**, el **naranja es acción**, el **azul es marca/enlaces**.

| Token | Hex | Rol |
|-------|-----|-----|
| `--color-tinta` | `#0E1A2B` | Texto principal, fondos oscuros |
| `--color-papel` | `#F7F4EE` | Fondo principal (blanco cálido) |
| `--color-azul` | `#1D4ED8` | Marca, enlaces, foco |
| `--color-azul-claro` | `#7EA6FF` | Enlaces sobre fondo tinta |
| `--color-verde` | `#0E7A4E` | «Después», mejoras, éxito |
| `--color-verde-claro` | `#3FD08A` | «Después» sobre fondo tinta |
| `--color-naranja` | `#F26A1B` | CTA (relleno), subrayado gubia |
| `--color-naranja-oscuro` | `#B8470A` | Naranja cuando es texto sobre papel |
| `--color-gris` | `#5B6472` | Texto secundario, «antes» |

Contrastes verificados (WCAG 2.x):

| Combinación | Ratio | Uso permitido |
|-------------|-------|---------------|
| tinta / papel | 15,9 | Todo |
| azul / papel | 6,1 | Texto y enlaces |
| verde / papel | 4,9 | Texto normal (AA) |
| gris / papel | 5,5 | Texto secundario |
| naranja-oscuro / papel | 4,9 | Texto naranja |
| **tinta / naranja** | 5,7 | **Texto de botones CTA** |
| papel / tinta | 15,9 | Secciones oscuras |
| verde-claro / tinta | 8,8 | «Después» en oscuro |
| azul-claro / tinta | 7,3 | Enlaces en oscuro |

**Prohibido**: texto blanco sobre naranja (3,1: no pasa AA para texto normal) y naranja `#F26A1B` como color de texto sobre papel (2,8).

Tipografía (propuesta, `TODO(edu)` para confirmar): **Bricolage Grotesque** (titulares, variable; tiene carácter «artesano») + **Instrument Sans** (texto). Ambas vía Fontsource, subset latin, `font-display: swap`, precarga solo del peso del titular del hero.

Escala: base 18 px en escritorio / 16 px en móvil, titulares con `clamp()`. Contenedor máx. 1200 px, rejilla de 12 columnas, radios pequeños (4–8 px): el estilo es preciso, no «burbuja».

### 9.3 Componente antes/después (`Compare`)
Es la pieza estrella; cuídala.

- **Custom element vanilla** (`<gubia-compare>`), ~2 KB, sin framework.
- **Mejora progresiva**: el HTML del servidor muestra ambas imágenes con etiqueta (lado a lado en escritorio, apiladas en móvil). Con JS se convierte en superposición con `clip-path` y deslizador.
- Control = `<input type="range">` nativo (0–100) superpuesto e invisible, con tirador visual propio → teclado, táctil y lectores de pantalla gratis.
  - `aria-label`: «Comparar antes y después» / «Compare before and after».
  - `aria-valuetext`: «Antes 30 % · Después 70 %».
  - Flechas ±1, PageUp/PageDown ±10, Home/End.
- Etiquetas «Antes» (gris) y «Después» (verde), localizadas.
- Posición inicial 50 %. Pista animada una sola vez al entrar en viewport (se desplaza a 35 % y vuelve), desactivada con `prefers-reduced-motion`.
- Imágenes con `<Picture>` de Astro: AVIF + WebP, anchos [480, 960, 1440, 2160], `sizes` correcto, `width/height` explícitos (CLS 0). En el hero, `loading="eager"` y `fetchpriority="high"` en la imagen «después»; en el resto, `lazy`.
- `CompareGroup`: pestañas Escritorio/Móvil con patrón ARIA *tabs* cuando existan ambas.
- Tests e2e: arrastre, teclado, sin JS.

### 9.4 Formulario de contacto
**Campos**: nombre\*, email\*, teléfono/WhatsApp (opcional), negocio (nombre y tipo)\*, qué necesitas\* (checkboxes: web nueva, rediseño, tienda online, aparecer en Google/SEO local, mantenimiento, otra), web actual (URL opcional), presupuesto orientativo (rangos `TODO(edu)`, incluir «No lo sé»), plazo (sin prisa / en 1 mes / urgente), mensaje, **consentimiento RGPD\*** (checkbox sin marcar, enlace a privacidad).
**Ocultos**: `lang`, `origen` (pathname), `ref`, `utm_*`, `ts` (timestamp de render), honeypot, token Turnstile.

- **Funciona sin JS**: `<form method="post" action="/api/contact">`; la API responde 303 → `/gracias/` (o `/en/thanks/`).
- Con JS: `fetch` JSON, validación inline accesible (`aria-invalid`, `aria-describedby`, foco al primer error), estados enviando/éxito/error.
- **Turnstile** se carga cuando el formulario entra en viewport o recibe foco (no penaliza el LCP).
- Si la API no responde (homelab caído, fallback de Pages): mensaje con email y WhatsApp para contactar directamente.

### 9.5 `contact-api`
- **Stack**: Node 22, Hono (`@hono/node-server`), `zod`, `better-sqlite3`, `nodemailer`. Imagen `node:22-bookworm-slim` (compilación nativa de better-sqlite3 sin líos de alpine).
- **Endpoints**: `POST /api/contact` (JSON o form-urlencoded), `GET /api/health`.
- **Flujo**:
  1. Parseo + Zod (errores por campo, mensajes según `lang`).
  2. Honeypot relleno → responde 200 fingiendo éxito y descarta.
  3. `ts` < 3 s desde el render → bot → igual que el honeypot.
  4. Verificación **Turnstile** server-side (`siteverify` con `remoteip` = `CF-Connecting-IP`).
  5. **Rate limit** en memoria: 5 envíos/hora por IP → 429.
  6. **Guardar primero** en SQLite (`leads`: id, fecha, campos, origen, ref, utm, lang, ip_hash, notificado).
  7. Avisar: **ntfy** (instancia autohospedada de Edu; título «Nuevo lead: {negocio}», resumen, prioridad alta) y **email** a `LEADS_TO` con `Reply-To` = email del lead.
  8. Si el aviso falla, el lead ya está guardado: `notificado=0`, log de error y reintento al arrancar o en el siguiente envío.
- **Privacidad**: IP guardada solo como hash con sal; script `purge` que borra leads de más de 12 meses (cron semanal).
- **Config** (`.env`, nunca en git): `TURNSTILE_SECRET`, `NTFY_URL`, `NTFY_TOPIC`, `NTFY_TOKEN`, `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`, `LEADS_TO`, `DB_PATH`, `IP_HASH_SALT`, `PUBLIC_SITE_URL`.
- **Tests** (vitest): validación, honeypot, timing, Turnstile/ntfy/SMTP mockeados, rate limit, redirect 303.

### 9.6 Infraestructura en el homelab
- **Compose** (`infra/compose.yaml`), proyecto `gubia`:
  - `gubia-web`: `mem_limit: 64m`, `read_only: true` + `tmpfs` para `/var/cache/nginx` y `/var/run`, `restart: unless-stopped`, healthcheck.
  - `gubia-contact`: `mem_limit: 128m`, volumen nombrado `gubia-leads` → `/data`, `env_file`, healthcheck a `/api/health`.
  - **No** poner variables `VIRTUAL_HOST` (hay un `nginx-proxy` en el servidor que las recoge).
- **Tunnel**: ya existe `cloudflared`. El agente debe **comprobar cómo corre** (contenedor o servicio del sistema) y adaptar:
  - Si es contenedor: red Docker compartida y servicios por nombre.
  - Si es del sistema: publicar en `127.0.0.1:<puerto libre>` (comprobar antes con `ss -tlnp`; el 443 y el 8443 están ocupados).
  - Ingress: primero `path: ^/api/` → contact; después el hostname → web. Ejemplo en `infra/cloudflared-ingress.example.yml`.
- **nginx.conf**:
  - `/_astro/*` y fuentes: `Cache-Control: public, max-age=31536000, immutable`.
  - HTML: `Cache-Control: public, max-age=0, must-revalidate`.
  - Cabeceras: `Strict-Transport-Security`, `X-Content-Type-Options`, `Referrer-Policy: strict-origin-when-cross-origin`, `Permissions-Policy` mínima, **CSP**: `default-src 'self'`; scripts `'self'` + `challenges.cloudflare.com` + `static.cloudflareinsights.com`; `frame-src challenges.cloudflare.com`; `connect-src 'self' cloudflareinsights.com`; `img-src 'self' data:`. Revisa si la versión de Astro instalada ofrece CSP nativa con hashes (`security.csp`) y úsala para los scripts inline; si no, evita scripts inline.
  - 404 por idioma, `gzip on` (Cloudflare ya comprime con brotli hacia el cliente).
- **Cloudflare**: `www` → apex con Redirect Rule; caché de assets en el edge; SSL Full (strict).
- **Disco**: la raíz del servidor va justa. El despliegue hace `docker image prune -f` (solo imágenes colgantes, **nunca** volúmenes) y `docker builder prune -f --filter until=72h`.
- **Backups**: copia diaria de la SQLite (`sqlite3 .backup`) al disco de datos del servidor.

### 9.7 Disponibilidad (la web es el enlace de todos los footers)
El homelab es un punto único de fallo; se asume de forma consciente y se mitiga:
1. **Monitor externo** (UptimeRobot o Better Stack, plan gratuito) sobre `/` y `/api/health` con aviso al móvil. Un monitor dentro del homelab no sirve: cae con él.
2. **Fallback preparado**: proyecto de **Cloudflare Pages** creado desde el día 1 con el mismo `dist/`. Si el servidor cae más de un rato, se cambia el dominio a Pages en minutos (procedimiento en `RUNBOOK.md`). El formulario, en ese modo, muestra email y WhatsApp (§9.4).
3. El sello de los clientes es SVG inline (§8.2): aunque la web caiga, sus footers siguen perfectos.

### 9.8 SEO
- `@astrojs/sitemap` con i18n, `robots.txt`, canonical, hreflang.
- Meta y Open Graph por página; **imagen OG generada en build** por caso y proyecto (captura «después» + título + marca; p. ej. con `satori` + `sharp`, o `astro-og-canvas`).
- JSON-LD: `ProfessionalService` (nombre, url, `areaServed`: Madrid/España, sin dirección física publicada), `CreativeWork` en casos y proyectos, `BreadcrumbList`, `FAQPage` en la FAQ.
- Títulos: `{página} · Gubia Digital`.
- (Nota para Edu) Perfil de empresa en Google como negocio de área de servicio, con la dirección oculta.

### 9.9 Calidad y CI (`.github/workflows/ci.yml`)
En cada PR: `pnpm install --frozen-lockfile` → lint (ESLint + `eslint-plugin-astro`, Prettier) → `astro check` → `content:check` → vitest (web y api) → build → Playwright e2e sobre el build (home ES/EN, selector de idioma, antes/después con teclado, formulario con API mockeada y sin JS, banner `?ref=`) → **axe** en todas las rutas → **Lighthouse CI** con presupuestos (§1) → comprobación de enlaces rotos.

Despliegue continuo (fase 5, opcional): en `main`, la GitHub Action se une a la tailnet (`tailscale/github-action`) y ejecuta `infra/deploy.sh` por SSH en el homelab. No se abre ningún puerto a internet.

---

## 10. Fases

Orden de ejecución; cada fase termina con PR y revisión de Edu.

### Fase 0 · Cimientos
- Monorepo pnpm (`web/`, `contact-api/`, `infra/`, `docs/`), Astro 7 + TS strict + MDX + Tailwind v4 + sitemap, i18n configurado, `routes.ts` + `ui.ts` + utilidades.
- Tokens de §9.2 en `@theme`, fuentes self-hosted, `BaseLayout` (meta, hreflang, skip link), Header, Footer, LangSwitch, 404.
- Dockerfile web (multi-stage) + `nginx.conf` + `compose.yaml` en local.
- ESLint/Prettier, vitest y Playwright instalados; CI con lint + check + build.

**DoD**: `/` y `/en/` renderizan con layout y tokens; el selector de idioma funciona; `docker compose up` sirve la web en local; imagen web < 50 MB; CI verde; Lighthouse ≥ 95 en la página vacía.

### Fase 1 · Contenido y componentes base
- `content.config.ts` exactamente según `CONTRATO-CONTENIDO.md`; `content:check`; casos y proyectos `_demo`.
- Componentes: `Compare`, `CompareGroup`, `MetricDelta`, `StartingPoint`, `CaseCard`, `ProjectCard`, `FigureStat`, `Testimonial`, `Chip`, `Button`, `Section`, y los de MDX (`Comparativa`, `Metrica`, `Nota`).
- Página interna solo en dev (`/_kit`) que muestra todos los componentes con los datos de demo.

**DoD**: `_kit` enseña todos los componentes en ES/EN; `Compare` funciona con ratón, táctil, teclado y sin JS; `content:check` detecta a propósito un par de imágenes con distinta proporción (test); tests unitarios de formateo de métricas y cálculo de mejora.

### Fase 2 · Páginas
- Landing completa (§7.1), índice y detalle de casos (§7.2–7.3, incluido el banner `?ref=`), proyectos (§7.4), nosotros, contacto (solo UI; envío contra un mock), gracias, legales con marcadores.
- `docs/SELLO.md` con los snippets (§8).

**DoD**: todas las rutas de §6.2 existen en ES y EN; la landing se ve bien con 0, 1, 2 y 3 casos (tests visuales o capturas en el PR); banner `?ref=footer` sin CLS; axe sin errores; Lighthouse ≥ 95 en todas.

### Fase 3 · Formulario real (`contact-api`)
- Servicio completo de §9.5 con tests; Dockerfile; integración en compose; enrutado `/api/` en local (nginx de desarrollo o proxy de Vite).
- Formulario conectado: con JS, sin JS y con la API caída.

**DoD**: en local, un envío válido llega a ntfy y al email y queda en SQLite; honeypot, timing, Turnstile inválido y rate limit probados; sin JS redirige a `/gracias/`; API caída → mensaje con contacto alternativo.

### Fase 4 · SEO, rendimiento y pulido
- OG images en build, JSON-LD, revisión de meta, `robots.txt`, sitemap.
- Presupuestos de Lighthouse CI activos; e2e completos; comprobación de enlaces; revisión de accesibilidad con teclado y lector de pantalla (VoiceOver).

**DoD**: CI completo verde con presupuestos; validador de datos estructurados sin errores; la tarjeta OG se ve bien al compartir un caso (probar con un depurador de OG).

### Fase 5 · Despliegue en el homelab
- Enseñar a Edu el plan de cambios en el servidor **antes** de ejecutarlo (§0.5).
- `infra/deploy.sh` (pull, build, up -d, healthcheck, limpieza segura), ingress del tunnel, DNS, `preview.DOMINIO` con Cloudflare Access, cabeceras, caché, monitor externo, proyecto de Cloudflare Pages de respaldo, backups de la SQLite, `RUNBOOK.md`.
- Opcional: despliegue continuo con Tailscale.

**DoD**: `preview.DOMINIO` accesible solo con Access; cabeceras de seguridad correctas; monitor externo avisando (probado parando el contenedor); fallback a Pages probado una vez; `RUNBOOK.md` con despliegue, rollback, fallback y restauración de backup.

### Fase 6 · Lanzamiento (cuando Edu resuelva §11)
- Rellenar legales, quitar `TODO(edu)` restantes, publicar primeros casos reales, abrir el dominio principal, dar de alta Web Analytics, añadir el sello a las webs de clientes.

**DoD**: `grep -r "TODO(edu)"` vacío en lo publicado; dominio principal en producción; primer crédito de cliente enlazando a su caso.

---

## 11. Bloqueos y decisiones abiertas (para Edu, no para el agente)

| # | Tema | Por qué importa |
|---|------|-----------------|
| 1 | **Titular legal y NIF** | La LSSI obliga a publicar en el aviso legal el nombre, NIF, domicilio y email de quien ofrece servicios en la web. Sin alta de autónomo no hay titular → la web puede estar en `preview` pero **no en abierto**. Ojo con el domicilio: si no quieres publicar tu casa, estudia un domicilio profesional. Revísalo con un gestor. |
| 2 | **Contrato con Deloitte** | Una web pública con tu nombre, clientes y servicios es visible para cualquiera. Hasta resolverlo: «Nosotros» sin apellidos, sin LinkedIn y sin mencionar a tu empleador. |
| 3 | **Permisos de clientes** | Por escrito (un email vale) para publicar el caso, las capturas, el logo y el testimonio. El contrato lo modela con `permisos.*`. Mete la cláusula de portfolio y crédito en tus presupuestos a partir de ahora. |
| 4 | Dominio | Sustituir `DOMINIO` en todo el repo. |
| 5 | Logo | Hasta entonces, logotipo tipográfico. |
| 6 | Copy | Titular, garantías, packs, FAQ. |
| 7 | Precios | Mostrar «desde X €» o no. |
| 8 | Proyectos propios publicables | API Arena seguro; decidir el resto. |
| 9 | Canales | Email de contacto (Cloudflare Email Routing), número de WhatsApp Business, proveedor SMTP para los avisos. |
| 10 | Tipografías | Confirmar la propuesta de §9.2. |

---

## 12. Fuera de alcance en v1
Blog, CMS o panel de administración, modo oscuro conmutable, pagos, área de clientes, chat en vivo, más idiomas. La arquitectura no impide añadir ninguno después (el blog sería otra colección).
