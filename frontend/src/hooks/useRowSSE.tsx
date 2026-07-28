import useSSE from './useSSE';
import { useRowStore } from '../stores/useRowStore';

const THROTTLE_MS = 100;
let last = 0;

export default function useRowSSE() {
    return useSSE({
        endpoint: '/sse/rows',
        eventType: 'row',
        onData: (data) => { 
            const now = Date.now();
            if (now - last >= THROTTLE_MS){
                useRowStore.getState().adicionar(data);
                last = now;
            }
        }
    });
}