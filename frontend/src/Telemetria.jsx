import { create } from 'zustand'

const MAX_PONTOS = 60
const MAX_MAPA_PONTOS = 1000
const THROTTLE_PACOTES = 10

let liveTimeout = null;

export const useTelemetria = create((set) => ({
    atual: null,
    posicaoAtual: null,
    historicoAltitude: [],
    historicoPosicao: [],
    historicoMapaPosicao: [],
    contador: 0,
    isLive: false,
    hasData: false,
    adicionar: (telemetria) => {
        if (liveTimeout) clearTimeout(liveTimeout);
        liveTimeout = setTimeout(() => {
            useTelemetria.setState({ isLive: false });
        }, 2000);

        set((state) => {
            const proximoContador = state.contador + 1;
            const atualiza = proximoContador % THROTTLE_PACOTES === 0;
            const novaPosicao = { latitude: telemetria.latitude, longitude: telemetria.longitude };
            
            // Only add to map history if the position actually changed
            const ultimaPosicaoMapa = state.historicoMapaPosicao[state.historicoMapaPosicao.length - 1];
            const hasMoved = !ultimaPosicaoMapa || 
                             ultimaPosicaoMapa.latitude !== novaPosicao.latitude || 
                             ultimaPosicaoMapa.longitude !== novaPosicao.longitude;
            
            const novoHistoricoMapa = hasMoved 
                ? [...state.historicoMapaPosicao, novaPosicao].slice(-MAX_MAPA_PONTOS)
                : state.historicoMapaPosicao;

            return { 
                atual: { ...telemetria, timestamp: new Date().toLocaleTimeString() }, 
                contador: proximoContador,
                isLive: true,
                hasData: true,
                posicaoAtual: novaPosicao,
                historicoMapaPosicao: novoHistoricoMapa,
                historicoAltitude: atualiza ? 
                [...state.historicoAltitude, { time: telemetria.time, altitude: telemetria.altitude }].slice(-MAX_PONTOS)
                : state.historicoAltitude,
                historicoPosicao: atualiza ? 
                [...state.historicoPosicao, novaPosicao].slice(-MAX_PONTOS)
                : state.historicoPosicao
            };
        });
    }
}));

