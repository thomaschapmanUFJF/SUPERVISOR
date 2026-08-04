#!/usr/bin/env bash
# Setup script for Linux / GitHub Codespaces.
# Installs backend (Python) and frontend (Node.js) dependencies.

set -e  # Exit immediately if a command exits with a non-zero status

echo "=============================================="
echo "               INICIANDO SETUP"
echo "=============================================="

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# Discover Python binary
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

# Recommended: Create and activate a virtual environment
if [ ! -d "venv" ]; then
    echo "Criando ambiente virtual (venv)..."
    $PY -m venv venv
fi

# Activate venv for this script session
source venv/bin/activate

echo "Instalando dependências do Python..."
pip install --upgrade pip

if [ -f "requirements.txt" ]; then
    pip install -r requirements.txt
else
    # Lean backend installation for SSE + Serial + Utilities
    pip install "fastapi" "uvicorn[standard]" "pyserial" "crc"
fi

echo
echo "[2] Instalando dependencias do React..."
cd "$SCRIPT_DIR/frontend"

if [ ! -d "." ]; then
    echo "ERRO: Pasta 'frontend' não encontrada!"
    exit 1
fi

# Fast & deterministic dependency installation
npm ci || npm install

echo
echo "=============================================="
echo "               SETUP COMPLETO!"
echo "=============================================="