@echo off
echo ==============================================
echo   INICIANDO SISTEMA SUPERVISORIO SUPERNOVA
echo ==============================================
echo [1] Iniciando o Servidor de Desenvolvimento do React (Vite)...
:: Entra na pasta do frontend para rodar o comando do npm
start "FRONTEND - React" cmd /k "cd frontend && npm run dev"
timeout /t 2 /nobreak

echo [2] Abrindo o Painel no Navegador...
:: O Vite por padrao usa a porta 5173. 
:: Se o seu abrir em outra (ex: 3000), altere o numero abaixo.
start http://localhost:5173
timeout /t 3 /nobreak
echo [2] Iniciando o Backend e Motor de Leitura (main.py)...
:: O main.py e o "cerebro" que liga o motor e o servidor web ao mesmo tempo
start "ESTACAO SOLO - Backend" cmd /k "cd backend && python main.py 1"

echo ==============================================
echo Tudo pronto! Esta janela fechara em 5 segundos.
echo ==============================================

timeout /t 5 /nobreak
exit