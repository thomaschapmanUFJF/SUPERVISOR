@echo off
:: Obtém o diretório onde este .bat está
set "SCRIPT_DIR=%~dp0"
:: Remove a barra final
set "SCRIPT_DIR=%SCRIPT_DIR:~0,-1%"

echo ==============================================
echo   INICIANDO SISTEMA SUPERVISORIO SUPERNOVA
echo ==============================================

echo [1] Iniciando o Servidor de Desenvolvimento do React (Vite)...
start "FRONTEND - React" cmd /k "cd /d "%SCRIPT_DIR%\frontend" && npm run dev"
timeout /t 2 /nobreak

echo [2] Abrindo o Painel no Navegador...
start http://localhost:5173
timeout /t 3 /nobreak

echo [3] Iniciando o Backend e Motor de Leitura (main.py)...
start "ESTACAO SOLO - Backend" cmd /k "cd /d "%SCRIPT_DIR%\backend" && python main.py 1"

echo ==============================================
echo Tudo pronto! Esta janela fechara em 5 segundos.
echo ==============================================

timeout /t 5 /nobreak
exit