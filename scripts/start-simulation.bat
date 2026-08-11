@echo off
set "SCRIPT_DIR=%~dp0.."
pushd "%SCRIPT_DIR%"
set "ROOT_DIR=%cd%"
popd

echo ==============================================
echo   INICIANDO SISTEMA SUPERVISORIO SUPERNOVA
echo            (MODO SIMULACAO - CSV)
echo ==============================================

echo [1] Iniciando o Servidor de Desenvolvimento do Frontend (Vite)...
start "FRONTEND - React" cmd /k "cd /d "%ROOT_DIR%\frontend" && npm run dev"
timeout /t 3 /nobreak > NUL

echo [2] Abrindo o Painel no Navegador...
start http://localhost:5173
timeout /t 2 /nobreak > NUL

echo [3] Iniciando o Backend em modo SIMULACAO (mock)...
start "ESTACAO SOLO - Backend (Simulado)" cmd /k "cd /d "%ROOT_DIR%\backend" && python main.py 1"

echo ==============================================
echo Tudo pronto! Esta janela fechara em 5 segundos.
echo ==============================================

timeout /t 5 /nobreak
exit
