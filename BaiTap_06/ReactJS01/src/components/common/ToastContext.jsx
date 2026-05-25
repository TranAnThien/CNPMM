import { createContext, useContext, useState, useCallback } from 'react';

const ToastContext = createContext({ showToast: (msg, opts) => {} });
export const useToast = () => useContext(ToastContext);

export const ToastProvider = ({ children }) => {
    const [toasts, setToasts] = useState([]);

    const showToast = useCallback((message, { type = 'success', duration = 2500 } = {}) => {
        const id = Date.now() + Math.random();
        setToasts((t) => [...t, { id, message, type }]);
        setTimeout(() => {
            setToasts((t) => t.filter((x) => x.id !== id));
        }, duration);
    }, []);

    return (
        <ToastContext.Provider value={{ showToast }}>
            {children}
            {/* Top-right outlined toasts */}
            <div className="fixed top-4 right-4 z-50 flex flex-col gap-3">
                {toasts.map((t) => (
                    <div
                        key={t.id}
                        className={`max-w-sm rounded-md px-4 py-2 text-sm font-medium shadow-lg bg-white text-gray-800 flex items-center gap-3 border-l-4 ${
                            t.type === 'success' ? 'border-l-emerald-500' : 'border-l-rose-500'
                        }`}
                    >
                        <div className={`font-semibold ${t.type === 'success' ? 'text-emerald-700' : 'text-rose-700'}`}>{t.type === 'success' ? '✓' : '!'}</div>
                        <div className="flex-1">{t.message}</div>
                    </div>
                ))}
            </div>
        </ToastContext.Provider>
    );
};

export default ToastContext;

