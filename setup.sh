#!/usr/bin/env bash
# Equivalente do setup.bat para Linux / GitHub Codespaces.
# Instala as dependencias do backend (Python) e do frontend (Node).

set -e  # para o script se algum comando falhar

echo "=============================================="
echo "               INICIANDO SETUP"
echo "=============================================="

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# Descobre se e' "python" ou "python3"
if command -v python3 &> /dev/null; then
    PY=python3
elif command -v python &> /dev/null; then
    PY=python
else
    echo "ERRO: nenhum interpretador Python encontrado no PATH!"
    exit 1
fi

echo "[1] Instalando dependencias do Python ($PY)..."
cd "$SCRIPT_DIR/backend"

# --break-system-packages e' necessario em imagens Debian/Ubuntu recentes
# (como as usadas pelo Codespaces), que bloqueiam pip fora de venv por padrao.
if ! $PY -m pip install "fastapi[standard]" pyserial crc --break-system-packages 2>/tmp/pip_err.log; then
    if grep -q "externally-managed-environment" /tmp/pip_err.log; then
        echo "Ambiente gerenciado externamente detectado, tentando novamente..."
    fi
    $PY -m pip install "fastapi[standard]" pyserial crc --break-system-packages || {
        echo "ERRO: instalacao das dependencias Python falhou!"
        exit 1
    }
fi

echo
echo "[2] Instalando dependencias do React..."
cd "$SCRIPT_DIR/frontend"

if [ ! -d "." ]; then
    echo "ERRO: pasta 'frontend' nao encontrada!"
    exit 1
fi

rm -rf node_modules package-lock.json
npm install

echo
echo "=============================================="
echo "               SETUP COMPLETO!"
echo "=============================================="