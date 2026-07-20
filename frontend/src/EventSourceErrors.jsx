import { useErrorState } from './ErrorState'
import { useEffect } from 'react'

export default function useErrorSSE() {
    useEffect(() => {
        // SSE connection to backend errors
        let eventSource;
        try {
            eventSource = new EventSource('http://localhost:8000/sse/errors');

            eventSource.addEventListener('error', (event) => {
                try {
                    const errorData = JSON.parse(event.data);
                    if (errorData?.message) {
                        useErrorState.getState().setError(errorData);
                    }
                } catch (e) {
                    // ignore unparseable SSE messages
                }
            });

            eventSource.onerror = () => {
                // SSE connection dropped - silently ignore, it will reconnect
            };
        } catch(e) {
            // EventSource not available or URL invalid
        }

        // Global frontend error capture
        const handleRuntimeError = (event) => {
            const msg = event?.message;
            // Filter out noisy browser/devtools messages
            if (!msg || msg.includes('ResizeObserver') || msg.includes('Script error')) return;
            useErrorState.getState().setError({ message: msg });
        };

        const handlePromiseRejection = (event) => {
            const reason = event?.reason;
            if (!reason) return;
            const message = reason.message || (typeof reason === 'string' ? reason : null);
            if (!message) return;
            useErrorState.getState().setError({ message });
        };

        window.addEventListener('error', handleRuntimeError);
        window.addEventListener('unhandledrejection', handlePromiseRejection);

        return () => {
            eventSource?.close();
            window.removeEventListener('error', handleRuntimeError);
            window.removeEventListener('unhandledrejection', handlePromiseRejection);
        };
    }, []);
    return null;
}
