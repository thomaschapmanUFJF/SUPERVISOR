import { useEffect } from 'react';

type SSEOption = {
    endpoint: string,
    eventType: string,
    onData: (data: any) => void,
}

function getApiBaseUrl() {
    const configured = import.meta.env.VITE_API_URL?.trim();
    if (configured) {
        return configured.replace(/\/+$/, '');
    }

    if (typeof window !== 'undefined') {
        const { protocol, hostname } = window.location;

        if (hostname.endsWith('.app.github.dev')) {
            const match = hostname.match(/^(.*)-(\d+)\.app\.github\.dev$/i);
            if (match) {
                return `${protocol}//${match[1]}-8000.app.github.dev`;
            }
        }

        if (hostname === 'localhost' || hostname === '127.0.0.1') {
            return `${protocol}//${hostname}:8000`;
        }
    }

    return 'http://localhost:8000';
}

export default function useSSE(option: SSEOption) {
    useEffect(() => {
        const apiBaseUrl = getApiBaseUrl();
        const eventSource = new EventSource(`${apiBaseUrl}${option.endpoint}`);

        eventSource.addEventListener(option.eventType, (event) => {
            try {
                const data = JSON.parse(event.data);
                option.onData(data);
            } catch (e) {
                console.warn('Failed to parse SSE error:', e);
            }
        });

        eventSource.onerror = () => {
            console.warn('SSE connection lost, reconnecting...', { apiBaseUrl, endpoint: option.endpoint });
        };

        return () => eventSource.close();
    }, [option.endpoint, option.eventType, option.onData]);

    return null;
}
