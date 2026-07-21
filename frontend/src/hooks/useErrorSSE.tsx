import { useErrorStore } from '../stores/useErrorStore';
import useSSE from './useSSE';

export default function useErrorSSE() {
    return useSSE({
        endpoint: '/sse/errors',
        eventType: 'error',
        onData: (data) => useErrorStore.getState().setError(data)
    });
}