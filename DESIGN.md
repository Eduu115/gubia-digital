# Gubia Digital — DESIGN.md (proyecto)

> Estilo de referencia Awesome Design MD: **cal** (ritmo, whitespace, tipografía display + cuerpo Inter, footer oscuro).
> Tokens y marca: **kit Gubia Digital** (gana sobre §9.2 del plan y sobre los colores de Cal).

## Design read

Landing / site de estudio freelance B2B local (pymes), lenguaje **tallado / oficio / directo**, contraste fuerte crema↔verde↔tinta, acento naranja solo en acción.

## Dials (taste-skill)

- DESIGN_VARIANCE: **6**
- MOTION_INTENSITY: **3** (transiciones CSS cortas; sin scroll-jacking ni libs de animación)
- VISUAL_DENSITY: **4**

## Tokens (kit)

| Token | Hex | Rol |
|-------|-----|-----|
| verde | `#1B4D3E` | Principal, fondos oscuros de sección, «después» |
| verde-claro | `#2F7D65` | Hover / «después» sobre tinta |
| naranja | `#FF6A13` | CTA relleno, subrayado gubia (máx. ~10 % superficie) |
| naranja-oscuro | `#D8540A` | Texto naranja sobre crema (AA) |
| tinta | `#1C2B4A` | Texto; **texto de botones CTA** sobre naranja |
| crema | `#F6F1E7` | Fondo papel |
| gris | `#6B7280` | Secundario / «antes» |
| linea | `#E7E2D8` | Bordes |

**Prohibido en v1:** blanco sobre naranja (falla AA). Sin modo oscuro conmutable; secciones alternas crema / verde-tinta.

## Tipografía (kit)

- Titulares: **Space Grotesk** (500/700), self-hosted Fontsource
- Cuerpo: **Inter** (400/600), self-hosted Fontsource
- Base: 16px móvil / 18px escritorio; contenedor máx. 1200px; radios 6–10px

## Layout habits (de Cal, adaptados)

- Canvas claro, CTAs sólidos, whitespace generoso
- Footer en tinta/verde que cierra la página
- Hero split asimétrico (copy izquierda, comparador derecha)
- Sin cards decorativas; bordes hairline + espacio
- Eyebrows racionados (máx. 1 por cada 3 secciones)

## Stack

Astro 7 + MDX + Tailwind v4 + custom elements vanilla. Sin React/GSAP salvo justificación.
