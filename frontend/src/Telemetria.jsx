import { create } from 'zustand'

const MAX_PONTOS = 60
const THROTTLE_PACOTES = 10
export const useTelemetria = create((set) => ({
    atual: null,
    posicaoAtual: null,
    historicoAltitude: [],
    historicoPosicao: [],
    contador: 0,
  adicionar: (telemetria) => set((state) => {
    const proximoContador = state.contador+1
    const atualiza = proximoContador % THROTTLE_PACOTES === 0
    return (
    { 
      atual: telemetria, 
      contador: proximoContador,
      posicaoAtual: { latitude: telemetria.latitude, longitude: telemetria.longitude },
      historicoAltitude: atualiza ? 
      [...state.historicoAltitude, { time: telemetria.time, altitude: telemetria.altitude }].splice(-MAX_PONTOS)
      : state.historicoAltitude,
      historicoPosicao: atualiza ? 
      [...state.historicoPosicao, { latitude: telemetria.latitude, longitude: telemetria.longitude }].splice(-MAX_PONTOS)
      : state.historicoPosicao
    }
  )}
),

}))