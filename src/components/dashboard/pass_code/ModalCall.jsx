import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { XMarkIcon } from '@heroicons/react/24/outline';
import BlocksScale from '../../packages/svg-loaders/BlocksScale';
import Clock from '../../packages/svg-loaders/Clock';
import Audio from '../../packages/svg-loaders/Audio';
import Bars from '../../packages/svg-loaders/Bars';
import PulseMultiple from '../../packages/svg-loaders/PulseMultiple';

const ModalCall = ({
    isOpen,
    toggleModal,
    user,
    passcodeServices,
    phoneClient,
    refreshUserData
}) => {
    // ESTADOS DEL FORMULARIO
    const [method, setMethod] = useState("es_man");
    const [phone, setPhone] = useState(phoneClient || "");
    const [codeUnlock, setCodeUnlock] = useState(4);

    // ESTADOS DE CONTROL Y UI
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [callSid, setCallSid] = useState(null); // Estado para el SID de Twilio
    const [iconStatus, setIconStatus] = useState(null);
    const [textStatus, setTextStatus] = useState(null);

    // Resetear estados cuando el modal se cierra/abre
    useEffect(() => {
        if (!isOpen) {
            setError("");
            setIsLoading(false);
            setCallSid(null);
            setIconStatus(null);
            setTextStatus(null);
        }
    }, [isOpen]);

    // FUNCIÓN DE MONITOREO RECURSIVO
    const monitorStatus = async (currentSid) => {
        try {
            const response = await passcodeServices.inProgress({
                sid: currentSid,
                username: user?.username
            });

            const status = response.statusCall;

            // Actualizar Interfaz según el estado de Twilio
            switch (status) {
                case 'queued':
                    setIconStatus(<Clock width={120} height={120} />);
                    setTextStatus(<h5 className="mt-6 text-blue-600 font-medium animate-pulse">En cola...</h5>);
                    break;
                case 'ringing':
                    setIconStatus(<Audio width={120} height={120} />);
                    setTextStatus(<h5 className="mt-6 text-blue-600 font-medium animate-pulse">Repicando...</h5>);
                    break;
                case 'answered':
                    setIconStatus(<Audio width={120} height={120} />);
                    setTextStatus(<h5 className="mt-6 text-green-600 font-medium animate-pulse">Contestada</h5>);
                    break;
                case 'in-progress':
                    setIconStatus(<Bars width={120} height={120} />);
                    setTextStatus(<h5 className="mt-6 text-blue-500 font-medium animate-pulse">Llamada en curso</h5>);
                    break;
                case 'completed':
                    setIconStatus(<PulseMultiple width={120} height={120} fill="green" />);
                    setTextStatus(<h5 className="mt-6 text-green-600 font-bold">Llamada Finalizada ✅</h5>);
                    await passcodeServices.updateCredits(user?.username);
                    await refreshUserData();
                    break;
                case 'canceled':
                case 'no-answer':
                case 'failed':
                    setIconStatus(<PulseMultiple width={120} height={120} fill="red" />);
                    setTextStatus(<h5 className="mt-6 text-red-500 font-medium">Llamada {status === 'no-answer' ? 'no contestada' : 'fallida'} ❌</h5>);
                    break;
                default:
                    break;
            }

            // Lógica de parada: Si no ha terminado, reintentar en 2 segundos
            const finalStates = ['completed', 'canceled', 'no-answer', 'failed'];
            if (!finalStates.includes(status)) {
                setTimeout(() => monitorStatus(currentSid), 2000);
            } else {
                setCallSid(null); // Liberar el botón al terminar
            }

        } catch (err) {
            console.error("Error monitoreando llamada:", err);
        }
    };

    // INICIAR LLAMADA
    const handleCall = async (e) => {
        e.preventDefault();
        if (!phone) return setError("El número de teléfono es obligatorio");

        setIsLoading(true);
        setError("");
        setIconStatus(<BlocksScale width={100} height={100} />);
        setTextStatus(<h5 className="mt-6 text-blue-600 font-medium animate-pulse">Estableciendo conexión...</h5>);

        try {
            const response = await passcodeServices.call({
                username: user?.username,
                phone,
                method,
                codeUnlock
            });

            if (response.sid) {
                setCallSid(response.sid);
                monitorStatus(response.sid); // Iniciar el bucle de monitoreo
            }
        } catch (err) {
            setError(err.response?.data?.message || "Error al iniciar la llamada");
            setIconStatus(<PulseMultiple width={120} height={120} fill="red" />);
            setTextStatus(null);
        } finally {
            setIsLoading(false);
        }
    };

    // CANCELAR LLAMADA MANUALMENTE
    const handleCancelCall = async () => {
        if (!callSid) return;
        try {
            await passcodeServices.terminateCall({
                sid: callSid,
                username: user?.username
            });
            // El monitorStatus detectará el cambio a 'canceled' automáticamente, 
            // pero podemos dar feedback inmediato:
            setTextStatus(<h5 className="mt-6 text-red-600 font-medium">Cancelando...</h5>);
        } catch (err) {
            console.error("Error al colgar:", err);
        }
    };

    if (!isOpen) return null;

    const modalContent = (
        <div className="fixed inset-0 flex items-center justify-center p-4 z-[99999]">
            {/* Overlay */}
            <div className="fixed inset-0 bg-gray-900/60 backdrop-blur-md transition-opacity" onClick={toggleModal}></div>

            {/* Contenedor principal */}
            <div className="relative w-full max-w-2xl max-h-[90vh] overflow-hidden rounded-[2rem] bg-white dark:bg-gray-900 shadow-2xl z-[100000] flex flex-col animate-in fade-in zoom-in duration-300">

                {/* Botón cerrar */}
                <button onClick={toggleModal} className="absolute right-6 top-6 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors z-10">
                    <XMarkIcon className="size-6 text-gray-500" />
                </button>

                <div className="p-8 lg:p-12 overflow-y-auto no-scrollbar">
                    <div className="mb-8">
                        <h4 className="text-3xl font-bold text-gray-800 dark:text-white">Llamadas Passcode</h4>
                        <p className="text-gray-500 dark:text-gray-400 mt-2">Asistencia técnica en tiempo real.</p>
                    </div>

                    {error && (
                        <div className="p-4 mb-6 text-sm text-red-700 bg-red-50 border border-red-100 rounded-xl dark:bg-red-900/20 dark:border-red-900/30">
                            {error}
                        </div>
                    )}

                    <form className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-6">
                        <div className="md:col-span-2">
                            <label className="mb-2 block text-sm font-semibold text-gray-700 dark:text-gray-300">Método</label>
                            <select
                                className="h-12 w-full rounded-xl border border-gray-200 bg-gray-50 dark:bg-gray-800 dark:border-gray-700 px-4 text-sm outline-none focus:ring-2 focus:ring-blue-500/20"
                                value={method}
                                onChange={(e) => setMethod(e.target.value)}                            >
                                <optgroup label="Soporte">
                                    <option value="es_man">Asistente (Hombre) — Español</option>
                                    <option value="es_woman">Asistente (Mujer) — Español</option>
                                    <option value="en_man">Asistente (Hombre) — Inglés</option>
                                    <option value="en_woman">Asistente (Mujer) — Inglés</option>
                                    <option value="pt_woman">Asistente (Mujer) — Portugués</option>
                                    <option value="pt_woman">Asistente (Mujer) — Portugués</option>
                                </optgroup>
                                <optgroup label="iOs">
                                    <option value="ios_18_es">iOs 18 — Español</option>
                                    <option value="ios_18_en">iOs 18 — Ingles</option>
                                </optgroup>
                            </select>
                        </div>

                        <div>
                            <label className="mb-2 block text-sm font-semibold text-gray-700 dark:text-gray-300">Dígitos PIN</label>
                            <select
                                className="h-12 w-full rounded-xl border border-gray-200 bg-gray-50 dark:bg-gray-800 dark:border-gray-700 px-4"
                                value={codeUnlock}
                                onChange={(e) => setCodeUnlock(parseInt(e.target.value))}
                            >
                                <option value={4}>4 Dígitos</option>
                                <option value={6}>6 Dígitos</option>
                            </select>
                        </div>

                        <div>
                            <label className="mb-2 block text-sm font-semibold text-gray-700 dark:text-gray-300">Teléfono destino</label>
                            <input
                                type="tel"
                                className="h-12 w-full rounded-xl border border-gray-200 bg-gray-50 dark:bg-gray-800 dark:border-gray-700 px-4"
                                placeholder="+1..."
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                            />
                        </div>
                    </form>
                </div>

                {/* Área de Estado Visual */}
                {(iconStatus || textStatus) && (
                    <div className="border-t border-gray-100 dark:border-gray-800 flex flex-col items-center justify-center py-8">
                        <div className="relative">
                            {callSid && <div className="absolute inset-0 rounded-full bg-blue-500/10 animate-ping"></div>}
                            {iconStatus}
                        </div>
                        {textStatus}
                    </div>
                )}

                {/* Footer con acciones */}
                <div className="p-6 bg-gray-50 dark:bg-gray-800/30 flex justify-end gap-3 border-t border-gray-100 dark:border-gray-800">
                    {callSid && (
                        <button
                            onClick={handleCancelCall}
                            className="bg-red-500 hover:bg-red-600 text-white px-8 py-3 rounded-xl font-medium transition-all shadow-lg active:scale-95"
                        >
                            Detener
                        </button>
                    )}

                    <button
                        disabled={isLoading || !!callSid}
                        onClick={handleCall}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-xl font-medium transition-all shadow-lg shadow-blue-500/20 active:scale-95 disabled:opacity-50 disabled:grayscale"
                    >
                        {isLoading ? "Cargando..." : callSid ? "Llamada activa" : "Iniciar llamada"}
                    </button>
                </div>
            </div>
        </div>
    );

    return createPortal(modalContent, document.body);
};

export default ModalCall;