#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
LOG_DIR="$SCRIPT_DIR/.run-logs"
mkdir -p "$LOG_DIR"

if command -v python3 >/dev/null 2>&1; then
    PY=python3
elif command -v python >/dev/null 2>&1; then
    PY=python
else
    echo "ERRO: nenhum interpretador Python encontrado no PATH!" >&2
    exit 1
fi

cleanup() {
    echo ""
    echo "Encerrando processos..."
    [[ -n "${BACKEND_PID:-}" ]] && kill "$BACKEND_PID" 2>/dev/null || true
    [[ -n "${FRONTEND_PID:-}" ]] && kill "$FRONTEND_PID" 2>/dev/null || true
    exit 0
}
trap cleanup INT TERM EXIT

start_backend() {
    echo "[1/2] Iniciando backend..."
    cd "$SCRIPT_DIR/backend"
    "$PY" main.py 1 >"$LOG_DIR/backend.log" 2>&1 &
    BACKEND_PID=$!
}

start_frontend() {
    echo "[2/2] Iniciando frontend..."
    cd "$SCRIPT_DIR/frontend"
    npm run dev -- --host 0.0.0.0 --port 5173 --strictPort >"$LOG_DIR/frontend.log" 2>&1 &
    FRONTEND_PID=$!
}

start_backend
start_frontend

sleep 3

echo ""
echo "=============================================="
echo "SUPERVISOR em execução"
echo "Frontend: http://127.0.0.1:5173"
echo "Backend:  http://127.0.0.1:8000/sse/rows"
echo "Logs: $LOG_DIR"
echo "Pressione Ctrl+C para encerrar ambos os processos."
echo "=============================================="
echo ""

wait "$BACKEND_PID" "$FRONTEND_PID" 2>/dev/null || true
