#!/usr/bin/env bash
# ── PlanCity Docker helper ────────────────────────────────────────────────────
# Usa el socket correcto del daemon Docker del sistema (no Docker Desktop)
export DOCKER_HOST=unix:///var/run/docker.sock

case "$1" in
  up)
    echo "🚀 Levantando PlanCity (build completo)..."
    docker compose up --build "${@:2}"
    ;;
  down)
    echo "🛑 Deteniendo contenedores..."
    docker compose down "${@:2}"
    ;;
  logs)
    docker compose logs -f "${@:2}"
    ;;
  restart)
    echo "🔄 Reiniciando..."
    docker compose down && docker compose up --build
    ;;
  clean)
    echo "🧹 Eliminando contenedores, imágenes y volúmenes del proyecto..."
    docker compose down --rmi local --volumes --remove-orphans
    ;;
  *)
    echo "Uso: ./run.sh [up|down|logs|restart|clean]"
    echo ""
    echo "  up       → docker compose up --build"
    echo "  down     → docker compose down"
    echo "  logs     → docker compose logs -f"
    echo "  restart  → down + up"
    echo "  clean    → elimina contenedores e imágenes locales"
    ;;
esac
