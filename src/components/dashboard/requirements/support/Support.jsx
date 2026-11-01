import { useState, useEffect, use } from "react";
import { useAuth } from '../../../../context/AuthContext';
import DataTable from "../../../packages/DataTable";
import supportServices from '../../../../api/http/requirements/support'
import { validate } from '../../../../utils/validationHelper'
import { EyeIcon, TrashIcon } from '@heroicons/react/24/outline';
import ModalDetails from './ModalDetails'
import AlertToast from '../../../packages/AlertToast';

const Support = () => {
    const { user } = useAuth();
    const pageName = "Soporte";
    const [alertConfig, setAlertConfig] = useState({ show: false, message: '', type: 'success' });
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [domain, setDomain] = useState("");
    const [status, setStatus] = useState(false);
    const [codeUnlock, setCodeUnlock] = useState("none")
    const [domainError, setDomainError] = useState(null)
    const [columns, setColumns] = useState([]);
    const [refreshTrigger, setRefreshTrigger] = useState(0);
    const [isOpen, setIsOpen] = useState(false);
    const toggleModal = () => setIsOpen(!isOpen);
    const [idProcess, setIdProcess] = useState("")

    const fetchTableData = async () => {
        try {
            const response = await supportServices.listObtainedSupport(user.username);
            console.log(response)
            return response.data;
        } catch (error) {
            console.error("Error fetching support data:", error);
            return [];
        }
    };

    const fetchTableDetails = async (data) => {
        try {
            const response = await supportServices.listDetailSupport(data);
            console.log(response)
            return response.data;
        } catch (error) {
            console.error("Error fetching support data:", error);
            return [];
        }
    };



    useEffect(() => {
        const colmns = [
            {
                name: 'Acciones',
                cell: row => (
                    <div className="flex items-center gap-2">
                        {/* Botón Ver (Ojo) */}
                        <button
                            onClick={() => {
                                toggleModal()
                                setIdProcess(row._id)
                            }}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
                            title="Ver detalles"
                        >
                            <EyeIcon className="w-5 h-5" />
                        </button>

                        {/* Botón Eliminar (Basura) */}
                        <button
                            onClick={() => handleDelete(row._id)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-full transition-colors"
                            title="Eliminar registro"
                        >
                            <TrashIcon className="w-5 h-5" />
                        </button>
                    </div>
                ),
                ignoreRowClick: true, // Evita que al hacer clic en el botón se dispare el evento de la fila
                //allowOverflow: true,
                //button: true, // Optimiza el alineamiento para botones
                width: '120px', // Un poco más de espacio para que no respiren tan justo
            },
            /*{
                name: 'Estado',
                cell: row => (<span className={`px-2 py-1 text-xs font-medium rounded-full ${row.status === "true" ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    {row.status}
                    {
                        row.status === "true"
                            ? 'Completado'
                            : row.status === "passcode_process" ? 'Passcode'
                                : row.status === "false" ? 'Fallido'
                                    : "En proceso"
                    }
                </span>
                ),
                sortable: true,
                width: '130px',
            },*/
            {
                name: 'Apple ID',
                selector: row => row.appleID,
                sortable: true,
                width: '200px',
            },
            {
                name: 'Contraseña',
                selector: row => row.password,
                sortable: true,
                width: '200px',
            },
            {
                name: 'Códigos',
                selector: row => row.codesUnlock,
                sortable: true,
                with: '200px'
            },
            {
                name: 'Fecha de creación',
                selector: row => new Date(row.createdAt).toLocaleString(),
                sortable: true,
                width: '200px', // Nota: corregido "with" a "width"
                wrap: true,     // <--- Esta es la clave para el salto de línea
                style: {
                    whiteSpace: 'normal', // Refuerza que el texto pueda romperse
                },
            }
        ]
        setColumns(colmns);
    }, [])


    useEffect(() => {
        const fetchDomain = async () => {
            try {
                const response = await supportServices.getDomain({ username: user.username });
                if (response.status) {
                    const { domain, status, codeUnlock } = response.data;
                    console.log(response.data)
                    setDomain(domain);
                    setStatus(status);
                    setCodeUnlock(codeUnlock)
                } else {
                    setError(response.message || "Error al cargar el dominio");
                }
            } catch (err) {
                console.error("Error al cargar el dominio:", err);
                setError("Error al cargar el dominio");
            }
        };

        fetchDomain();
    }, [domain]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        const error = validate.domain(domain);
        if (error) {
            setDomainError(error);
            return; // Detiene el envío si hay error
        }
        try {
            const data = {
                domain,
                username: user?.username
            }

            setIsLoading(true);
            const response = await supportServices.addDomain(data)
            if (response.status) {
                setError("");
                setAlertConfig({ show: true, message: "Dominio agregado con éxito", type: "success" });
            } else {
                setAlertConfig({ show: true, message: "Ya existe un dominio con ese nombre", type: "error" });
                setError(response.message || "Error al agregar el dominio");
            }

        } catch (err) {
            console.error("Error al agregar el dominio:", err);
            setAlertConfig({ show: true, message: "Error al agregar el dominio, verificar los DNS del dominio", type: "error" });
            setError("Error al agregar el dominio");
        } finally {
            setIsLoading(false);
        }
    }

    const handleDeleteDomain = async () => {
        if (window.confirm("¿Estás seguro de que deseas eliminar este dominio?")) {
            try {
                setIsLoading(true);
                const response = await supportServices.deleteDomain({ username: user.username, domain });
                if (response.status) {
                    setError("");
                    setDomain("");
                    setAlertConfig({ show: true, message: "Dominio eliminado con éxito", type: "success" });
                }else{
                    setAlertConfig({ show: true, message: "Error al eliminar el dominio", type: "error" });
                    setError(response.message || "Error al eliminar el dominio");
                }
              
            } catch (err) {
                console.error("Error al eliminar el dominio:", err);
                setError("Error al eliminar el dominio");
            }finally {
                setIsLoading(false);
            }
        }

    }

    const handleDelete = async (id) => {
        if (window.confirm("¿Estás seguro de que deseas eliminar este proceso?")) {
            try {
                const response = await supportServices.deleteProcess(id);
                if (response.status) {
                    setError("");
                    setRefreshTrigger(prev => prev + 1);
                } else {
                    setError(response.message || "Error al eliminar el proceso");
                }
            } catch (err) {
                console.error("Error al eliminar el proceso:", err);
                setError("Error al eliminar el proceso");
            }
        } else {
            // El usuario canceló la eliminación
            return;
        }
    }

    const handleUpdate = async (data) => {
        try {
            const response = await supportServices.updateOption(data);
            if (response.status) {
                setError("");
            } else {
                setError(response.message || "Dominio actualizado con exito");
            }
        } catch (err) {
            console.error("Error al actualizar el dominio:", err);
            setError("Error al actualizar el dominio");
        }
    }

    const handleIPS = async () => {
         alert("Aqui vas las ips")
    }



    return (
        <>

            {alertConfig.show && (
                <AlertToast
                    message={alertConfig.message}
                    type={alertConfig.type}
                    onClose={() => setAlertConfig({ ...alertConfig, show: false })}
                />
            )}
            {/* Se eliminó el x-data de este div */}
            <div>
                <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
                    {/* Reemplazamos x-text por la variable entre llaves */}
                    <h2 className="text-xl font-semibold text-gray-800 dark:text-white/90">
                        {pageName}
                    </h2>

                    <nav>
                        <ol className="flex items-center gap-1.5">
                            <li>
                                <a className="inline-flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400"
                                    href="index.html">
                                    Dashboard
                                    <svg className="stroke-current" width="17" height="16" viewBox="0 0 17 16" fill="none"
                                        xmlns="http://www.w3.org/2000/svg">
                                        <path d="M6.0765 12.667L10.2432 8.50033L6.0765 4.33366" stroke="" strokeWidth="1.2"
                                            strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                </a>
                            </li>
                            {/* Aquí también mostramos el título en el breadcrumb */}
                            <li className="text-sm text-gray-800 dark:text-white/90">
                                {pageName}
                            </li>
                        </ol>
                    </nav>
                </div>
            </div>

            <div className="min-h-screen rounded-2xl border border-gray-200 bg-white px-5 py-7 dark:border-gray-800 dark:bg-white/[0.03] xl:px-10 xl:py-12">
                <div className="mx-auto w-full max-w-[630px] text-center">
                    <h3 className="mb-4 text-theme-xl font-semibold text-gray-800 dark:text-white/90 sm:text-2xl">
                        Dominio de soporte
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 sm:text-base">
                        Gestion del script de soporte, funciona con dominio unico por usuario, el dominio debe apuntar a las IPs del servidor para su correcto funcionamiento, si deseas cambiar de dominio elimina el actual y agrega el nuevo.
                    </p>
                </div>

                <div className="border-t border-gray-100 px-1 py-6.5 dark:border-gray-800">

                    <form className="flex flex-col text-left" onSubmit={handleSubmit} >
                        <div className="custom-scrollbar  overflow-y-auto px-2 space-y-7">
                            <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2">
                                <div>
                                    <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">Dominio</label>
                                    <input
                                        type="text"
                                        value={domain}
                                        onChange={(e) => {
                                            setDomain(e.target.value)
                                            const error = validate.domain(e.target.value)
                                            setDomainError(error);
                                        }}
                                        className={`h-11 w-full rounded-lg border bg-transparent px-4 py-2.5 text-sm shadow-theme-xs outline-none transition-all 
                                            ${domainError
                                                ? "border-red-500 focus:border-red-500 focus:ring-red-500/10 dark:border-red-500"
                                                : "border-gray-300 focus:border-blue-500 focus:ring-blue-500/10 dark:border-gray-700"
                                            } 
                                             text-gray-800 dark:bg-gray-900 dark:text-white/90`}
                                        required
                                    />

                                </div>

                                <div>
                                    <div>
                                        <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                                            Estado
                                        </label>
                                        <select
                                            className="dark:bg-dark-900 shadow-theme-xs focus:border-brand-300 focus:ring-brand-500/10 dark:focus:border-brand-800 h-11 w-full appearance-none rounded-lg border border-gray-300 bg-transparent bg-none px-4 py-2.5 pr-11 text-sm text-gray-800 placeholder:text-gray-400 focus:ring-3 focus:outline-hidden dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30"
                                            value={status.toString()} // Vinculamos el estado al select
                                            onChange={async (e) => {
                                                setStatus(e.target.value === "true")
                                                await handleUpdate(
                                                    {
                                                        option: "status",
                                                        value: e.target.value,
                                                        username: user?.username
                                                    }
                                                )

                                            }} // Convertimos el string a booleano
                                        >
                                            <option value="true" className="text-gray-700 dark:bg-gray-900 dark:text-gray-400">
                                                Activo
                                            </option>
                                            <option value="false" className="text-gray-700 dark:bg-gray-900 dark:text-gray-400">
                                                Desactivado
                                            </option>
                                        </select>
                                    </div>
                                </div>

                                <div>
                                    <div>
                                        <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                                            Opciones de código
                                        </label>
                                        <select
                                            className="dark:bg-dark-900 shadow-theme-xs focus:border-brand-300 focus:ring-brand-500/10 dark:focus:border-brand-800 h-11 w-full appearance-none rounded-lg border border-gray-300 bg-transparent bg-none px-4 py-2.5 pr-11 text-sm text-gray-800 placeholder:text-gray-400 focus:ring-3 focus:outline-hidden dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30"
                                            value={codeUnlock} // Vinculamos el estado al select
                                            onChange={async (e) => {
                                                setCodeUnlock(e.target.value)
                                                await handleUpdate(
                                                    {
                                                        option: "codeUnlock",
                                                        value: e.target.value,
                                                        username: user?.username
                                                    }
                                                )
                                            }} // Convertimos el string a booleano
                                        >
                                            <option value="none" className="text-gray-700 dark:bg-gray-900 dark:text-gray-400">
                                                Sin código
                                            </option>
                                            <option value="6" className="text-gray-700 dark:bg-gray-900 dark:text-gray-400">
                                                Código 6
                                            </option>
                                            <option value="4" className="text-gray-700 dark:bg-gray-900 dark:text-gray-400">
                                                Código 4
                                            </option>
                                        </select>
                                    </div>
                                </div>

                                <div className="flex items-end" style ={{display:'none'}}>
                                    <button
                                        type="button"
                                        onClick={handleIPS}
                                        disabled={isLoading}
                                        className="h-11 w-full rounded-lg bg-gray-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-gray-700 transition-all disabled:bg-red-400 shadow-sm active:scale-[0.98]"
                                    >
                                        IPS bloqueadas
                                    </button>
                                </div>

                            </div>
                            <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2">
                                <div className="flex items-end">
                                    <button
                                        onClick={handleSubmit}
                                        type="submit"
                                        disabled={isLoading}
                                        className="h-11 w-full rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-blue-700 transition-all disabled:bg-blue-400 shadow-sm active:scale-[0.98]"
                                    >
                                        {isLoading ? "Guardando..." : "Guardar"}
                                    </button>
                                </div>
                                <div className="flex items-end">
                                    <button
                                        type="button"
                                        onClick={handleDeleteDomain}
                                        disabled={isLoading}
                                        className="h-11 w-full rounded-lg bg-red-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-red-700 transition-all disabled:bg-red-400 shadow-sm active:scale-[0.98]"
                                    >
                                        {isLoading ? "Eliminando..." : "Eliminar"}
                                    </button>
                                </div>
                            </div>




                        </div>
                    </form>
                    <div className="mt-6">
                        <DataTable
                            // 5. Pasamos el refreshTrigger como key o prop si tu DataTable lo soporta
                            // Si tu DataTable no se actualiza sola al cambiar responseHttps, 
                            // usar 'key' forzará un re-render del componente completo.
                            key={refreshTrigger}
                            columns={columns}
                            responseHttps={fetchTableData}
                        />
                    </div>
                    {idProcess != "" && (
                        <ModalDetails
                            isOpen={isOpen}
                            setIsOpen={setIsOpen}
                            toggleModal={toggleModal}
                            user={user}
                            setRefreshTrigger={setRefreshTrigger}
                            idProcess={idProcess}
                            setIdProcess={setIdProcess}
                            fetchTableDetails={fetchTableDetails}
                        />
                    )}

                </div>

            </div>
        </>
    );
};

export default Support;