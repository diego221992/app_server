import React, { useEffect } from 'react';

const AlertToast = ({ message, type = 'success', onClose, duration = 5000 }) => {
    
    useEffect(() => {
        const timer = setTimeout(() => {
            onClose();
        }, duration);
        return () => clearTimeout(timer);
    }, [onClose, duration]);

    // Colores ajustados para mayor legibilidad (Texto más oscuro/brillante)
    const types = {
        success: "bg-white border-emerald-500 text-emerald-900 shadow-emerald-200/50 dark:bg-gray-900 dark:text-emerald-400 dark:border-emerald-500/50",
        error: "bg-white border-red-500 text-red-900 shadow-red-200/50 dark:bg-gray-900 dark:text-red-400 dark:border-red-500/50",
        info: "bg-white border-blue-500 text-blue-900 shadow-blue-200/50 dark:bg-gray-900 dark:text-blue-400 dark:border-blue-500/50"
    };

    const icons = {
        success: (
            <svg className="w-6 h-6 text-emerald-600 dark:text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
            </svg>
        ),
        error: (
            <svg className="w-6 h-6 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
        )
    };

    return (
        <div className="fixed top-5 right-5 left-5 md:left-auto md:w-96 z-[120000] transition-all duration-300 ease-in-out">
            <div className={`flex items-center p-4 rounded-2xl border-2 shadow-2xl ${types[type]}`}>
                <div className="flex-shrink-0 bg-white dark:bg-transparent rounded-full p-1">
                    {icons[type] || icons.success}
                </div>
                
                {/* Texto con mayor peso y tamaño */}
                <div className="ml-3 mr-6 text-[15px] font-bold leading-tight">
                    {message}
                </div>

                <button
                    onClick={onClose}
                    className="ml-auto bg-gray-100 dark:bg-gray-800 p-1.5 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                >
                    <svg className="w-4 h-4 text-gray-500 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            </div>
        </div>
    );
};

export default AlertToast;