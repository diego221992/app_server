import { useState, useEffect, use } from "react";
import { useAuth } from '../../../context/AuthContext';
import DataTable from "../../packages/DataTable";
import domainsServices from '../../../api/http/domains/domains';
import userServices from '../../../api/http/users/Manager';
import ModalAdd from "./ModalAdd";
import ModalAssignDomain from "./ModalAssignDomain";
import { EyeIcon, TrashIcon, PhoneIcon, PhoneArrowUpRightIcon, ArrowPathIcon } from '@heroicons/react/24/outline';
import { CanAccess } from '../../auth/RouteGuards';

const Domains = () => {
    const { user } = useAuth();
    const pageName = "Dominios";
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [columns, setColumns] = useState([]);
    const [refreshTrigger, setRefreshTrigger] = useState(0);
    const [deleteRefresh, setDeleteRefresh] = useState(false);

    const [isOpen, setIsOpen] = useState(false);
    const [isOpenAssignDomain, setIsOpenAssignDomain] = useState(false);
    const toggleModal = () => setIsOpen(!isOpen);
    const toggleModalAssignDomain = () => setIsOpenAssignDomain(!isOpenAssignDomain);


    const [phoneClient, setPhoneClient] = useState(0);



    const fetchTableData = async () => {
        try {
            const response = await domainsServices.listDomains(user.username);
            return response.data;
        } catch (error) {
            console.error("Error fetching autoremove data:", error);
            return [];
        }
    };

    useEffect(() => {
        const colmns = [
            {
                name: 'Acciones',
                cell: row => (
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => handleDelete(row.domain)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-full transition-colors"
                            title="Eliminar registro"
                        >
                            {
                                deleteRefresh
                                    ? <ArrowPathIcon className="w-5 h-5" />
                                    : <TrashIcon className="w-5 h-5" />
                            }


                        </button>
                    </div>
                ),
                ignoreRowClick: true, // Evita que al hacer clic en el botón se dispare el evento de la fila
                //allowOverflow: true,
                //button: true, // Optimiza el alineamiento para botones
                width: '120px', // Un poco más de espacio para que no respiren tan justo
            },
            {
                name: 'Dominio',
                selector: row => row.domain,
                sortable: true,
                width: '450px'
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
        ];

        setColumns(colmns);
    }, []);

    const handleDelete = async (domain) => {
        try {
            setDeleteRefresh(true)
            const response = await domainsServices.deleteDomain(domain);
            setRefreshTrigger(prev => prev + 1);
            return response.data;
        } catch (error) {
            console.error("Error delete domain data:", error);
            return [];
        } finally {
            setDeleteRefresh(false)
        }
    }




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
                        Administación de dominios
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 sm:text-base">
                    </p>
                </div>

                <div className="border-t border-gray-100 px-1 py-6.5 dark:border-gray-800">
                    <div className="flex items-center gap-5">
                        <button
                            onClick={toggleModal}
                            className="inline-flex items-center gap-2 px-4 py-3 text-sm font-medium text-white transition rounded-lg bg-brand-500 shadow-theme-xs hover:bg-brand-600">
                            Agregar dominio
                        </button>

                        <button
                            onClick={toggleModalAssignDomain}
                            className="inline-flex items-center gap-2 px-4 py-3 text-sm font-medium text-white transition rounded-lg bg-green-500 shadow-theme-xs hover:bg-green-600">
                            {user?.role === "admin" ? "Asignar dominio" : "Dominios asignados"}
                        </button>
                    </div>

                    <br />

                    <ModalAdd
                        isOpen={isOpen}
                        toggleModal={toggleModal}
                        user={user}
                        setRefreshTrigger={setRefreshTrigger}
                        domainsServices={domainsServices}
                    />


                    <ModalAssignDomain
                        isOpen={isOpenAssignDomain}
                        toggleModal={toggleModalAssignDomain}
                        user={user}
                        setRefreshTrigger={setRefreshTrigger}
                        domainsServices={domainsServices}
                        userServices={userServices}
                        CanAccess={CanAccess}
                    />



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

export default Domains;