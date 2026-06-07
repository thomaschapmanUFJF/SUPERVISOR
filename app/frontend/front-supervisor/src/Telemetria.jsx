import { create } from 'zustand'

export const useTelemetria = create((set) => ({
    atual: null,
    posicaoAtual: null,
    historicoAltitude: [],
    historicoPosicao: [],
  adicionar: (telemetria) => set((state) => (
    { 
      atual: telemetria, 
      posicaoAtual: { latitude: telemetria.latitude, longitude: telemetria.longitude },
      historicoAltitude: [...state.historicoAltitude, { time: telemetria.time, altitude: telemetria.altitude }],
      historicoPosicao: [...state.historicoPosicao, { latitude: telemetria.latitude, longitude: telemetria.longitude }],
    }
  )),
}))