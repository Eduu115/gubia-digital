# Gubia Digital

Web de Gubia Digital (Astro 7 + MDX + Tailwind v4). Monorepo pnpm.

## Arranque

```bash
corepack enable
pnpm install
pnpm --filter web exec astro dev --host 127.0.0.1 --port 4321
```

Handoff vivo: [`docs/SESION.md`](docs/SESION.md) · Plan: [`docs/PLAN-IMPLEMENTACION.md`](docs/PLAN-IMPLEMENTACION.md)

## Marca

Tokens y assets del kit Gubia Digital (no §9.2 del plan). Ver `DESIGN.md`.

## Estructura

- `web/` — sitio estático Astro
- `contact-api/` — formulario de contacto (Hono + SQLite)
- `infra/` — compose/nginx stubs
- `docs/` — plan, contrato, sesión, sello
