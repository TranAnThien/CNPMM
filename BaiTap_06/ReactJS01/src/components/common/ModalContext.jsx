import { createContext, useContext, useState } from 'react';

const ModalContext = createContext({
    showConfirm: async (message) => false,
    showAlert: async (message) => {}
});

export const useModal = () => useContext(ModalContext);

export const ModalProvider = ({ children }) => {
    const [modalState, setModalState] = useState({ open: false });

    const showConfirm = (message, { okText = 'OK', cancelText = 'Hủy' } = {}) => {
        return new Promise((resolve) => {
            setModalState({
                open: true,
                type: 'confirm',
                message,
                okText,
                cancelText,
                resolve
            });
        });
    };

    const showAlert = (message, { okText = 'OK' } = {}) => {
        return new Promise((resolve) => {
            setModalState({
                open: true,
                type: 'alert',
                message,
                okText,
                resolve
            });
        });
    };

    const handleClose = (result) => {
        if (modalState.resolve) modalState.resolve(result);
        setModalState({ open: false });
    };

    return (
        <ModalContext.Provider value={{ showConfirm, showAlert }}>
            {children}

            {modalState.open && (
                <div className="fixed inset-0 z-50 flex items-center justify-center">
                    <div className="absolute inset-0 bg-black/40" onClick={() => handleClose(false)} />
                    <div className="relative z-10 w-full max-w-md rounded-lg bg-white p-6 shadow-lg">
                        <div className="mb-4 text-gray-800">{modalState.message}</div>
                        <div className="flex justify-end gap-3">
                            {modalState.type === 'confirm' && (
                                <button
                                    className="rounded-md px-4 py-2 text-sm font-medium bg-gray-100 hover:bg-gray-200"
                                    onClick={() => handleClose(false)}
                                >
                                    {modalState.cancelText}
                                </button>
                            )}
                            <button
                                className="rounded-md px-4 py-2 text-sm font-medium bg-blue-600 text-white hover:bg-blue-700"
                                onClick={() => handleClose(modalState.type === 'confirm' ? true : undefined)}
                            >
                                {modalState.okText || 'OK'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </ModalContext.Provider>
    );
};

export default ModalContext;

