@echo off
echo ==============================================
echo               INICIANDO SETUP
echo ==============================================
echo [1] Instalando dependencias do React...
pushd frontend
npm install
if %errorlevel% neq 0 (
    echo ERRO: instalacao do npm falhou!
    popd
    pause
    exit /b 1
)
popd

echo.
echo [2] Instalando dependencias do Python...
pip install fastapi uvicorn pyserial
if %errorlevel% neq 0 (
    echo ERRO: instalacao do pip falhou!
    pause
    exit /b 1
)

echo ==============================================
echo               SETUP COMPLETO!
echo ==============================================
timeout /t 5 /nobreak
exit