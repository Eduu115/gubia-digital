# Runbook — Gubia Digital

Esto es el procedimiento. **No se ha ejecutado en el homelab.** Hay Nextcloud y otros servicios en ese servidor: no hagas `docker compose down -v`, ni `docker volume prune`, ni `docker system prune --volumes`.

Hasta que el aviso legal tenga titular, NIF y domicilio, el sitio solo debería vivir en `preview.DOMINIO`, detrás de Cloudflare Access. No abras el dominio público.

## Qué hay que tener antes

- `TODO(edu)`: el dominio real, en lugar de `DOMINIO`.
- El checkout del repo en el servidor, y Docker.
- `contact-api/.env` en el servidor (no se commitea). En local no hace falta. Para el homelab, como mínimo `IP_HASH_SALT`. `TURNSTILE_SECRET`, ntfy y SMTP solo cuando existan; si pones el secreto de Turnstile sin el widget, el formulario rechaza todos los envíos.
- Túnel `cloudflared` ya existente. El ejemplo de rutas está en `infra/cloudflared-ingress.example.yml`. Hay que adaptarlo a mano según cloudflared sea contenedor o servicio del sistema. No he comprobado cómo corre en el servidor.

## Desplegar

Desde la raíz del repo, en el servidor:

```bash
GUBIA_DEPLOY_OK=1 infra/deploy.sh
```

El script hace `git pull --ff-only`, `docker compose -p gubia build`, `up -d`, y limpia solo imágenes colgantes y caché de build de más de 72 horas. Sin la variable `GUBIA_DEPLOY_OK=1` se detiene y no llama a Docker.

Luego:

1. `docker compose -f infra/compose.yaml -p gubia ps` — los dos servicios en healthy.
2. Abrir la web y `https://preview.DOMINIO/api/health` (o `http://127.0.0.1:8787/api/health` si aún no está el túnel).
3. Enviar un formulario de prueba y comprobar que el lead está en la SQLite.

## Volver atrás

```bash
git log --oneline -5
git checkout <commit-anterior>
GUBIA_DEPLOY_OK=1 infra/deploy.sh
```

Eso reconstruye las imágenes de ese commit. No borra el volumen `gubia-leads`.

## Copia de los leads

```bash
GUBIA_DEPLOY_OK=1 infra/backup-leads.sh
```

Deja `backups/leads-FECHA.sqlite` en la raíz del repo. Esa carpeta no se sube a git. Conviene copiarla al disco de datos del servidor, fuera del checkout.

Para restaurar, con Edu presente:

```bash
docker compose -f infra/compose.yaml -p gubia stop gubia-contact
docker compose -f infra/compose.yaml -p gubia cp backups/leads-FECHA.sqlite gubia-contact:/data/leads.sqlite
docker compose -f infra/compose.yaml -p gubia start gubia-contact
```

`stop` de un solo servicio no toca volúmenes ajenos. No uses `down -v`.

## Si el homelab cae

La web puede servirse desde Cloudflare Pages con el mismo `dist/` (`pnpm --filter web build`). El formulario, sin la API, muestra el email de contacto. Pasos que aún hay que hacer una vez, con el dominio real:

1. Crear el proyecto de Pages y subir `web/dist`.
2. Probar el cambio de DNS o de túnel hacia Pages, y volver a dejar el túnel hacia el homelab.
3. Un monitor externo (UptimeRobot o Better Stack, plan gratuito) sobre `/` y `/api/health`. Un monitor dentro del homelab no vale: cae con él.

## Qué no hacer

- No publicar el dominio principal mientras el aviso legal tenga `TODO(edu)`.
- No podar volúmenes ni bajar stacks que no se llamen `gubia`.
- No abrir el 443 ni el 8443: ya están ocupados. El acceso público entra por el túnel.
