@echo off
echo ==============================================
echo               INICIANDO SETUP
echo ==============================================
echo [1] Instalando dependências do React (Vite)...
cmd "cd frontend && npm install"
if %errorlevel% neq 0 (
    echo ERRO: instalacao do npm falhou!
    pause
    exit /b 1
)
echo.
echo [2] Instalando FastAPI
cmd "pip install fastapi uvicorn pyserial"
if %errorlevel% neq 0 (
    echo ERRO: instalacao do fastapi falhou!
    pause
    exit /b 1
)
echo ==============================================
echo               SETUP COMPLETO!
echo ==============================================
timeout /t 5 /nobreak
exit