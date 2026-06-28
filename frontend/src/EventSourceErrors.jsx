import { useErrorState } from './ErrorState'
import { useEffect } from 'react'

export default function useErrorSSE(){
    useEffect(() => {
        const eventSource = new EventSource('http://localhost:8000/sse/errors');
        
        eventSource.addEventListener('error', (event) => {
            const errorData = JSON.parse(event.data);
            useErrorState.getState().setError(errorData);
            console.log('Error received via SSE:', errorData);
        });
        
        eventSource.onopen = () => {
            console.log('SSE connection opened');
        };
        
        eventSource.onerror = (e) => {
            console.error('SSE connection error:', e);
        };
        
        return () => {
            eventSource.close();
        };
    }, []);
    return null
}