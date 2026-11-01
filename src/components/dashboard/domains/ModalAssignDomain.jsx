import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';

const ModalAssignDomain = ({
    isOpen,
    toggleModal,
    user, // Usuario logueado (quien opera)
    setRefreshTrigger,
    domainsServices,
    userServices,
    CanAccess
}) => {
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [domainName, setDomainName] = useState("");
    const [listUsers, setListUsers] = useState([]);
    const [listDomains, setListDomains] = useState([]); // Dominios disponibles para asignar
    const [assignedDomainsList, setAssignedDomainsList] = useState([]); // Dominios ya asignados al usuario seleccionado
    const [selectedUserId, setSelectedUserId] = useState("");
    const [localRefresh, setLocalRefresh] = useState(0);

    // 1. Cargar lista de usuarios al abrir el modal
    useEffect(() => {
        if (!isOpen) return;
        const fetchUsers = async () => {
            try {
                const response = await userServices.listUsers();
                setListUsers(response.data || []);
            } catch (err) {
                console.error("Error al obtener usuarios:", err);
            }
        };
        fetchUsers();
    }, [isOpen, userServices]);

    // 2. Cargar dominios disponibles (del usuario logueado)
    useEffect(() => {
        if (!user?.username) return;
        const fetchDomains = async () => {
            try {
                const response = await domainsServices.listDomains(user?.username);
                setListDomains(response.data || []);
            } catch (err) {
                console.error("Error cargando dominios disponibles:", err);
                setListDomains([]);
            }
        };
        fetchDomains();
    }, [user?.username, domainsServices]);

    // 3. Cargar lista de dominios asignados al usuario seleccionado (La lista que pediste)
    useEffect(() => {
        /*if (!selectedUserId) {
            setAssignedDomainsList([]);
            return;
        }*/
        const fetchAssigned = async () => {
            try {
                const response = await domainsServices.listAssignDomain(
                    user?.role === "admin"
                        ? selectedUserId
                        : user?.username

                );
                setAssignedDomainsList(response.data || []);
            } catch (err) {
                console.error("Error al obtener dominios asignados:", err);
            }
        };
        fetchAssigned();
    }, [selectedUserId, localRefresh, domainsServices]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!domainName) {
            setError("Debes seleccionar un dominio");
            return;
        }

        try {
            const data = {
                domain: domainName,
                username: selectedUserId
            };
            setIsLoading(true);
            const response = await domainsServices.assignDomain(data);

            if (response.status) {
                setError("");
                setLocalRefresh(prev => prev + 1); // Actualiza la lista de abajo automáticamente
                setRefreshTrigger(prev => prev + 1);
            } else {
                setError(response.message || "Error al guardar el dominio");
            }
        } catch (err) {
            setError("Error al guardar el dominio");
        } finally {
            setIsLoading(false);
        }
    };

    const handleDelete = async (domain, username) => {
        // Confirmación opcional para evitar clicks accidentales
        if (!window.confirm(`¿Estás seguro de eliminar el dominio ${domain}?`)) return;

        try {
            setIsLoading(true);
            // Enviamos el objeto con domain y username como requiere tu backend
            const response = await domainsServices.deleteAssignDomain({ domain, username });

            if (response.status) {
                setError("");
                // Refrescamos la lista local y la global
                setLocalRefresh(prev => prev + 1);
                setRefreshTrigger(prev => prev + 1);
            } else {
                setError(response.msgStatus || "Error al eliminar la asignación");
            }
        } catch (err) {
            console.error("Error deleting domain:", err);
            setError("Error de servidor al intentar eliminar");
        } finally {
            setIsLoading(false);
        }
    };

    const modalContent = (
        <div className="fixed inset-0 flex items-center justify-center p-5 overflow-y-auto z-[99999]">

            <div className="no-scrollbar relative w-full max-w-[700px] max-h-[90vh] overflow-y-auto rounded-3xl bg-white p-4 dark:bg-gray-900 lg:p-11 shadow-2xl z-[100000]">
                <div className="px-2 mb-6 flex items-center justify-between">
                    {/* Título */}
                    <h4 className="text-2xl font-semibold text-gray-800 dark:text-white/90">
                        Detalles del proceso
                    </h4>

                    {/* Botón Cerrar con Icono */}
                    <button
                        onClick={() => toggleModal(false)}
                        type="button"
                        className="flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 transition-colors"
                    >
                        <span>Cerrar</span>
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={2}
                            stroke="currentColor"
                            className="w-4 h-4"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {error && (
                    <div className="p-3 mb-4 text-sm text-red-600 bg-red-100 rounded-lg dark:bg-red-900/30 dark:text-red-400">
                        {error}
                    </div>
                )}

                <div className="space-y-5">
                    {/* Selector de Dominios */}

                    <CanAccess allowedRoles={['admin']}>
                        <div className="flex flex-col gap-2">
                            <label className="text-xs font-bold uppercase tracking-widest text-gray-400 ml-1">
                                Seleccionar Dominio
                            </label>
                            <select
                                value={domainName}
                                onChange={(e) => setDomainName(e.target.value)}
                                className="w-full p-3 rounded-xl border border-gray-200 bg-gray-50 dark:bg-gray-800 dark:border-gray-700 outline-none focus:ring-2 focus:ring-blue-500 transition-all text-sm font-medium disabled:opacity-50"
                            >
                                <option value="">
                                    {listDomains.length > 0 ? "Seleccione un dominio..." : "No hay dominios disponibles"}
                                </option>
                                {listDomains.map((item) => (
                                    <option key={item._id} value={item.domain}>
                                        {item.domain}
                                    </option>
                                ))}
                            </select>
                        </div>


                        {/* Selector de Usuarios */}
                        <div className="flex flex-col gap-2">
                            <label className="text-xs font-bold uppercase tracking-widest text-gray-400 ml-1">
                                Seleccionar Usuario
                            </label>
                            <select
                                value={selectedUserId}
                                onChange={(e) => setSelectedUserId(e.target.value)}
                                className="w-full p-3 rounded-xl border border-gray-200 bg-gray-50 dark:bg-gray-800 dark:border-gray-700 outline-none focus:ring-2 focus:ring-blue-500 transition-all text-sm font-medium"
                            >
                                <option value="">Seleccione un usuario...</option>
                                {listUsers.map((item) => (
                                    <option key={item._id} value={item.username}>
                                        {item.username}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Botón de Acción */}
                        <button
                            onClick={handleSubmit}
                            disabled={isLoading || !domainName || !selectedUserId}
                            className="w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-xl transition-colors disabled:bg-gray-400"
                        >
                            {isLoading ? "Procesando..." : "Asignar Dominio"}
                        </button>

                    </CanAccess>

                    <hr className="my-6 border-gray-100 dark:border-gray-800" />

                    {/* Nueva sección: Lista de dominios que provienen de listAssignDomain */}
                    <div className="flex flex-col gap-3">
                        <label className="text-xs font-bold uppercase tracking-widest text-gray-400 ml-1">
                            Dominios asignados actualmente
                        </label>
                        <div className="max-h-[200px] overflow-y-auto space-y-2 pr-2 custom-scrollbar">
                            {assignedDomainsList.length > 0 ? (
                                assignedDomainsList.map((item, index) => (
                                    <div
                                        key={index}
                                        className="flex items-center justify-between p-3 text-sm bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 group"
                                    >
                                        <span className="text-gray-700 dark:text-gray-300 font-medium">
                                            {item.domain}
                                        </span>

                                        {/* Botón Eliminar */}
                                        <button
                                            onClick={() => handleDelete(item.domain, item.username)}
                                            disabled={isLoading}
                                            className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors disabled:opacity-50"
                                            title="Eliminar asignación"
                                        >
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                strokeWidth={1.5}
                                                stroke="currentColor"
                                                className="w-5 h-5"
                                            >
                                                <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                                            </svg>
                                        </button>
                                    </div>
                                ))
                            ) : (
                                <p className="text-sm text-gray-400 italic text-center py-4">
                                    {selectedUserId ? "Sin dominios asignados." : "Selecciona un usuario para ver su lista."}
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );

    return (
        <>{isOpen && createPortal(modalContent, document.body)}</>
    );
};

export default ModalAssignDomain;