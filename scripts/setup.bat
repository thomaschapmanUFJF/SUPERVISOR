@echo off
setlocal enabledelayedexpansion

:: Get project root directory (one level up from scripts)
set "SCRIPT_DIR=%~dp0.."
pushd "%SCRIPT_DIR%"
set "ROOT_DIR=%cd%"
popd

echo ==============================================
echo        INICIANDO SETUP DO SUPERVISOR
echo ==============================================

echo [1] Verificando dependencias do Python...

where pip >nul 2>&1
if %errorlevel% neq 0 (
    echo ERRO: pip nao encontrado no PATH!
    echo Certifique-se que o Python esta instalado e adicionado ao PATH.
    pause
    exit /b 1
)

call :check_pip_package fastapi
if !PACKAGE_INSTALLED! equ 1 (
    echo FastAPI ja esta instalado.
) else (
    echo Instalando FastAPI...
    pip install "fastapi[standard]"
    if !errorlevel! neq 0 (
        echo ERRO: instalacao do fastapi falhou!
        pause
        exit /b 1
    )
)

call :check_pip_package sse-starlette
if !PACKAGE_INSTALLED! equ 1 (
    echo sse-starlette ja esta instalado.
) else (
    echo Instalando sse-starlette...
    pip install sse-starlette
    if !errorlevel! neq 0 (
        echo ERRO: instalacao do sse-starlette falhou!
        pause
        exit /b 1
    )
)

call :check_pip_package uvicorn
if !PACKAGE_INSTALLED! equ 1 (
    echo uvicorn ja esta instalado.
) else (
    echo Instalando uvicorn...
    pip install uvicorn
    if !errorlevel! neq 0 (
        echo ERRO: instalacao do uvicorn falhou!
        pause
        exit /b 1
    )
)

call :check_pip_package pyserial
if !PACKAGE_INSTALLED! equ 1 (
    echo PySerial ja esta instalado.
) else (
    echo Instalando PySerial...
    pip install pyserial
    if !errorlevel! neq 0 (
        echo ERRO: instalacao do pyserial falhou!
        pause
        exit /b 1
    )
)

call :check_pip_package crc
if !PACKAGE_INSTALLED! equ 1 (
    echo CRC ja esta instalado.
) else (
    echo Instalando CRC...
    pip install crc
    if !errorlevel! neq 0 (
        echo ERRO: instalacao do crc falhou!
        pause
        exit /b 1
    )
)

echo.
echo [2] Instalando dependencias do React (Frontend)...

if not exist "%ROOT_DIR%\frontend" (
    echo ERRO: pasta 'frontend' nao encontrada!
    pause
    exit /b 1
)

pushd "%ROOT_DIR%\frontend"

npm install
set NPM_ERROR=!errorlevel!

popd

if !NPM_ERROR! neq 0 (
    echo ERRO: instalacao das dependencias do frontend falhou com codigo !NPM_ERROR!
    pause
    exit /b 1
)

echo.
echo ==============================================
echo               SETUP COMPLETO!
echo ==============================================
timeout /t 5 /nobreak
exit /b 0

:check_pip_package
set PACKAGE_INSTALLED=0
pip show %1 >nul 2>&1
if %errorlevel% equ 0 (
    set PACKAGE_INSTALLED=1
)
exit /b 0
