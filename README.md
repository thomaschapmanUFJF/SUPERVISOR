# SUPERVISOR — Estação Solo Supernova

Sistema de telemetria em tempo real para acompanhamento de voo do foguete **Jiripoca v4.1**, desenvolvido para o time Supernova da UFJF. Recebe dados via rádio LoRa 915 MHz, processa e exibe em painel web com gráfico de altitude, modelo 3D orientado por quaternions e rastreamento GPS.

---

## Visão Geral da Arquitetura

```
foguete (LoRa) → porta serial (COM6) → backend Python → SSE → frontend React
                                                ↓
                                         CSV de backup
```

O backend roda dois processos em paralelo via threads: o **motor**, que fica lendo a porta serial (ou arquivo mock) e processando os pacotes, e o **servidor FastAPI**, que expõe eventos via **Server-Sent Events (SSE)**.

O frontend é uma SPA em React / TypeScript com visualização em tempo real: gráfico de altitude, modelo 3D com orientação via IMU e mapa de rastreamento GPS.

---

## Estrutura do Projeto

```
SUPERVISOR/
├── backend/
│   ├── app/
│   │   ├── server.py              # Servidor FastAPI + endpoints SSE (/sse/rows, /sse/errors)
│   │   ├── data_reader.py         # Leitura da fonte de dados (Serial ou Mock CSV)
│   │   ├── ingest_data.py         # Loop principal de recepção e gravação CSV
│   │   └── state.py               # Armazenamento e formatação de eventos SSE
│   ├── config/
│   │   ├── config.py              # Carregador de configurações
│   │   └── config.json            # Baudrate, portas seriais, colunas CSV
│   ├── data/
│   │   ├── FLIGHT2.csv            # Dados de voo para simulação
│   │   └── FLIGHT3.csv            # Arquivo de saída gravado em tempo real
│   ├── mocks/
│   │   └── telemetry_simulator.py # Gerador de telemetria simulada
│   └── main.py                    # Ponto de entrada do backend
├── frontend/
│   ├── public/
│   │   └── rocket.glb             # Modelo 3D do foguete
│   ├── src/
│   │   ├── components/            # AreaChart, DebugPanel, FlightMap, MetricCard, RocketModel
│   │   ├── hooks/                 # Hooks customizados para SSE (useRowSSE, useErrorSSE, useErrorToast)
│   │   ├── stores/                # Zustand stores (useRowStore, useErrorStore)
│   │   ├── styles/                # Estilos CSS modulares
│   │   ├── App.tsx
│   │   ├── MainScreen.tsx
│   │   └── main.tsx
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
├── docs/
│   └── presentation.html          # Apresentação interativa do projeto
├── scripts/
│   ├── setup.bat                  # Instalação automatizada de dependências (Windows)
│   ├── setup.sh                   # Instalação automatizada de dependências (Linux/Bash)
│   ├── start-serial.bat           # Execução em modo Hardware Serial (Windows)
│   ├── start-simulation.bat       # Execução em modo Simulação CSV (Windows)
│   └── start-simulation.sh        # Execução em modo Simulação CSV (Linux/Bash)
├── setup.bat                      # Wrapper de conveniência para scripts/setup.bat
├── setup.sh                       # Wrapper de conveniência para scripts/setup.sh
├── start.bat                      # Wrapper para inicialização em modo Serial
├── start-simulation.bat           # Wrapper para inicialização em modo Simulação CSV
├── start-simulation.sh            # Wrapper Linux para modo Simulação CSV
└── README.md
```

---

## Pré-requisitos

- Python 3.10+
- Node.js 18+

---

## Como Rodar

### Instalação (Setup Automático)

No Windows:
```cmd
setup.bat
```

No Linux / Bash:
```bash
./setup.sh
```

---

### Execução

#### Modo Simulação (Sem hardware real)
Lê os dados de voo simulados a partir do arquivo CSV:

- **Windows:** `start-simulation.bat`
- **Linux / Bash:** `./start-simulation.sh`

#### Modo Hardware Serial (Transmissão via rádio LoRa / COM)
Lê os dados diretamente da porta serial conectada ao receptor:

- **Windows:** `start.bat`
