import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { validate } from '../../../utils/validationHelper'

const ModalAdd = ({
    isOpen,
    toggleModal,
    user,
    setRefreshTrigger,
    domainsServices
}) => {

    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [domainError, setDomainError] = useState(null);
    const [domainName, setDomainName] = useState("");


    const handleSubmit = async (e) => {
        e.preventDefault();

        const error = validate.domain(domainName);
        if (error) {
            setDomainError(error);
            return; // Detiene el envío si hay error
        }

        try {

            const data = {
                domain : domainName,
                username: user.username
            }

            

            setIsLoading(true);
            const response = await domainsServices.addDomain(data)
            if (response.status) {
                setError("");
                setRefreshTrigger(prev => prev + 1);

            } else {
                setError(response.message || "Error al guardar el dominio");
            }

        } catch (err) {
            console.error("Error al guardar el dominio:", err);
            setError("Error al guardar el dominio");
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
                    <div className="custom-scrollbar h-[100px] overflow-y-auto px-2 space-y-7">
                        <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-1">

                            <div>
                                <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">Nombre del dominio</label>
                                <input
                                    type="text"
                                    value={domainName}
                                    onChange={(e) => {
                                        const val = e.target.value;
                                        setDomainName(val);
                                        // Usamos tu helper: si es válido devuelve null, si no, devuelve el mensaje
                                        const error = validate.domain(val);
                                        setDomainError(error);

                                    }}
                                    className={`h-11 w-full rounded-lg border bg-transparent px-4 py-2.5 text-sm shadow-theme-xs outline-none transition-all 
                                                ${domainError
                                            ? "border-red-500 focus:border-red-500 focus:ring-red-500/10 dark:border-red-500"
                                            : "border-gray-300 focus:border-blue-500 focus:ring-blue-500/10 dark:border-gray-700"
                                        } 
                                                text-gray-800 dark:bg-gray-900 dark:text-white/90`}
                                    placeholder="midominio.com"
                                    required
                                />
                                {domainError && (
                                    <p className="text-xs text-red-500 mt-1">{domainError}</p>
                                )}
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