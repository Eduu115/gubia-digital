# Copia de seguridad de la SQLite de leads.
# No hace nada si Edu no lo confirma. Ver docs/RUNBOOK.md.
set -eu
ROOT=$(CDPATH= cd -- "$(dirname "$0")/.." && pwd)
cd "$ROOT"

if [ "${GUBIA_DEPLOY_OK:-}" != "1" ]; then
  echo "Parado. No toco el volumen de leads solo."
  echo "Cuando esté confirmado: GUBIA_DEPLOY_OK=1 $0"
  exit 1
fi

if ! docker compose -f infra/compose.yaml -p gubia ps --status running --services | grep -qx gubia-contact; then
  echo "gubia-contact no está en marcha. No he copiado nada."
  exit 1
fi

mkdir -p backups
STAMP=$(date +%Y%m%d-%H%M%S)
DEST="backups/leads-${STAMP}.sqlite"
docker compose -f infra/compose.yaml -p gubia exec -T gubia-contact \
  node --experimental-strip-types -e "
    import { openDb } from './src/db.ts';
    const db = openDb(process.env.DB_PATH || '/data/leads.sqlite');
    await db.backup('/tmp/leads-backup.sqlite');
    db.close();
  "
docker compose -f infra/compose.yaml -p gubia cp "gubia-contact:/tmp/leads-backup.sqlite" "$DEST"
echo "Copia en $DEST"
