import { useErrorState } from './ErrorState';
import { useEffect } from 'react';

export default function ErroToast() {
    const error = useErrorState((state) => state.error);
    
    useEffect(() => {
        if (error) {
            const timer = setTimeout(() => {
                useErrorState.getState().clearError();
            }, 8000);
            return () => clearTimeout(timer);
        }
    }, [error]);
    
    return error ? (
        <div className="error-toast">
            <div className="error-toast-header">
                <span className="error-toast-title">⚠️ Erro Detectado</span>
                <button className="error-toast-close" onClick={() => useErrorState.getState().clearError()}>✕</button>
            </div>
            <div className="error-toast-message">
                {error.message}
            </div>
        </div>
    ) : null;
}