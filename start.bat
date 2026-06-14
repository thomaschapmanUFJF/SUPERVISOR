@echo off
echo ==============================================
echo   INICIANDO SISTEMA SUPERVISORIO SUPERNOVA
echo ==============================================
echo [1] Iniciando o Servidor de Desenvolvimento do React (Vite)...
:: Entra na pasta do frontend para rodar o comando do npm
start "FRONTEND - React" cmd /c "cd frontend && npm run dev"
timeout /t 3 /nobreak > NUL
echo [2] Abrindo o Painel no Navegador...
:: O Vite por padrao usa a porta 5173. 
:: Se o seu abrir em outra (ex: 3000), altere o numero abaixo.
start http://localhost:5173

timeout /t 3 /nobreak > NUL
echo [3] Iniciando o Backend e Motor de Leitura (main.py)...
:: O main.py e o "cerebro" que liga o motor e o servidor web ao mesmo tempo
start "ESTACAO SOLO - Backend" cmd /k "cd backend && python main.py 0"

timeout /t 2 /nobreak > NUL

echo [4] Iniciando o Foguete Simulado (testes.py)...
:: Rodando como modulo para garantir que os imports da pasta config funcionem
start "SIMULADOR - Foguete" cmd /k "cd backend && python -m testes.testes"

echo ==============================================
echo Tudo pronto! Esta janela fechara em 5 segundos.
echo ==============================================

timeout /t 5 /nobreak
exit