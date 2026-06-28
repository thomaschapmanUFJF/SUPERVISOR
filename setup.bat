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

REM Function to check if a pip package is installed
call :check_pip_package fastapi
if !PACKAGE_INSTALLED! equ 0 (
    echo FastAPI ja esta instalado. Pulando...
) else (
    echo Instalando FastAPI...
    pip install fastapi[standard]
    if %errorlevel% neq 0 (
        echo ERRO: instalacao do fastapi falhou!
        pause
        exit /b 1
    )
)

call :check_pip_package fastapiSSE
if !PACKAGE_INSTALLED! equ 0 (
    echo FastAPI ja esta instalado. Pulando...
) else (
    echo Instalando FastAPI SSE...
    pip install fastapi[standard]
    if %errorlevel% neq 0 (
        echo ERRO: instalacao do fastapi falhou!
        pause
        exit /b 1
    )
)

call :check_pip_package pyserial
if !PACKAGE_INSTALLED! equ 0 (
    echo PySerial ja esta instalado. Pulando...
) else (
    echo Instalando PySerial...
    pip install pyserial
    if %errorlevel% neq 0 (
        echo ERRO: instalacao do pyserial falhou!
        pause
        exit /b 1
    )
)

call :check_pip_package crc
if !PACKAGE_INSTALLED! equ 0 (
    echo CRC ja esta instalado. Pulando...
) else (
    echo Instalando CRC...
    pip install crc
    if %errorlevel% neq 0 (
        echo ERRO: instalacao do crc falhou!
        pause
        exit /b 1
    )
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

if exist "node_modules" (
    rmdir /s /q "node_modules"
)
if exist "package-lock.json" (
    del "package-lock.json"
)

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

REM ==============================================
REM Function to check if pip package is installed
REM ==============================================
:check_pip_package
set PACKAGE_INSTALLED=1
pip show %1 >nul 2>&1
if %errorlevel% equ 0 (
    set PACKAGE_INSTALLED=0
) else (
    set PACKAGE_INSTALLED=1
)
exit /b 0