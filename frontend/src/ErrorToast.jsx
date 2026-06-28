import { useErrorState } from './ErrorState';
import { useEffect } from 'react';

export default function ErroToast() {
    const error = useErrorState((state) => state.error);
    
    useEffect(() => {
        if (error) {
            console.error('Error:', error.message);
        }
    }, [error]);
    
    return error ? (
        <div className="error-toast">
            ⚠️ {erro.message}
            <button onClick={() => useErrorState.getState().clearError()}>✕</button>
        </div>
    ) : null;
}