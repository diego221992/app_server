import React, { useState } from 'react';
import { createPortal } from 'react-dom';

const ModalAutoremove = ({
    isOpen,
    setIsOpen,
    toggleModal,
    user,
    setRefreshTrigger,
    autoremoveServices
}) => {
    const [isLoading, setIsLoading] = useState(false);
    const [appleID, setAppleID] = useState("");
    const [password, setPassword] = useState("");
    const [responseAutoremove, setResponseAutoremove] = useState(null);

    const resetStates = () => {
        setIsLoading(false);
        setAppleID("");
        setPassword("");
        setResponseAutoremove(null);
    }

    const handleAutoremove = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        console.log("Ejecutando autoremove...");
        try {

            const response = await autoremoveServices.autoremove({
                appleID,
                password,
                username: user ? user.username : "unknown"
            })
             
            console.log(response)

            setIsLoading(false);
            setResponseAutoremove(response.message);
            setRefreshTrigger(prev => prev + 1);

        } catch (error) {
            console.error("Error al ejecutar autoremove:", error);
            setIsLoading(false);
        }


    }
    // Contenido del Modal que será teletransportado al final del <body>
    const modalContent = (
        <div className="fixed inset-0 flex items-center justify-center p-5 overflow-y-auto z-[99999]">
            {/* Backdrop (Fondo oscuro/desenfocado) */}
            <div
                onClick={() => {
                    toggleModal(false)
                    resetStates();
                }}
                className="fixed inset-0 h-full w-full bg-gray-900/50 backdrop-blur-sm transition-opacity"
            ></div>

            {/* Contenido del Modal */}
            <div className="no-scrollbar relative w-full max-w-[700px] max-h-[90vh] overflow-y-auto rounded-3xl bg-white p-4 dark:bg-gray-900 lg:p-11 shadow-2xl z-[100000]">
                {/* Botón Cerrar */}

                <div className="px-2 pr-14 text-left">
                    <h4 className="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90">
                        Ingrese su Apple ID y contraseña
                    </h4>
                    <p className="mb-6 text-sm text-gray-500 dark:text-gray-400 lg:mb-7">
                        Por favor ingrese su Apple ID y contraseña para proceder con el autoremove, esto es necesario para remover los equipos de la cuenta iCloud.
                    </p>
                </div>

                <form className="flex flex-col text-left" onSubmit={handleAutoremove}>
                    <div className="custom-scrollbar h-[400px] overflow-y-auto px-2 space-y-7">
                        {/* Social Links */}
                        <div>
                            {/*<h5 className="mb-5 text-lg font-medium text-gray-800 dark:text-white/90 lg:mb-6">
                                Social Links
                            </h5>*/}
                            <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2">

                                <div>
                                    <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                                        Apple ID
                                    </label>
                                    <input
                                        type="text"
                                        value={appleID}
                                        onChange={(e) => setAppleID(e.target.value)}
                                        className="h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs focus:border-blue-500 focus:ring-3 focus:ring-blue-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 outline-none transition-all"
                                        placeholder={"Ingrese su Apple ID"}
                                    />
                                </div>

                                <div>
                                    <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                                        Contraseña
                                    </label>
                                    <input
                                        type="text"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs focus:border-blue-500 focus:ring-3 focus:ring-blue-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 outline-none transition-all"
                                        placeholder={"Ingrese su contraseña"}
                                    />
                                </div>

                            </div>
                        </div>

                        {/* Personal Information */}
                        <div>
                            <h5 className="mb-5 text-lg font-medium text-gray-800 dark:text-white/90 lg:mb-6">
                                Información obtenida de la cuenta iCloud
                            </h5>
                            {/* Contenedor relativo para el área de carga */}
                            <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2 relative min-h-[120px]">


                                <div className="col-span-full flex items-center justify-center py-5">
                                    {
                                        isLoading
                                            ? (
                                                <>
                                                    <div
                                                        className="animate-spin inline-block size-12 border-[4px] border-blue-600 border-t-transparent rounded-full"
                                                        role="status"
                                                        aria-label="loading"
                                                    >
                                                        <span className="sr-only">Loading...</span>
                                                    </div>
                                                </>
                                            )
                                            : (
                                                <>
                                                    <div className="mt-4 overflow-hidden rounded-lg border border-gray-200 dark:border-gray-700">
                                                        <pre className="whitespace-pre-wrap break-words bg-gray-50 p-4 text-sm font-mono text-gray-800 dark:bg-gray-900 dark:text-gray-300">
                                                            {responseAutoremove}
                                                        </pre>
                                                    </div>
                                                </>
                                            )
                                    }
                                </div>

                            </div>
                        </div>
                    </div>

                    {/* Botones de acción */}
                    <div className="flex items-center gap-3 px-2 mt-6 lg:justify-end">
                        <button
                            onClick={() => {
                                toggleModal(false);
                                resetStates();
                            }}
                            type="button"
                            className="flex w-full justify-center rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] sm:w-auto transition-colors"
                        >
                            Cerrar
                        </button>
                        <button
                            type="submit"
                            className="flex w-full justify-center rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-blue-700 sm:w-auto transition-colors"
                        >
                            Ejecutar Autoremove
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );

    return (
        <>
            {/* Si isOpen es true, enviamos el modal al <body> */}
            {isOpen && createPortal(modalContent, document.body)}
        </>
    );
};

export default ModalAutoremove;