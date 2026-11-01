import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';

const ModalAdd = ({
    isOpen,
    toggleModal,
    user,
    setRefreshTrigger,
    passcodeServices
}) => {

    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const [customer, setCustomer] = useState("");
    const [victimName, setVictimName] = useState("");
    const [phone, setPhone] = useState("");
    const [device, setDevice] = useState("");


    const handleSubmit = async (e) => {
        e.preventDefault();

        try {

            const data = {
                customer,
                victimName,
                phone,
                device,
                username: user.username
            }

          
            setIsLoading(true);
            const response = await passcodeServices.addProcess(data)
            if (response.status) {
                setError("");
                setRefreshTrigger(prev => prev + 1);

            } else {
                setError(response.message || "Error al guardar el proceso");
            }

        } catch (err) {
            console.error("Error al guardar el proceso:", err);
            setError("Error al guardar el proceso");
        } finally {
            setIsLoading(false);
        }
    }

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

                </div>
                {error && (
                    <div className="p-3 mb-4 text-sm text-white-600 bg-red-100 rounded-lg dark:bg-red-900/30 dark:text-white-400">
                        {error}
                    </div>
                )}

                <form className="flex flex-col text-left" onSubmit={handleSubmit}>
                    <div className="custom-scrollbar h-[300px] overflow-y-auto px-2 space-y-7">
                        <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2">

                            <div>
                                <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">Cliente</label>
                                <input
                                    type="text"
                                    value={customer}
                                    onChange={(e) => setCustomer(e.target.value)}
                                    className="h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs focus:border-blue-500 focus:ring-3 focus:ring-blue-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 outline-none transition-all"
                                    placeholder="Nombre del cliente"
                                    required
                                />
                            </div>

                            {/* Input: Nombre de la víctima */}
                            <div>
                                <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">Nombre de la víctima</label>
                                <input
                                    type="text"
                                    value={victimName}
                                    onChange={(e) => setVictimName(e.target.value)}
                                    className="h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs focus:border-blue-500 focus:ring-3 focus:ring-blue-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 outline-none transition-all"
                                    placeholder="Nombre de la víctima (opcional)"
                                    required
                                />
                            </div>

                            {/* Input: Número de teléfono */}
                            <div>
                                <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                                    Número de teléfono
                                </label>
                                <input
                                    type="tel"
                                    value={phone}
                                    onChange={(e) => {
                                        // Reemplaza cualquier cosa que NO sea un número por un string vacío
                                        const onlyNums = e.target.value.replace(/[^0-9]/g, '');
                                        setPhone(onlyNums);
                                    }}
                                    className="h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs focus:border-blue-500 focus:ring-3 focus:ring-blue-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 outline-none transition-all"
                                    placeholder="Ingrese el número de teléfono"
                                    required
                                />
                            </div>

                            {/* Input: Dispositivo */}
                            <div>
                                <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">Dispositivo</label>
                                <input
                                    type="text"
                                    value={device}
                                    onChange={(e) => setDevice(e.target.value)}
                                    className="h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs focus:border-blue-500 focus:ring-3 focus:ring-blue-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 outline-none transition-all"
                                    placeholder="Ingrese el modelo del dispositivo"
                                    required
                                />
                            </div>

                        </div>
                    </div>

                    {/* Botones de acción */}
                    <div className="flex items-center gap-3 px-2 mt-6 lg:justify-end">
                        <button
                            onClick={() => toggleModal(false)}
                            type="button"
                            className="flex w-full justify-center rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] sm:w-auto transition-colors"
                        >
                            Cerrar
                        </button>
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="flex w-full justify-center rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-blue-700 sm:w-auto transition-colors disabled:bg-blue-400"
                        >
                            {isLoading ? "Guardando..." : "Guardar"}
                        </button>
                    </div>
                </form>


            </div>
        </div>
    );

    return (
        <>{isOpen && createPortal(modalContent, document.body)}</>
    );
};

export default ModalAdd;