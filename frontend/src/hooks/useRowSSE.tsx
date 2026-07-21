import useSSE from './useSSE';
import { useRowStore } from '../stores/useRowStore';

export default function useRowSSE() {
    return useSSE({
        endpoint: '/sse/rows',
        eventType: 'row',
        onData: (data) => { useRowStore.getState().adicionar(data); }
    });
}