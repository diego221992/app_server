import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';

const ModalDetails = ({
    isOpen,
    toggleModal,
    user,
    linkCodeDetail,
    setLinkCodeDetail,
    fetchTableDetails // Asumo que esta función devuelve una Promesa con los datos
}) => {
    // 1. Estado para guardar los detalles obtenidos
    const [details, setDetails] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const getData = async () => {
            if (isOpen && linkCodeDetail) {
                setIsLoading(true);
                try {
                    // Llamamos a la función y guardamos el resultado
                    const data = await fetchTableDetails({ username: user?.username, linkCode: linkCodeDetail });
                    // Si data es un array, lo guardamos. Si es un objeto único, lo envolvemos en []
                    setDetails(Array.isArray(data) ? data : [data]);
                } catch (error) {
                    console.error("Error al obtener detalles:", error);
                } finally {
                    setIsLoading(false);
                }
            }
        };

        getData();
    }, [isOpen, linkCodeDetail, user?.username, fetchTableDetails]);

    const modalContent = (
        <div className="fixed inset-0 z-[99999] flex items-center justify-center overflow-y-auto p-5 backdrop-blur-sm bg-black/40">
            {/* Contenedor Principal del Modal */}
            <div className="relative w-full max-w-[700px] max-h-[90vh] flex flex-col rounded-3xl bg-white shadow-2xl dark:bg-gray-900 overflow-hidden">

                {/* --- HEADER FIJO AZUL --- */}
                <div className="sticky top-0 z-10 bg-blue-600 p-6 shadow-md lg:px-11">
                    <div className="flex items-center justify-between">
                        <div className="text-left">
                            <h4 className="text-2xl font-bold text-white">
                                Detalles del proceso
                            </h4>
                            <p className="mt-1 text-sm text-blue-100 opacity-90">
                                {isLoading ? "Cargando..." : `Se encontraron ${details.length} registros`}
                            </p>
                        </div>

                        {/* Botón Cerrar Blanco */}
                        <button
                            onClick={() => {
                                toggleModal(false);
                                setLinkCodeDetail("");
                                setDetails([]);
                            }}
                            className="rounded-full p-2 text-white/80 hover:bg-white/20 hover:text-white transition-colors"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                </div>

                {/* --- CUERPO SCROLLABLE --- */}
                <div className="no-scrollbar overflow-y-auto p-6 lg:p-11">
                    <div className="space-y-6">
                        {details.length > 0 ? (
                            details.map((item, index) => (
                                <div
                                    key={item._id || index}
                                    className="relative overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900/50"
                                >
                                    {/* Barra lateral de estado */}
                                    <div className={`absolute left-0 top-0 h-full w-1.5 ${item.response?.includes('WRONG') ? 'bg-red-500' : 'bg-green-500'}`}></div>

                                    <div className="p-5 sm:p-6">
                                        {/* Encabezado del Item */}
                                        <div className="mb-4 flex items-center justify-between">
                                            <h5 className="flex items-center gap-2 text-xs font-bold text-gray-400 uppercase tracking-widest">
                                                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-gray-100 text-[10px] dark:bg-gray-800">
                                                    {index + 1}
                                                </span>
                                                Detalle del Proceso
                                            </h5>
                                            {item?.status === 'passcode_process'
                                                ? (<span className="text-[10px] font-bold text-orange-500 uppercase">Passcode</span>)
                                                : item?.status === 'false'
                                                    ? (<span className="text-[10px] font-bold text-red-500 uppercase">Fallido</span>)
                                                    : item?.status === 'true'
                                                        ? (<span className="text-[10px] font-bold text-green-500 uppercase">Completado</span>)
                                                        : (<span className="text-[10px] font-bold text-green-500 uppercase">En proceso</span>)
                                            }
                                        </div>

                                        {/* Credenciales */}
                                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                            <div className="rounded-xl border border-gray-100 bg-gray-50 p-4 dark:border-gray-800 dark:bg-white/[0.02]">
                                                <p className="mb-1 text-[11px] font-semibold uppercase text-gray-500">Apple ID</p>
                                                <p className="break-all text-sm font-medium text-gray-800 dark:text-white">
                                                    {item.appleID || '---'}
                                                </p>
                                            </div>
                                            <div className="rounded-xl border border-gray-100 bg-gray-50 p-4 dark:border-gray-800 dark:bg-white/[0.02]">
                                                <p className="mb-1 text-[11px] font-semibold uppercase text-gray-500">Contraseña</p>
                                                <p className="break-all font-mono text-xl font-bold text-blue-600 dark:text-blue-400">
                                                    {item.password || '---'}
                                                </p>
                                            </div>
                                        </div>

                                        {/* Respuesta del Sistema */}
                                        <div className="mt-4">
                                            <p className="mb-1 text-[11px] font-semibold uppercase text-gray-500">Respuesta del Sistema</p>
                                            <div className={`rounded-xl p-4 ${item.response
                                                ? 'bg-red-50 border border-red-100 text-red-700 dark:bg-red-900/10 dark:border-red-900/30 dark:text-red-400'
                                                : 'bg-gray-50 border border-gray-100 text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-300'
                                                }`}>
                                                <p className="whitespace-pre-wrap break-words text-sm leading-relaxed italic">
                                                    {item.response || 'Sin respuesta detallada'}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            !isLoading && (
                                <div className="py-20 text-center">
                                    <p className="text-gray-400 dark:text-gray-500">No hay registros para mostrar.</p>
                                </div>
                            )
                        )}
                    </div>
                </div>
            </div>
        </div>
    );

    return (
        <>{isOpen && createPortal(modalContent, document.body)}</>
    );
};

export default ModalDetails;