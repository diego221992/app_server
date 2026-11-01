import { useState, useEffect } from "react";
import { useAuth } from '../../../context/AuthContext';
import ModalAutoremove from "./ModalAutoremove";
import DataTable from "../../packages/DataTable";
import autoremoveServices from '../../../api/http/autoremove/autoremove';

const Autoremove = () => {
    const { user } = useAuth();
    const pageName = "Autoremove";
    // Estado para controlar la visibilidad del modal
    const [isOpen, setIsOpen] = useState(false);
    // Función para alternar el modal
    const toggleModal = () => setIsOpen(!isOpen);
    const [columns, setColumns] = useState([]);
    // 1. Añadimos un estado para forzar el refresco de la DataTable si es necesario
    const [refreshTrigger, setRefreshTrigger] = useState(0);

    // 2. Función para obtener datos (se puede llamar desde cualquier parte)
    const fetchTableData = async () => {
        try {
            const response = await autoremoveServices.listAutoremove(user.username);
            return response.data;
        } catch (error) {
            console.error("Error fetching autoremove data:", error);
            return [];
        }
    };

    useEffect(() => {       
        const colmns = [
            {
                name: 'Eliminar',
                cell: row => (
                    <div className="min-w-[100px] flex justify-center">
                        <button
                            className="px-2 py-1 text-xs bg-red-500 text-white rounded hover:bg-red-600 transition"
                            onClick={async () => {
                                if (window.confirm("¿Estás seguro de que deseas eliminar este registro?")) {
                                    try {
                                        // 3. Esperamos el borrado
                                        await autoremoveServices.deleteAutoremove(row._id, user.username);
                                        // 4. Incrementamos el trigger para que la tabla sepa que debe recargar
                                        setRefreshTrigger(prev => prev + 1);
                                        // Opcional: una notificación de éxito aquí
                                    } catch (err) {
                                        alert("Error al eliminar el registro");
                                    }
                                }
                            }}
                        >
                            Eliminar
                        </button>
                    </div>
                )
            },
            {
                name: 'Apple ID',
                selector: row => row.appleID,
                sortable: true,
                // Eliminamos minWidth de aquí
                cell: row => (
                    <div className="min-w-[150px] font-medium text-gray-700 dark:text-gray-300 break-all py-2">
                        {row.appleID}
                    </div>
                ),
            },
            {
                name: 'Contraseña',
                selector: row => row.password,
                sortable: true,
                cell: row => <div className="min-w-[100px]">{row.password}</div>
            },
            {
                name: 'Fecha',
                selector: row => row.registrationDate,
                sortable: true,
                cell: row => <div className="min-w-[120px]">{row.registrationDate}</div>
            },
            {
                name: 'Resultado',
                // Si 'grow' te sigue dando error, elimínalo y usa flex-grow en el div
                cell: row => {
                    const [show, setShow] = useState(false);

                    return (
                        <div className="flex-grow min-w-[250px] py-2 flex justify-center items-center">
                            {!show ? (
                                <button
                                    onClick={() => setShow(true)}
                                    className="flex items-center gap-2 px-3 py-1.5 text-xs font-semibold text-white bg-blue-600 rounded-md hover:bg-blue-700 transition shadow-sm"
                                >
                                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                    </svg>
                                    Ver Resultado
                                </button>
                            ) : (
                                <div className="flex flex-col items-center gap-2 w-full">
                                    <button
                                        onClick={() => setShow(false)}
                                        className="text-[10px] font-bold text-red-500 hover:text-red-700 flex items-center gap-1"
                                    >
                                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 15l7-7 7 7" />
                                        </svg>
                                        CERRAR
                                    </button>
                                    <pre className="w-full max-h-[200px] overflow-auto whitespace-pre-wrap break-words bg-gray-900 p-3 text-[11px] font-mono text-green-400 rounded-lg border border-gray-700 shadow-inner text-left">
                                        {typeof row.response === 'object'
                                            ? JSON.stringify(row.response, null, 2)
                                            : row.response}
                                    </pre>
                                </div>
                            )}
                        </div>
                    );
                }
            }
        ];
        setColumns(colmns);
    }, [user.username])



    return (
        <>
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
                        Autoremove manual
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 sm:text-base">
                        Aqui puedes utlizar el autoremove de forma manual, para remover los equipos de la cuenta iCloud
                    </p>
                </div>

                <div className="border-t border-gray-100 px-6 py-6.5 dark:border-gray-800">
                    <div className="flex items-center gap-5">
                        <ModalAutoremove
                            isOpen={isOpen}
                            setIsOpen={setIsOpen}
                            toggleModal={toggleModal}
                            user={user}
                            setRefreshTrigger={setRefreshTrigger}
                            autoremoveServices={autoremoveServices}
                        />
                        <button
                            onClick={toggleModal}
                            className="inline-flex items-center gap-2 px-4 py-3 text-sm font-medium text-white transition rounded-lg bg-brand-500 shadow-theme-xs hover:bg-brand-600">
                            Remover datos
                        </button>
                    </div>
                </div>
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
            </div>
        </>
    );
};

export default Autoremove;