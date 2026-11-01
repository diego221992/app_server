import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';

const ModalDetails = ({
    isOpen,
    toggleModal,
    user,
    phoneDetail,
    setPhoneDetail,
    fetchTableDetails
}) => {
    const [details, setDetails] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const getData = async () => {
            if (isOpen && phoneDetail) {
                setIsLoading(true);
                try {
                    const response = await fetchTableDetails({ username: user?.username, phone: phoneDetail });
                    // Accedemos a response.data si tu API devuelve el objeto con la propiedad data
                    const dataList = response?.data || response;
                    setDetails(Array.isArray(dataList) ? dataList : [dataList]);
                } catch (error) {
                    console.error("Error al obtener detalles:", error);
                } finally {
                    setIsLoading(false);
                }
            }
        };
        getData();
    }, [isOpen, phoneDetail, user?.username, fetchTableDetails]);

    const modalContent = (
        <div className="fixed inset-0 flex items-center justify-center p-5 overflow-y-auto z-[99999]">
            <div
                onClick={() => { toggleModal(false); setPhoneDetail(""); }}
                className="fixed inset-0 h-full w-full bg-gray-900/50 backdrop-blur-sm transition-opacity"
            ></div>

            <div className="no-scrollbar relative w-full max-w-[600px] max-h-[90vh] overflow-y-auto rounded-3xl bg-white p-4 dark:bg-gray-900 lg:p-8 shadow-2xl z-[100000]">
                <div className="px-2 pr-14 text-left">
                    <h4 className="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90">
                        Historial del Teléfono
                    </h4>
                    <p className="mb-6 text-sm text-gray-500 dark:text-gray-400">
                        {isLoading ? "Cargando..." : `Registros para: ${phoneDetail}`}
                    </p>
                </div>

                <div className="space-y-4">
                    {details.length > 0 ? (
                        details.map((item, index) => (
                            <div
                                key={item._id || index}
                                className="relative overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900/50"
                            >
                                {/* Indicador visual basado en el texto de details */}
                                <div className={`absolute left-0 top-0 h-full w-1.5 ${item.details?.includes('Correct') ? 'bg-green-500' : 'bg-red-500'}`}></div>

                                <div className="p-5">
                                    <div className="flex justify-between items-start mb-3">
                                        <div>
                                            <p className="text-[10px] font-bold uppercase text-gray-400 tracking-tight">Fecha del registro</p>
                                            <p className="text-xs text-gray-600 dark:text-gray-400">
                                                {new Date(item.createdAt).toLocaleString()}
                                            </p>
                                        </div>
                                        <span className={`text-[10px] font-bold px-2 py-1 rounded-md ${item.details?.includes('Correct') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                            {item.details?.includes('Correct') ? 'EXITOSO' : 'ERROR'}
                                        </span>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="rounded-xl bg-gray-50 p-3 dark:bg-white/[0.03]">
                                            <p className="mb-1 text-[10px] font-semibold uppercase text-gray-500">Código</p>
                                            <p className="text-lg font-mono font-bold text-blue-600 dark:text-blue-400">
                                                {item.codeUnlock || '---'}
                                            </p>
                                        </div>
                                        <div className="rounded-xl bg-gray-50 p-3 dark:bg-white/[0.03]">
                                            <p className="mb-1 text-[10px] font-semibold uppercase text-gray-500">Detalles</p>
                                            <p className="text-sm font-medium text-gray-800 dark:text-white">
                                                {item.details}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        !isLoading && (
                            <div className="py-10 text-center text-gray-400">No hay registros.</div>
                        )
                    )}
                </div>

                <div className="mt-6 flex justify-end">
                    <button
                        onClick={() => { toggleModal(false); setPhoneDetail(""); setDetails([]); }}
                        className="w-full sm:w-auto px-6 py-2.5 rounded-xl border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 transition-colors"
                    >
                        Cerrar
                    </button>
                </div>
            </div>
        </div>
    );

    return (
        <>{isOpen && createPortal(modalContent, document.body)}</>
    );
};

export default ModalDetails;