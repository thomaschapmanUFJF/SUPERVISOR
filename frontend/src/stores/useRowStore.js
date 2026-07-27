import { create } from 'zustand';

const LIMIT = 1000;

export const useRowStore = create((set) => ({
    latest: null,
    history: [],
    update: (newRow) => {
        set((state) => {
            return {
                latest: newRow,
                history: [...state.history.slice(-LIMIT), newRow]
            };
        });
    }
}));

