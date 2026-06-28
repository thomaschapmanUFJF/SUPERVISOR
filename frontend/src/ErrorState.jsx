import { create } from 'zustand'

export const useErrorState = create((set) => ({
    error: null,
    setError: (newError) => set({ error: newError }),
    clearError: () => set({ error: null })
}))