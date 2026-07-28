import { create } from 'zustand';
import { isInvalidQuaternion, exceedsDeadband } from '../utils/deadband';

const MAX_PONTOS = 50;
const MAX_MAPA_PONTOS = 1000;
const THROTTLE_MAPA = 3;
const THROTTLE_GRAFICO = 60;

let liveTimeout = null;
let lastApprovedQuaternion = null; 

export const useRowStore = create((set) => ({
    atual: null,
    orientacaoFoguete: null,
    posicaoAtual: null,
    posicaoInicial: null,
    historicoAltitude: [],
    historicoPosicao: [],
    historicoMapaPosicao: [],
    historicoQuaternions: [],
    contador: 0,
    isLive: false,
    hasData: false,

    adicionar: (telemetria) => {
        if (liveTimeout) clearTimeout(liveTimeout);
        liveTimeout = setTimeout(() => {
            useRowStore.setState({ isLive: false });
        }, 2000);

        set((state) => {
            const proximoContador = state.contador + 1;
            const atualizaMapa = proximoContador % THROTTLE_MAPA === 0;
            const atualizaGrafico = proximoContador % THROTTLE_GRAFICO === 0;
            const novaPosicao = { latitude: telemetria.latitude, longitude: telemetria.longitude };

            const temGpsValido = telemetria.latitude !== 0 && telemetria.longitude !== 0;
            const posicaoInicial = state.posicaoInicial ??
                (temGpsValido ? novaPosicao : null);

            const ultimaPosicaoMapa = state.historicoMapaPosicao[state.historicoMapaPosicao.length - 1];
            const hasMoved = !ultimaPosicaoMapa ||
                (ultimaPosicaoMapa.latitude !== novaPosicao.latitude &&
                 ultimaPosicaoMapa.longitude !== novaPosicao.longitude);

            const novoHistoricoMapa = (atualizaMapa && temGpsValido && hasMoved)
                ? [...state.historicoMapaPosicao, novaPosicao].slice(-MAX_MAPA_PONTOS)
                : state.historicoMapaPosicao;

            const calcularOrientacao = () => {
                const { qx, qy, qz, qw } = telemetria || {};
                
                if (isInvalidQuaternion(qx, qy, qz, qw)) return state.orientacaoFoguete;

                const candidatoQ = { x: qx, y: qy, z: qz, w: qw };
                if (exceedsDeadband(lastApprovedQuaternion, candidatoQ)) {
                    lastApprovedQuaternion = candidatoQ;
                    return candidatoQ; 
                }

                return state.orientacaoFoguete;
            };

            return {
                atual: { ...telemetria, timestamp: new Date().toLocaleTimeString() },
                orientacaoFoguete: calcularOrientacao(),
                contador: proximoContador,
                isLive: true,
                hasData: true,
                posicaoAtual: novaPosicao,
                posicaoInicial,
                historicoMapaPosicao: novoHistoricoMapa,
                historicoAltitude: atualizaGrafico
                    ? [...state.historicoAltitude, { time: Math.round(telemetria.time / 1000), altitude: telemetria.altitude }].slice(-MAX_PONTOS)
                    : state.historicoAltitude,
                historicoPosicao: atualizaGrafico
                    ? [...state.historicoPosicao, novaPosicao].slice(-MAX_PONTOS)
                    : state.historicoPosicao
            };
        });
    }
}));