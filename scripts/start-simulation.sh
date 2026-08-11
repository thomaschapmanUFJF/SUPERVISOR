#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

if command -v python3 &> /dev/null; then
    PY=python3
elif command -v python &> /dev/null; then
    PY=python
else
    echo "ERRO: nenhum interpretador Python encontrado no PATH!"
    exit 1
fi

echo "=============================================="
echo "  INICIANDO SISTEMA SUPERVISORIO SUPERNOVA"
echo "        (MODO SIMULACAO - CSV)"
echo "=============================================="

cleanup() {
    echo ""
    echo "Encerrando processos..."
    kill "${BACKEND_PID:-}" 2>/dev/null || true
    kill "${FRONTEND_PID:-}" 2>/dev/null || true
    exit 0
}
trap cleanup INT TERM EXIT

echo "[1] Iniciando o Backend (modo simulado)..."
cd "$SCRIPT_DIR/backend"
if [ -f "venv/bin/activate" ]; then
    source venv/bin/activate
fi
$PY main.py 1 &
BACKEND_PID=$!

sleep 2

echo "[2] Iniciando o Frontend (Vite dev server)..."
cd "$SCRIPT_DIR/frontend"
npm run dev -- --host 0.0.0.0 --port 5173 &
FRONTEND_PID=$!

sleep 2

echo "=============================================="
echo "Tudo pronto!"
echo "Frontend: http://localhost:5173"
echo "Pressione Ctrl+C para encerrar ambos os processos."
echo "=============================================="

wait
