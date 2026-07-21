import { useEffect } from 'react';
import { useErrorStore } from '../stores/useErrorStore';
import { toast } from 'react-toastify';

export default function useErrorToast() {
    const error = useErrorStore((state) => state.error);
    const clearError = useErrorStore((state) => state.clearError);

    useEffect(() => {
        if (!error) return;

        toast.error(error.message, {
            toastId: 'error-toast',
            onClose: clearError,
            className: 'error-toast',
        });
    }, [error, clearError]);

    return null;
}
