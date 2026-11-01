import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';

const ModalDetails = ({
    isOpen,
    toggleModal,
    user,
    idProcess,
    setIdProcess,
    fetchTableDetails // Asumo que esta función devuelve una Promesa con los datos
}) => {
    // 1. Estado para guardar los detalles obtenidos
    const [details, setDetails] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const getData = async () => {
            if (isOpen && idProcess) {
                setIsLoading(true);
                try {
                    // Llamamos a la función y guardamos el resultado
                    const data = await fetchTableDetails({ username: user?.username, _id: idProcess });
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
    }, [isOpen, idProcess, user?.username, fetchTableDetails]);

    const modalContent = (
        <div className="fixed inset-0 flex items-center justify-center p-5 overflow-y-auto z-[99999]">
            <div
                onClick={() => { }}
                className="fixed inset-0 h-full w-full bg-gray-900/50 backdrop-blur-sm transition-opacity"
            ></div>

            <div className="no-scrollbar relative w-full max-w-[700px] max-h-[90vh] overflow-y-auto rounded-3xl bg-white p-4 dark:bg-gray-900 lg:p-11 shadow-2xl z-[100000]">
                <div className="px-2 pr-14 text-left">
                    <h4 className="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90">
                        Detalles del proceso
                    </h4>
                    <p className="mb-6 text-sm text-gray-500 dark:text-gray-400 lg:mb-7">
                        {isLoading ? "Cargando..." : `Se encontraron ${details.length} registros`}
                    </p>
                </div>

                <div className="col-span-12">
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
                                        {/* Encabezado */}
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

                                        {/* Credenciales: Apple ID y Contraseña */}
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

                                        {/* Respuesta del Servidor (Caja expandible) */}
                                        <div className="mt-4">
                                            <p className="mb-1 text-[11px] font-semibold uppercase text-gray-500">Respuesta del Sistema</p>
                                            <div className={`rounded-xl p-4 ${item.response?.includes('WRONG')
                                                ? 'bg-red-50 border border-red-100 text-red-700 dark:bg-red-900/10 dark:border-red-900/30 dark:text-red-400'
                                                : 'bg-gray-50 border border-gray-100 text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-300'
                                                }`}>
                                                <p className="whitespace-pre-wrap break-words text-sm leading-relaxed italic">
                                                    {item.response || 'Sin respuesta detallada'}
                                                </p>
                                            </div>
                                        </div>

                                        {/* Códigos (Solo se muestra si existen) */}
                                        {item.codesUnlock && (
                                            <div className="mt-4 border-t border-gray-100 pt-4 dark:border-gray-800">
                                                <p className="text-[11px] font-semibold uppercase text-gray-500">Códigos de Desbloqueo</p>
                                                <p className="mt-1 text-sm font-mono font-bold tracking-wider dark:text-gray-200">
                                                    {item.codesUnlock}
                                                </p>
                                            </div>
                                        )}
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

                <div className="flex items-center gap-3 px-2 mt-6 lg:justify-end">
                    <button
                        onClick={() => {
                            toggleModal(false);
                            setIdProcess("");
                            setDetails([]); // Limpiamos al cerrar                            
                        }}
                        type="button"
                        className="flex w-full justify-center rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] sm:w-auto transition-colors"
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