#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

echo "=============================================="
echo "        INICIANDO SETUP DO SUPERVISOR"
echo "=============================================="

if command -v python3 &> /dev/null; then
    PY=python3
elif command -v python &> /dev/null; then
    PY=python
else
    echo "ERRO: Nenhum interpretador Python encontrado no PATH!"
    exit 1
fi

echo "[1] Configurando ambiente Python ($PY)..."
cd "$SCRIPT_DIR/backend"

if [ ! -d "venv" ]; then
    echo "Criando ambiente virtual (venv)..."
    $PY -m venv venv
fi

if [ -f "venv/bin/activate" ]; then
    source venv/bin/activate
fi

echo "Instalando dependências do Python..."
pip install --upgrade pip
pip install "fastapi" "uvicorn[standard]" "sse-starlette" "pyserial" "crc"

echo
echo "[2] Instalando dependências do Frontend (React)..."
cd "$SCRIPT_DIR/frontend"

npm install

echo
echo "=============================================="
echo "               SETUP COMPLETO!"
echo "=============================================="
