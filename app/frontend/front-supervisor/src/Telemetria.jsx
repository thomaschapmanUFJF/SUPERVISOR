import { create } from 'zustand'

export const useTelemetria = create((set) => ({
    atual: null,
    historicoAltitude: [],
  adicionar: (telemetria) => set((state) => (
    { 
      atual: telemetria, 
      historicoAltitude: [...state.historicoAltitude, telemetria]
    }
  )),
}))