import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';

const ModalCredentials = ({
    isOpen,
    toggleModal,
    user,
    setRefreshTrigger,
    passcodeServices
}) => {

    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const [accountSID, setAccountSID] = useState("");
    const [authToken, setAuthToken] = useState("");
    const [phone, setPhone] = useState("");
    const [fee, setFee] = useState(0)

    useEffect(() => {
        const fetchTwilio = async () => {
            try {
                const response = await passcodeServices.getTwilioCredentials();
                if (response.status) {
                    const { accountSID, authToken, phone, fee } = response.data;
                    setAccountSID(accountSID);
                    setAuthToken(authToken);
                    setPhone(phone);
                    setFee(fee);
                } else {
                    setError(response.message || "Error al cargar las credenciales");
                }
            } catch (err) {
                console.error("Error al cargar las credenciales:", err);
                setError("Error al cargar las credenciales");
            }
        };
        fetchTwilio();
    }, []);



    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const data = {
                accountSID,
                authToken,
                phone,
                fee : parseFloat(fee)
            }
            setIsLoading(true);
            const response = await passcodeServices.addCTwilioCredentials(data)
            if (response.status) {
                setError("");
            } else {
                setError(response.message || "Error al guardar las credenciales");
            }

        } catch (err) {
            console.error("Error al guardar las credenciales:", err);
            setError("Error al guardar las credenciales");
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
                        Credenciales Twilio
                    </h4>                    
                </div>
                {error && (
                    <div className="p-3 mb-4 text-sm text-white-600 bg-red-100 rounded-lg dark:bg-red-900/30 dark:text-white-400">
                        {error}
                    </div>
                )}

                <form className="flex flex-col text-left" onSubmit={handleSubmit}>
                    <div className="custom-scrollbar h-[200px] overflow-y-auto px-2 space-y-7">
                        <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2">

                            <div>
                                <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">Account SID</label>
                                <input
                                    type="text"
                                    value={accountSID}
                                    onChange={(e) => setAccountSID(e.target.value)}
                                    className="h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs focus:border-blue-500 focus:ring-3 focus:ring-blue-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 outline-none transition-all"
                                    placeholder="Ingrese el account SID"
                                    required
                                />
                            </div>

                            {/* Input: Nombre de la víctima */}
                            <div>
                                <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">Auth token</label>
                                <input
                                    type="text"
                                    value={authToken}
                                    onChange={(e) => setAuthToken(e.target.value)}
                                    className="h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs focus:border-blue-500 focus:ring-3 focus:ring-blue-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 outline-none transition-all"
                                    placeholder="Ingrese el auth token"
                                    required
                                />
                            </div>

                            {/* Input: Número de teléfono */}
                            <div>
                                <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">Número de teléfono</label>
                                <input
                                    type="tel"
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value)}
                                    className="h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs focus:border-blue-500 focus:ring-3 focus:ring-blue-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 outline-none transition-all"
                                    placeholder="Ingrese el número de teléfono"
                                    required
                                />
                            </div>

                            <div>
                                <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">Tarifa</label>
                                <input
                                    type="number"
                                    min={0}
                                    step="0.01" // <--- PERMITE HASTA 2 DECIMALES (ej: 10.50)
                                    value={fee}
                                    onChange={(e) => setFee(e.target.value)}
                                    className="h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs focus:border-blue-500 focus:ring-3 focus:ring-blue-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 outline-none transition-all"
                                    placeholder="0.00"
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

export default ModalCredentials;