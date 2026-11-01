import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import smsApisServices from '../../../../api/http/smsapis/smsApis';
import smsTemplatesServices from '../../../../api/http/smsapis/smsTemplates';
import senderSmsServices from '../../../../api/http/smsapis/senderSMS';
import AlertToast from '../../../packages/AlertToast';

const ModalSendSMS = ({
    isOpen,
    toggleModal,
    user,
    refreshUserData,
    smsData,
    setSmsData
}) => {
    // --- ESTADOS ---
    const [alertConfig, setAlertConfig] = useState({ show: false, message: '', type: 'success' });
    const [isLoading, setIsLoading] = useState(false);
    const [apisList, setApisList] = useState([]);
    const [templatesList, setTemplatesList] = useState([]);

    // Estados de formulario
    const [selectedApi, setSelectedApi] = useState("");
    const [selectedTemplate, setSelectedTemplate] = useState("");
    const [message, setMessage] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");

    // --- LÓGICA DE REINICIO Y CARGA ---

    // 1. Limpiar y resetear estados cuando el modal se abre o cambia smsData
    useEffect(() => {
        if (isOpen) {
            // Seteamos el teléfono si viene en los props, si no vacío
            setPhoneNumber(smsData?.phone || "");
            // IMPORTANTE: Limpiamos los campos de selección al abrir un nuevo registro
            setSelectedApi("");
            setSelectedTemplate("");
            setMessage("");
            setAlertConfig({ show: false, message: '', type: 'success' });
        }
    }, [isOpen, smsData]);

    // 2. Carga de Apis y Plantillas al abrir
    useEffect(() => {
        const fetchData = async () => {
            if (isOpen) {
                setIsLoading(true);
                try {
                    const [apisRes, templatesRes] = await Promise.all([
                        smsApisServices.listApis(),
                        smsTemplatesServices.listTemplates()
                    ]);
                    setApisList(apisRes?.data || []);
                    setTemplatesList(templatesRes?.data || []);
                } catch (error) {
                    console.error("Error cargando datos:", error);
                    setApisList([]);
                    setTemplatesList([]);
                } finally {
                    setIsLoading(false);
                }
            }
        };
        fetchData();
    }, [isOpen]);

    // --- ACCIONES ---

    const showAlert = (message, type = 'success') => {
        setAlertConfig({ show: true, message, type });
    };

    // Función unificada para cerrar y limpiar todo
    const handleClose = () => {
        toggleModal(false);
        setSmsData({});
        setApisList([]);
        setTemplatesList([]);
        setSelectedApi("");
        setSelectedTemplate("");
        setMessage("");
        setPhoneNumber("");
        setAlertConfig(prev => ({ ...prev, show: false }));
    };

    const onChangeTemplete = (value) => {
        if (!value) {
            setMessage("");
            return;
        }

        // Procesamiento de etiquetas con encadenamiento opcional para evitar errores
        const msgNew = value
            .replace(/#customer#/g, smsData?.customer || "")
            .replace(/#victim_name#/g, smsData?.victimName || "")
            .replace(/#device#/g, smsData?.device || "")
            .replace(/#url#/g, smsData?.url || "")
            .replace(/#phone#/g, smsData?.phone || "")
            .replace(/#imei#/g, smsData?.imei || "")
            .replace(/#email#/g, smsData?.email || "")
            .replace(/#date_time#/g, smsData?.dateTime || "")
            .replace(/#date#/g, smsData?.date || "")
            .replace(/#time#/g, smsData?.time || "");

        setMessage(msgNew);
    };

    const sendSMS = async (e) => {
        e.preventDefault();

        if (!phoneNumber || phoneNumber === "0") {
            showAlert('Por favor ingrese un número de teléfono válido', 'error');
            return;
        }
        if (!message.trim()) {
            showAlert('El mensaje no puede estar vacío', 'error');
            return;
        }
        if (!selectedApi) {
            showAlert('Debes seleccionar una API válida', 'error');
            return;
        }

        try {
            setIsLoading(true);
            const response = await senderSmsServices.sendSMS({
                username: user?.username,
                api: selectedApi,
                phoneNumber,
                message
            });

            if (response.status) {
                await refreshUserData();
                showAlert("¡Mensaje enviado con éxito!", "success");
                // Esperamos un poco para cerrar
                setTimeout(() => handleClose(), 2000);
            }
        } catch (error) {
            const serverData = error.response?.data;
            const status = error.response?.status;

            if (status === 403) {
                showAlert(serverData?.message || "Acceso denegado o saldo insuficiente", 'error');
            } else if (status === 402) {
                showAlert("Se requiere una recarga para continuar", 'error');
            } else if (status === 400) {
                const detail = serverData?.error?.msg || "Revisa la configuración de la API";
                showAlert(`${serverData?.message || 'Error'}: ${detail}`, 'error');
            } else if (status === 500) {
                showAlert(`Error en el servidor: ${serverData?.message}`, 'error');
            } else {
                showAlert('No hay conexión con el servidor o error de red', 'error');
            }
            console.error("Detalle técnico:", error);
        } finally {
            setIsLoading(false);
        }
    };

    // --- RENDER ---

    const modalContent = (
        <div className="fixed inset-0 flex items-center justify-center p-5 overflow-y-auto z-[99999]">
            {/* Backdrop */}
            <div 
                onClick={handleClose} 
                className="fixed inset-0 h-full w-full bg-gray-900/50 backdrop-blur-sm transition-opacity"
            ></div>

            {/* Modal Body */}
            <div className="no-scrollbar relative w-full max-w-[700px] max-h-[90vh] overflow-y-auto rounded-3xl bg-white p-4 dark:bg-gray-900 lg:p-11 shadow-2xl z-[100000]">
                <div className="px-2 pr-14 text-left">
                    <h4 className="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90">SMS Sender</h4>
                    <p className="mb-6 text-sm text-gray-500 dark:text-gray-400">Configura y envía un mensaje de texto.</p>
                </div>

                <form onSubmit={sendSMS} className="flex flex-col text-left">
                    <div className="custom-scrollbar max-h-[500px] overflow-y-auto px-1 space-y-6">
                        <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2">
                            <div>
                                <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">Apis</label>
                                <select
                                    required
                                    className="h-11 w-full appearance-none rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 outline-none focus:border-blue-500 transition-all"
                                    value={selectedApi}
                                    onChange={(e) => setSelectedApi(e.target.value)}
                                >
                                    <option value="">Seleccionar API</option>
                                    {apisList.map((api) => (
                                        <option key={api.idApi} value={api.idApi}>{api.description}</option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">Plantillas</label>
                                <select
                                    className="h-11 w-full appearance-none rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 outline-none focus:border-blue-500 transition-all"
                                    value={selectedTemplate}
                                    onChange={(e) => {
                                        const val = e.target.value;
                                        setSelectedTemplate(val);
                                        onChangeTemplete(val);
                                    }}
                                >
                                    <option value="">Ninguna (Texto libre)</option>
                                    {templatesList.map((temp) => (
                                        <option key={temp.name} value={temp.description}>{temp.name}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div className="col-span-full">
                            <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">Mensaje</label>
                            <textarea
                                required
                                rows="4"
                                className="w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 outline-none focus:border-blue-500 transition-all resize-none"
                                placeholder="Escribe el contenido del SMS..."
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                            ></textarea>
                        </div>

                        <div className="col-span-full">
                            <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">Número de Teléfono</label>
                            <input
                                required
                                type="tel"
                                pattern="[0-9]*"
                                onInput={(e) => e.target.value = e.target.value.replace(/[^0-9]/g, '')}
                                className="h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 outline-none focus:border-blue-500 transition-all"
                                placeholder="Ej: 584121234567"
                                value={phoneNumber}
                                onChange={(e) => setPhoneNumber(e.target.value)}
                            />
                        </div>

                        <div className="pt-2">
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="h-11 w-full rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-blue-700 transition-all disabled:bg-blue-400 shadow-sm active:scale-[0.98]"
                            >
                                {isLoading ? "Enviando..." : "Enviar SMS"}
                            </button>
                        </div>
                    </div>
                </form>

                <div className="flex items-center gap-3 px-2 mt-6 lg:justify-end">
                    <button
                        onClick={handleClose}
                        type="button"
                        className="flex w-full justify-center rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 sm:w-auto transition-colors"
                    >
                        Cerrar
                    </button>
                </div>
            </div>
        </div>
    );

    return (
        <>
            {alertConfig.show && (
                <AlertToast
                    message={alertConfig.message}
                    type={alertConfig.type}
                    onClose={handleClose}
                />
            )}
            {isOpen && createPortal(modalContent, document.body)}
        </>
    );
};

export default ModalSendSMS;