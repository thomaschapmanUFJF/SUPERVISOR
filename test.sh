#!/usr/bin/env bash
# Equivalente do start.bat para Linux / GitHub Codespaces.
#
# O start.bat original sobe o SUPERVISOR em modo de hardware real (porta serial
# fisica + simulador escrevendo numa porta COM virtual via com0com). Esse modo
# depende de recursos exclusivos do Windows e nao tem equivalente possivel aqui.
#
# Este script sobe o sistema no modo de teste (o mesmo usado pelo test.bat):
# o backend le os pacotes direto de um CSV simulado, sem precisar de nenhuma
# porta serial. Para uso em campo com hardware real, use um computador Windows
# com o start.bat original.

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

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
echo "  (modo de teste/simulado)"
echo "=============================================="

# Mata os processos filhos (backend/frontend) ao encerrar o script com Ctrl+C
cleanup() {
    echo ""
    echo "Encerrando..."
    kill "$BACKEND_PID" 2>/dev/null
    kill "$FRONTEND_PID" 2>/dev/null
    exit 0
}
trap cleanup INT TERM

echo "[1] Iniciando o Backend e Motor de Leitura (main.py, modo teste)..."
cd "$SCRIPT_DIR/backend"
$PY main.py 1 &
BACKEND_PID=$!

sleep 2

echo "[2] Iniciando o Servidor de Desenvolvimento do React (Vite)..."
cd "$SCRIPT_DIR/frontend"
npm run dev &
FRONTEND_PID=$!

sleep 2

echo "=============================================="
echo "Tudo pronto!"
echo "No Codespaces, confira a aba 'PORTS' (embaixo do"
echo "terminal) para pegar o link publico da porta 5173."
echo "Pressione Ctrl+C aqui para encerrar os dois processos."
echo "=============================================="

wait