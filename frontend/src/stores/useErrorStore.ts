import { create } from 'zustand';

export interface AppError {
    message: string;
    [key: string]: any;
}

export interface ErrorState {
    error: AppError | null;
    setError: (newError: AppError | null) => void;
    clearError: () => void;
}

export const useErrorStore = create<ErrorState>((set) => ({
    error: null,
    setError: (newError) => set({ error: newError }),
    clearError: () => set({ error: null })
}));

