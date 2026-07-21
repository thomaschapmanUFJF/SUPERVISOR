import { useEffect } from 'react';

type SSEOption = {
    endpoint: string,
    eventType: string,
    onData: (data: any) => void,
}

export default function useSSE(option: SSEOption) {
    useEffect(() => {
        const eventSource = new EventSource('http://localhost:8000' + option.endpoint);

        eventSource.addEventListener(option.eventType, (event) => {
            try {
                const data = JSON.parse(event.data);
                option.onData(data);
            } catch (e) {
                console.warn('Failed to parse SSE error:', e);
            }
        });

        eventSource.onerror = () => {
            console.warn('SSE connection lost, reconnecting...');
        };

        return () => eventSource.close();
    }, []);

    return null;
}
