import { create } from 'zustand';

export const useErrorStore = create((set) => ({
    error: null,
    setError: (newError) => set({ error: newError }),
    clearError: () => set({ error: null })
}));
