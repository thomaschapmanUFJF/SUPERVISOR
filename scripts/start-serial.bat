@echo off
set "SCRIPT_DIR=%~dp0.."
pushd "%SCRIPT_DIR%"
set "ROOT_DIR=%cd%"
popd

echo ==============================================
echo   INICIANDO SISTEMA SUPERVISORIO SUPERNOVA
echo            (MODO HARDWARE - SERIAL)
echo ==============================================

echo [1] Iniciando o Servidor de Desenvolvimento do Frontend (Vite)...
start "FRONTEND - React" cmd /k "cd /d "%ROOT_DIR%\frontend" && npm run dev"
timeout /t 3 /nobreak > NUL

echo [2] Abrindo o Painel no Navegador...
start http://localhost:5173
timeout /t 2 /nobreak > NUL

echo [3] Iniciando o Backend em modo HARDWARE (serial)...
start "ESTACAO SOLO - Backend (Serial)" cmd /k "cd /d "%ROOT_DIR%\backend" && python main.py 0"
timeout /t 2 /nobreak > NUL

echo [4] Iniciando o Simulador de Telemetria (Porta Virtual)...
:: Rodando como modulo para garantir que os imports da pasta config funcionem
start "SIMULADOR - Foguete (Porta Virtual)" cmd /k "cd /d "%ROOT_DIR%\backend" && python -m mocks.telemetry_simulator"

echo ==============================================
echo Tudo pronto! Esta janela fechara em 5 segundos.
echo ==============================================

timeout /t 5 /nobreak
exit
