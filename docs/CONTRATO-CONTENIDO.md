# Gubia Digital — Contrato de contenido

> Formato exacto en el que se entregan **casos de clientes** y **proyectos propios** a la web.
> Lo usan dos agentes: el que convierte los informes en contenido (lo **produce**) y el agente de código (lo **valida y renderiza**). Si algo no cumple este contrato, el build falla.
> Versión 1 · 29/09/2026

---

## 1. Entrega

Cada caso o proyecto es **una carpeta** con este contenido:

```
casos/<slug>/
├─ caso.yaml          # datos + textos cortos bilingües
├─ es.mdx             # narrativa en español (obligatorio)
├─ en.mdx             # narrativa en inglés (muy recomendable)
├─ img/               # capturas, logo, portada
└─ informe-es.pdf     # opcional (e informe-en.pdf)

proyectos/<slug>/
├─ proyecto.yaml
├─ es.mdx
├─ en.mdx
└─ img/
```

**Slug**: nombre del cliente o proyecto en kebab-case, sin tildes ni eñes, ≤ 40 caracteres (`panaderia-lucia`, `api-arena`). Es la URL (`/casos/panaderia-lucia/`) y es igual en ambos idiomas. No puede empezar por `_` (reservado para los datos de demostración).

**Regla de oro**: los datos que no se traducen (números, fechas, imágenes, URLs) van **solo** en el YAML. Los textos cortos que sí se traducen van en el YAML como `{ es: "…", en: "…" }`. La narrativa larga va en los `.mdx`.

---

## 2. `caso.yaml`

### 2.1 Campos

| Campo | Tipo | Oblig. | Notas |
|-------|------|:-----:|-------|
| `cliente` | texto | ✅ | Nombre comercial. |
| `anonimo` | booleano | | Por defecto `false`. Si `true`: no se muestra nombre, logo ni enlace en vivo. |
| `clienteAnonimo` | `{es, en}` | si `anonimo` | P. ej. «Panadería en Chamberí» / «Bakery in Chamberí». |
| `publicar` | booleano | ✅ | `false` = existe en el repo pero no sale en la web. |
| `destacado` | booleano | | Aparece en la landing. Por defecto `false`. |
| `orden` | entero | | Menor = antes. Por defecto `100`. |
| `sector` | enum (§4.1) | ✅ | |
| `ubicacion` | texto | ✅ | Ciudad o barrio: «Madrid», «Alcalá de Henares». |
| `fecha` | `AAAA-MM` | ✅ | Mes de entrega. |
| `duracionSemanas` | entero | | Duración del proyecto. |
| `servicios` | lista de enum (§4.2) | ✅ | Mínimo 1. |
| `stack` | lista de texto | | «Astro», «Node.js», «PostgreSQL»… |
| `urlEnVivo` | URL | | Web publicada del cliente. |
| `logo` | ruta de imagen | | Requiere `permisos.mostrarLogo: true`. SVG o PNG con fondo transparente. |
| `portada` | ruta de imagen | ✅ | Para tarjetas e imagen OG. Normalmente la captura «después» de escritorio. |
| `permisos` | objeto (§2.2) | ✅ | |
| `puntoDePartida` | objeto (§2.3) | ✅ | |
| `comparativas` | lista (§2.4) | según caso | ≥ 1 si `puntoDePartida.tipo: web`. |
| `capturas` | lista (§2.5) | según caso | ≥ 1 si `puntoDePartida.tipo` es `sin-web` u `otro`. |
| `metricas` | lista (§2.6) | | Solo medidas reales (§5). |
| `testimonio` | objeto (§2.7) | | Requiere `permisos.testimonio: true`. |
| `informes` | `{es?, en?}` rutas a PDF | | Informe completo descargable. |

### 2.2 `permisos`

| Campo | Tipo | Oblig. | Notas |
|-------|------|:-----:|-------|
| `publicarCaso` | booleano | ✅ | Sin esto a `true`, el caso no se publica aunque `publicar` sea `true`. |
| `mostrarLogo` | booleano | | |
| `testimonio` | booleano | | |
| `fechaConsentimiento` | `AAAA-MM-DD` | si `publicarCaso` | Fecha del email o documento en el que el cliente lo autoriza. |
| `medio` | texto | | «email», «presupuesto firmado»… |

### 2.3 `puntoDePartida`

| Campo | Tipo | Oblig. | Notas |
|-------|------|:-----:|-------|
| `tipo` | `web` \| `sin-web` \| `otro` | ✅ | `web`: tenía web previa → slider antes/después. `sin-web`: no tenía nada. `otro`: solo redes, Google Maps, carta en papel… |
| `descripcion` | `{es, en}` | ✅ | 1–2 frases: de dónde se partía. |
| `imagen` | ruta de imagen | | Para `sin-web`/`otro`: captura del perfil de Instagram, ficha de Google… |
| `altImagen` | `{es, en}` | si `imagen` | |

### 2.4 `comparativas[]` (pares antes/después)

| Campo | Tipo | Oblig. | Notas |
|-------|------|:-----:|-------|
| `id` | texto kebab-case | ✅ | Único en el caso: `home`, `carta`, `contacto`… |
| `dispositivo` | `desktop` \| `movil` | ✅ | |
| `antes` | ruta de imagen | ✅ | |
| `despues` | ruta de imagen | ✅ | **Misma relación de aspecto que `antes`** (tolerancia 1 %). |
| `alt.antes` | `{es, en}` | ✅ | Describe lo que se ve, no «captura antes». |
| `alt.despues` | `{es, en}` | ✅ | |
| `pie` | `{es, en}` | | Leyenda breve. |

Un mismo `id` puede aparecer dos veces (una `desktop` y otra `movil`): la web lo muestra como pestañas Escritorio / Móvil.

### 2.5 `capturas[]` (imágenes sueltas del resultado)

| Campo | Tipo | Oblig. |
|-------|------|:-----:|
| `id` | texto kebab-case | ✅ |
| `dispositivo` | `desktop` \| `movil` | ✅ |
| `src` | ruta de imagen | ✅ |
| `alt` | `{es, en}` | ✅ |
| `pie` | `{es, en}` | |

### 2.6 `metricas[]`

| Campo | Tipo | Oblig. | Notas |
|-------|------|:-----:|-------|
| `id` | texto | | Por defecto, igual que `clave`. Obligatorio si hay dos métricas con la misma `clave`. |
| `clave` | enum (§4.3) | ✅ | |
| `antes` | número | ✅ | En la unidad de la tabla §4.3. |
| `despues` | número | ✅ | |
| `fuente` | texto | ✅ | «PageSpeed Insights · móvil · página de inicio». |
| `fechaAntes` | `AAAA-MM-DD` | ✅ | |
| `fechaDespues` | `AAAA-MM-DD` | ✅ | |
| `etiqueta` | `{es, en}` | si `custom` | |
| `unidad` | texto | si `custom` | «llamadas/mes», «%», «€»… |
| `mejor` | `menor` \| `mayor` | si `custom` | Si baja es mejora (`menor`) o si sube (`mayor`). |

Para las claves conocidas, unidad y dirección salen de la tabla §4.3: no se escriben.

### 2.7 `testimonio`

| Campo | Tipo | Oblig. | Notas |
|-------|------|:-----:|-------|
| `autor` | texto | ✅ | Como autorice el cliente: «Lucía P.». |
| `cargo` | `{es, en}` | ✅ | «Propietaria» / «Owner». |
| `texto` | `{es, en}` | ✅ | Palabras reales del cliente. La traducción no se «mejora». |
| `idiomaOriginal` | `es` \| `en` | ✅ | La web marca la otra versión como «(traducido)». |

### 2.8 Ejemplo completo (datos ficticios)

```yaml
# casos/panaderia-demo/caso.yaml  — EJEMPLO FICTICIO
cliente: "Panadería Demo"
publicar: false
destacado: true
orden: 1
sector: hosteleria
ubicacion: "Madrid"
fecha: "2026-10"
duracionSemanas: 4
servicios: [rediseno, seo-local]
stack: [Astro, Node.js, PostgreSQL]
urlEnVivo: "https://panaderia-demo.example"
logo: ./img/logo.svg
portada: ./img/despues-home-desktop.png

permisos:
  publicarCaso: true
  mostrarLogo: true
  testimonio: true
  fechaConsentimiento: "2026-10-20"
  medio: "email"

puntoDePartida:
  tipo: web
  descripcion:
    es: "Una web de 2014 que no se veía en móvil y tardaba más de 4 segundos en cargar."
    en: "A 2014 website that broke on mobile and took over 4 seconds to load."

comparativas:
  - id: home
    dispositivo: desktop
    antes: ./img/antes-home-desktop.png
    despues: ./img/despues-home-desktop.png
    alt:
      antes:
        es: "Página de inicio antigua con texto pequeño sobre una foto oscura y un menú de 9 enlaces"
        en: "Old homepage with small text over a dark photo and a 9-link menu"
      despues:
        es: "Página de inicio nueva con foto del obrador, horario visible y botón de pedir por WhatsApp"
        en: "New homepage with a bakery photo, visible opening hours and an order-via-WhatsApp button"
    pie:
      es: "El horario y el pedido pasan a verse sin hacer scroll."
      en: "Opening hours and ordering are now visible without scrolling."
  - id: home
    dispositivo: movil
    antes: ./img/antes-home-movil.png
    despues: ./img/despues-home-movil.png
    alt:
      antes: { es: "Versión móvil antigua, cortada por la derecha", en: "Old mobile version, cut off on the right" }
      despues: { es: "Versión móvil nueva, con botón de llamar fijo abajo", en: "New mobile version with a sticky call button" }

metricas:
  - clave: lcp
    antes: 4.2
    despues: 0.9
    fuente: "PageSpeed Insights · móvil · página de inicio"
    fechaAntes: "2026-09-01"
    fechaDespues: "2026-10-18"
  - clave: lighthouse-accesibilidad
    antes: 61
    despues: 100
    fuente: "Lighthouse 12 · móvil · página de inicio"
    fechaAntes: "2026-09-01"
    fechaDespues: "2026-10-18"
  - clave: custom
    id: pedidos-whatsapp
    etiqueta: { es: "Pedidos por WhatsApp", en: "WhatsApp orders" }
    unidad: "/semana"
    mejor: mayor
    antes: 3
    despues: 11
    fuente: "Datos del cliente (media de 4 semanas)"
    fechaAntes: "2026-09-01"
    fechaDespues: "2026-11-15"

testimonio:
  autor: "Lucía P."
  cargo: { es: "Propietaria", en: "Owner" }
  idiomaOriginal: es
  texto:
    es: "Ahora la gente nos encuentra en Google y nos pide por WhatsApp directamente desde la web."
    en: "People now find us on Google and order through WhatsApp straight from the website."

informes:
  es: ./informe-es.pdf
  en: ./informe-en.pdf
```

---

## 3. `es.mdx` / `en.mdx`

### 3.1 Frontmatter

| Campo | Oblig. | Límite | Uso |
|-------|:-----:|--------|-----|
| `titulo` | ✅ | ≤ 70 caracteres | H1 de la página. Orientado a resultado. |
| `resumen` | ✅ | ≤ 160 caracteres | Tarjetas y listados. |
| `descripcionSeo` | ✅ | ≤ 155 caracteres | Meta description. |

### 3.2 Cuerpo

- Empieza en `##` (el H1 sale del `titulo`). Sin HTML crudo, sin `import`.
- Estructura para **casos**:
  - ES: `## Punto de partida` · `## Qué hicimos` · `## Resultado` · `## Detalles técnicos` (opcional)
  - EN: `## Starting point` · `## What we did` · `## Outcome` · `## Technical details` (optional)
- Estructura para **proyectos**:
  - ES: `## El problema` · `## La solución` · `## Arquitectura` (opcional) · `## Qué aprendimos`
  - EN: `## The problem` · `## The solution` · `## Architecture` (optional) · `## What we learned`
- Componentes disponibles (sin importarlos):

| Componente | Qué hace |
|------------|----------|
| `<Comparativa id="home" />` | Inserta el antes/después con ese `id`. |
| `<Captura id="reservas" />` | Inserta una captura de `capturas[]`. |
| `<Metrica id="lcp" />` | Inserta una tarjeta de métrica. |
| `<Nota>Texto</Nota>` | Caja destacada. |

### 3.3 Estilo
- **Casos**: los lee el dueño de un negocio. Tuteo, frases cortas, sin jerga. Lo técnico, solo en «Detalles técnicos».
- **Proyectos propios**: pueden ser más técnicos. Los lee alguien que evalúa la capacidad del equipo.
- Nada de superlativos vacíos («increíble», «revolucionario»). Hechos y números.
- Los números de la narrativa deben coincidir con los del YAML. Mejor usar `<Metrica />` que repetirlos a mano.
- **Inglés**: traducción adaptada y natural, no literal. Misma estructura y mismos datos.

### 3.4 Ejemplo (`es.mdx`, ficticio)

```mdx
---
titulo: "De una web de 2014 a pedidos por WhatsApp desde el móvil"
resumen: "Rediseño completo para una panadería de barrio: carga 4 veces más rápida y el triple de pedidos por WhatsApp."
descripcionSeo: "Caso de Panadería Demo: rediseño web, SEO local y pedidos por WhatsApp. Antes y después con métricas reales."
---

## Punto de partida

La web se hizo en 2014 y no se había tocado desde entonces. En el móvil se cortaba por la derecha y el horario estaba escondido en la tercera página.

<Comparativa id="home" />

## Qué hicimos

Una sola página clara: quiénes son, horario, carta y un botón para pedir por WhatsApp siempre visible.

<Metrica id="lcp" />

## Resultado

<Metrica id="pedidos-whatsapp" />

En seis semanas, los pedidos por WhatsApp pasaron de 3 a 11 por semana.
```

---

## 4. Valores permitidos

### 4.1 `sector`
`hosteleria` · `comercio` · `belleza` · `salud-bienestar` · `deporte` · `educacion` · `servicios-profesionales` · `construccion-reformas` · `inmobiliaria` · `cultura-ocio` · `industria` · `tecnologia` · `asociacion` · `otro`

### 4.2 `servicios`
`web-nueva` · `rediseno` · `tienda-online` · `seo-local` · `branding` · `mantenimiento` · `consultoria` · `app-a-medida`

(Las etiquetas visibles en ES/EN viven en el diccionario de la web, no aquí.)

### 4.3 `metricas.clave`

| Clave | Etiqueta ES | Etiqueta EN | Unidad | Mejor |
|-------|-------------|-------------|--------|-------|
| `lighthouse-rendimiento` | Rendimiento | Performance | /100 | mayor |
| `lighthouse-accesibilidad` | Accesibilidad | Accessibility | /100 | mayor |
| `lighthouse-seo` | SEO | SEO | /100 | mayor |
| `lighthouse-buenas-practicas` | Buenas prácticas | Best practices | /100 | mayor |
| `lcp` | Carga del contenido principal | Largest Contentful Paint | s | menor |
| `cls` | Estabilidad visual | Cumulative Layout Shift | — | menor |
| `inp` | Respuesta a la interacción | Interaction to Next Paint | ms | menor |
| `peso-pagina` | Peso de la página | Page weight | KB | menor |
| `peticiones` | Peticiones | Requests | — | menor |
| `custom` | *(de `etiqueta`)* | *(de `etiqueta`)* | *(de `unidad`)* | *(de `mejor`)* |

---

## 5. Reglas de honestidad (no negociables)

1. **Solo métricas medidas.** Misma herramienta, misma página, mismo dispositivo antes y después. Con fecha y fuente.
2. **Métricas de negocio** (pedidos, llamadas, reservas) solo si las aporta el cliente, con su permiso, y con `fuente: "Datos del cliente…"`.
3. Si no hay métrica fiable, no se pone. Un caso sin métricas es válido; uno con cifras inventadas hunde la credibilidad de todos.
4. Testimonios literales. Se puede recortar, no reescribir.
5. Las capturas no pueden mostrar datos personales (nombres, teléfonos o emails de terceros, reseñas con nombre): se difuminan.

---

## 6. Imágenes

| Tipo | Especificación |
|------|----------------|
| Formato | PNG, JPG o WebP. Logo: SVG preferible. |
| Escritorio | Captura del **viewport** 1440 × 900 (a 1× o 2×). No página completa. |
| Móvil | Viewport 390 × 844 (a 2× o 3×). |
| Pares antes/después | **Mismas dimensiones**, misma página, mismo scroll, mismo estado (sin banners de cookies distintos, sin popups). |
| Peso | ≤ 3 MB por fichero (la web optimiza después). |
| Nombres | `antes-<id>-<dispositivo>.png`, `despues-<id>-<dispositivo>.png`, `captura-<id>-<dispositivo>.png`, `logo.svg`, `punto-de-partida.png`. |

**Si la web antigua ya no existe**: usar una captura de Wayback Machine y decirlo en el `pie` («Captura de archivo, Wayback Machine, marzo 2025»).

---

## 7. Checklist antes de entregar

- [ ] Carpeta con slug válido; `caso.yaml` (o `proyecto.yaml`) + `es.mdx` (+ `en.mdx`) + `img/`.
- [ ] `permisos.publicarCaso: true` con fecha, o `publicar: false`.
- [ ] Todas las rutas de imagen existen y los pares tienen las mismas dimensiones.
- [ ] Todos los `alt` en ES y EN describen la imagen.
- [ ] Cada métrica tiene fuente y ambas fechas.
- [ ] Números de la narrativa = números del YAML.
- [ ] `titulo` ≤ 70, `resumen` ≤ 160, `descripcionSeo` ≤ 155 caracteres.
- [ ] Sin datos personales visibles en las capturas.
- [ ] `pnpm content:check` en verde (si tienes el repo a mano).

---

## 8. `proyecto.yaml`

| Campo | Tipo | Oblig. | Notas |
|-------|------|:-----:|-------|
| `nombre` | texto | ✅ | «API Arena». |
| `publicar` | booleano | ✅ | |
| `destacado` | booleano | | En la landing, en grande. |
| `orden` | entero | | Por defecto `100`. |
| `estado` | `produccion` \| `desarrollo` \| `pausado` \| `archivado` | ✅ | |
| `tipo` | `producto` \| `herramienta` \| `experimento` \| `open-source` | ✅ | |
| `tagline` | `{es, en}` | ✅ | ≤ 90 caracteres. |
| `rol` | `{es, en}` | ✅ | «Diseño, backend y despliegue». |
| `fechaInicio` | `AAAA-MM` | ✅ | |
| `fechaFin` | `AAAA-MM` | | |
| `stack` | lista de texto | ✅ | |
| `enlaces` | `{web?, repo?, demo?, articulo?}` URLs | | |
| `portada` | ruta de imagen | ✅ | |
| `capturas` | lista (igual que §2.5) | | |
| `cifras` | lista de `{valor: texto, etiqueta: {es, en}}` | | Máx. 4. P. ej. `valor: "9"`, `etiqueta: {es: "microservicios", en: "microservices"}`. |

Ejemplo mínimo:

```yaml
# proyectos/api-arena/proyecto.yaml
nombre: "API Arena"
publicar: true
destacado: true
orden: 1
estado: produccion
tipo: producto
tagline:
  es: "Aprende a diseñar APIs REST compitiendo en retos"
  en: "Learn REST API design by competing in challenges"
rol:
  es: "Diseño, desarrollo y operación"
  en: "Design, development and operations"
fechaInicio: "2025-01"   # TODO(edu): fecha real
stack: [Java 21, Spring Boot, Kafka, PostgreSQL, Redis, MongoDB, Docker]
enlaces:
  web: "https://apiarena.net"
portada: ./img/portada.png
cifras:
  - valor: "9"
    etiqueta: { es: "microservicios", en: "microservices" }
```

---

## 9. Prompt para el agente de informes

Copia esto al agente, junto con este documento y el informe del cliente:

> Convierte el informe adjunto en un caso para la web de Gubia Digital siguiendo **exactamente** el documento «Contrato de contenido» (v1). Entrega una carpeta `casos/<slug>/` con `caso.yaml`, `es.mdx`, `en.mdx` y la lista de imágenes que necesitas en `img/`, con sus nombres según §6. No inventes métricas, fechas, permisos ni testimonios: si el informe no los tiene, deja el campo fuera y lístalo al final como «Falta confirmar». Los textos de los casos van dirigidos a dueños de pequeños negocios: tuteo, frases cortas, sin jerga. Antes de entregar, repasa la checklist de §7 y dime qué puntos no se cumplen.
