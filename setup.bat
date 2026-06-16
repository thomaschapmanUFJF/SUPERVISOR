@echo off
setlocal enabledelayedexpansion

echo ==============================================
echo               INICIANDO SETUP
echo ==============================================

echo [1] Instalando dependencias do Python...

REM Check if pip exists
where pip >nul 2>&1
if %errorlevel% neq 0 (
    echo ERRO: pip nao encontrado no PATH!
    echo Certifique-se que o Python esta instalado e adicionado ao PATH
    pause
    exit /b 1
)

REM Install Python packages
pip install fastapi[standard]
if %errorlevel% neq 0 (
    echo ERRO: instalacao do pip falhou!
    pause
    exit /b 1
)

REM Install Pyserial
pip install pyserial

if %errorlevel% neq 0 (
    echo ERRO: instalacao do pyserial
    pause
    exit /b 1
)

echo.

echo [2] Instalando dependencias do React...

REM Check if frontend folder exists
if not exist "frontend" (
    echo ERRO: pasta 'frontend' nao encontrada!
    pause
    exit /b 1
)

REM Push to frontend and install
pushd frontend
echo Diretorio atual: %cd%

npm install
set NPM_ERROR=!errorlevel!

popd

REM Check if npm install failed
if !NPM_ERROR! neq 0 (
    echo ERRO: instalacao do npm falhou com codigo !NPM_ERROR!
    pause
    exit /b 1
)

echo.
echo ==============================================
echo               SETUP COMPLETO!
echo ==============================================
timeout /t 5 /nobreak

REM CRITICAL: Use exit /b to return to parent script without closing CMD
exit /b 0