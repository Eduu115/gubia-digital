# Despliegue manual en el homelab.
# No hace nada si Edu no lo confirma. Ver docs/RUNBOOK.md.
set -eu
ROOT=$(CDPATH= cd -- "$(dirname "$0")/.." && pwd)
cd "$ROOT"

if [ "${GUBIA_DEPLOY_OK:-}" != "1" ]; then
  echo "Parado. No despliego solo."
  echo "Lee docs/RUNBOOK.md. Cuando esté confirmado:"
  echo "  GUBIA_DEPLOY_OK=1 $0"
  exit 1
fi

git pull --ff-only
docker compose -f infra/compose.yaml -p gubia build
docker compose -f infra/compose.yaml -p gubia up -d --remove-orphans
docker compose -f infra/compose.yaml -p gubia ps

# Solo imágenes colgantes y caché de build vieja. Nunca volúmenes.
docker image prune -f
docker builder prune -f --filter until=72h

echo "Contenedores arriba. Comprueba la web y http://127.0.0.1:8787/api/health antes de tocar el túnel."
