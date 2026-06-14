# SUPERVISOR — Estação Solo Supernova

Sistema de telemetria em tempo real para acompanhamento de voo do foguete **Jiripoca v4.1**, desenvolvido para o time Supernova da UFJF. Recebe dados via rádio LoRa 915 MHz, processa e exibe em painel web com gráfico de altitude, modelo 3D orientado por quaternions e rastreamento GPS.

---

## Visão Geral da Arquitetura

```
foguete (LoRa) → porta serial (COM6) → backend Python → WebSocket → frontend React
                                                ↓
                                         CSV de backup
```

O backend roda dois processos em paralelo via threads: o **motor**, que fica lendo a porta serial e processando os pacotes, e o **servidor FastAPI**, que expõe um WebSocket pelo qual o frontend recebe os dados.

O frontend é uma SPA em React com três seções: gráfico de altitude, modelo 3D com orientação via IMU e mapa de rastreamento GPS.

---

## Estrutura do Projeto

```
SUPERVISOR/
├── backend/
│   ├── app/
│   │   ├── app.py          # servidor FastAPI + endpoint WebSocket
│   │   ├── mensageiro.py   # abstração da fonte de dados (porta ou CSV)
│   │   ├── motor.py        # loop principal de leitura e processamento
│   │   ├── Row.py          # dataclass do pacote de telemetria
│   │   ├── schema.py       # formato do struct e cabeçalho CSV
│   │   └── last_row.py     # singleton com o último pacote recebido
│   ├── config/
│   │   ├── config.py       # portas seriais, baudrate, caminhos
│   │   └── __init__.py
│   ├── data/
│   │   ├── FLIGHT2.csv     # dados de voo para simulação
│   │   └── FLIGHT3.csv     # saída gravada pelo sistema
│   ├── testes/
│   │   ├── testes.py       # simulador: lê FLIGHT2.csv e envia via porta virtual
│   │   └── __init__.py
│   └── main.py             # ponto de entrada do backend
├── frontend/
│   ├── public/
│   │   └── rocket.glb      # modelo 3D do foguete
│   ├── src/
│   │   ├── App.jsx
│   │   ├── Telemetria.jsx  # store Zustand com estado global
│   │   ├── WebSocket.jsx   # conexão com o backend
│   │   ├── GraficoBarras.jsx
│   │   ├── GraficoArea.jsx
│   │   ├── FogueteModelo.jsx
│   │   ├── Mapa.jsx
│   │   ├── SeguirFoguete.jsx
│   │   ├── index.css
│   │   └── main.jsx
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
├── .gitignore
├── start.bat               # inicia o sistema lendo de porta serial
└── test.bat                # inicia o sistema lendo direto do CSV
└── README.md               # introduz o projeto e suas funcionalidades
```

---

## Pré-requisitos

- Python 3.10+
- Node.js 18+

---

## Como Rodar

### Primeira vez

**Backend:**
```bash
pip install fastapi uvicorn pyserial
```

**Frontend:**
```bash
cd frontend
npm install
```

### start.bat — modo porta serial

Usado com rádio LoRa real **ou** com porta virtual. O backend lê os dados de COM6.

**Com rádio LoRa:** conecta o rádio em COM6 e roda `start.bat`.

**Com porta virtual:** instala o [com0com](https://com0com.sourceforge.net/) e configura o par COM5 ↔ COM6. O `start.bat` inicia o backend e o simulador em paralelo — o simulador lê o `FLIGHT2.csv`, converte os dados pro formato binário e escreve em COM5, e o backend lê de COM6 como se fosse o foguete real.

```
start.bat
```

### test.bat — modo arquivo

Usado quando não há rádio nem porta virtual disponível. O backend lê o `FLIGHT2.csv` diretamente, sem passar por porta serial nenhuma — o `Mensageiro` faz yield row por row do arquivo como se estivesse recebendo os pacotes em tempo real.

```
test.bat
```

---

## Configuração

Tudo que muda entre ambientes está em `backend/config/config.py`:

```python
write_port_name = 'COM5'   # porta onde o simulador escreve
read_port_name  = 'COM6'   # porta onde o backend lê
```

Se as suas portas forem diferentes, é só alterar esses dois valores.

---

## Formato do Pacote

Os dados chegam como struct binário empacotado com o formato `<IffHHhffffBBBB`. Cada pacote contém:

| Campo | Tipo | Descrição |
|---|---|---|
| time | uint32 | tempo de missão (ms) |
| latitude | float | graus decimais |
| longitude | float | graus decimais |
| altitude | uint16 | metros × 10 |
| apogeu | uint16 | apogeu máximo × 10 |
| vel_vertical | int16 | velocidade vertical × 10 |
| q1–q4 | float | quaternion de orientação |
| accel_int | uint8 | aceleração × 10 (máx 255) |
| status | uint8 | estado do foguete |
| voltage_int | uint8 | tensão × 10 |
| fix | uint8 | fix GPS |

---

## Decisões de Projeto

**Por que duas threads no backend?** O `uvicorn` bloqueia a thread principal. O motor de leitura precisa rodar continuamente em paralelo sem travar o servidor, daí a thread separada com `daemon=True`.

**Por que Zustand no frontend?** O `useState` e `useContext` re-renderizam todos os componentes filhos quando o estado muda. O Zustand permite que cada componente assine só o que precisa — o gráfico só re-renderiza quando a altitude muda, o mapa quando a posição muda, sem acoplamento entre eles.

**Por que quaternions?** A orientação do foguete vem do IMU como quaternion, que representa rotação em 3D sem o problema do gimbal lock que ângulos de Euler têm. O modelo 3D no Three.js aceita quaternion diretamente.

**Por que o simulador é um processo separado?** Porque no modo porta serial o simulador roda num terminal próprio alimentando COM5, enquanto o backend lê de COM6. No modo arquivo o simulador não existe — o `Mensageiro` lê o CSV diretamente. A diferença entre os dois modos é só qual `.bat` você clica.
