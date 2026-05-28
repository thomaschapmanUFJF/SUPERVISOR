@echo off
echo ==============================================
echo   INICIANDO SISTEMA SUPERVISORIO SUPERNOVA
echo ==============================================

echo [1] Iniciando o Foguete Simulado (testes.py)...
:: O '/k' diz para o terminal ficar aberto mesmo se der erro, pra você ver o que aconteceu.
start cmd /k "python -m testes.testes.py"

:: Aguarda 2 segundinhos para dar tempo da porta virtual abrir
timeout /t 2 /nobreak > NUL

echo [2] Iniciando o Backend da Estacao Solo (main.py)...
start cmd /k "python main.py"

echo [3] Abrindo o Painel Front-end no Navegador...
:: Se você estiver usando um arquivo HTML puro na mesma pasta:
start index.html

:: (Se você fosse usar um servidor web rodando no localhost:8000, seria assim:)
:: start http://localhost:8000

echo ==============================================
echo Tudo rodando! Pode fechar esta janela preta.