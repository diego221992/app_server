import { useState, useEffect, use } from "react";
import { useAuth } from '../../../context/AuthContext';
import DataTable from "../../packages/DataTable";
import ModalAdd from "./ModalAdd";
import ModalCall from "./ModalCall";
import ModalCredentials from "./ModalCredentials";
import ModalDetails from "./ModalDetails";
import passcodeServices from '../../../api/http/passcode/passcode';
import { EyeIcon, TrashIcon, PhoneIcon, PhoneArrowUpRightIcon } from '@heroicons/react/24/outline';
import { CanAccess } from '../../auth/RouteGuards';

const PassCode = () => {
    const { user, refreshUserData } = useAuth();
    const pageName = "Passcode";
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [columns, setColumns] = useState([]);
    const [refreshTrigger, setRefreshTrigger] = useState(0);

    const [isOpen, setIsOpen] = useState(false);
    const [isOpenCall, setIsOpenCall] = useState(false);
    const [isOpenTwilio, setIsOpenTwilio] = useState(false);
    const [isOpenDetails, setIsOpenDetails] = useState(false);
    const toggleModal = () => setIsOpen(!isOpen);
    const toggleModalCall = () => setIsOpenCall(!isOpenCall);
    const toggleModalTwilio = () => setIsOpenTwilio(!isOpenTwilio);
    const toggleModalDetails = () => setIsOpenDetails(!isOpenDetails);

    const [phoneClient, setPhoneClient] = useState(0);
    const [phoneDetail, setPhoneDetail] = useState("")


    const fetchTableDetails = async (data) => {
        try {
            const response = await passcodeServices.listObtained(data);
           // console.log(response)
            return response.data;
        } catch (error) {
            console.error("Error fetching support data:", error);
            return [];
        }
    };



    const fetchTableData = async () => {
        try {
            const response = await passcodeServices.listProcesses(user.username);
            return response.data;
        } catch (error) {
            console.error("Error fetching autoremove data:", error);
            return [];
        }
    };


    const handleDelete = async (phone, username) => {
        if (window.confirm("¿Estás seguro de que deseas eliminar este proceso?")) {
            try {
                const response = await passcodeServices.deletePasscode({phone, username});
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

    useEffect(() => {
        const colmns = [
            {
                name: 'Acciones',
                cell: row => (
                    <div className="flex items-center gap-2">
                        {/* Botón Ver (Ojo) */}


                        <button
                            onClick={() => {
                                toggleModalCall()
                                setPhoneClient(row.phone || 0);

                            }}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
                            title="Llamadas"
                        >
                            <PhoneArrowUpRightIcon className="w-5 h-5" />
                        </button>
                        <button
                            onClick={() => {
                                toggleModalDetails()
                                setPhoneDetail(row.phone);
                                //console.log(row.phone)
                            }}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
                            title="Ver detalles"
                        >
                            <EyeIcon className="w-5 h-5" />
                        </button>
                        <button
                            onClick={() => {
                                handleDelete(row.phone, row.username)
                            }}
                            className="p-2 text-red-600 hover:bg-blue-50 rounded-full transition-colors"
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
            {
                name: 'ID',
                selector: row => row.linkCode,
                sortable: true,
                width: '80px',
            },
            {
                name: 'Estado',
                cell: row => (<span className={`px-2 py-1 text-xs font-medium rounded-full ${row.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    {row.status ? 'Completado' : 'En proceso'}
                </span>
                ),
                sortable: true,
                width: '130px',
            },
            {
                name: 'Cliente',
                selector: row => row.customer,
                sortable: true,
                width: '200px'
            },
            {
                name: 'Nombre de la víctima',
                selector: row => row.victimName,
                sortable: true,
                width: '200px'
            },
            {
                name: 'Número de teléfono',
                selector: row => row.phone,
                sortable: true,
                width: '200px'
            },
            {
                name: 'Dispositivo',
                selector: row => row.device,
                sortable: true,
                width: '200px'
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
                        Procesos passcode
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 sm:text-base">
                    </p>
                </div>

                <div className="border-t border-gray-100 px-1 py-6.5 dark:border-gray-800">
                    <div className="flex items-center gap-5">
                        <button
                            onClick={toggleModal}
                            className="inline-flex items-center gap-2 px-4 py-3 text-sm font-medium text-white transition rounded-lg bg-brand-500 shadow-theme-xs hover:bg-brand-600">
                            Agregar requerimiento
                        </button>
                        <CanAccess allowedRoles={['admin']}>
                            <button
                                onClick={toggleModalTwilio}
                                className="inline-flex items-center gap-2 px-4 py-3 text-sm font-medium text-white transition rounded-lg bg-green-500 shadow-theme-xs hover:bg-brand-600">
                                Credenciales
                            </button>
                        </CanAccess>
                    </div>
                    <br />

                    <ModalAdd
                        isOpen={isOpen}
                        toggleModal={toggleModal}
                        user={user}
                        setRefreshTrigger={setRefreshTrigger}
                        passcodeServices={passcodeServices}
                    />

                    <ModalCredentials
                        isOpen={isOpenTwilio}
                        toggleModal={toggleModalTwilio}
                        user={user}
                        setRefreshTrigger={setRefreshTrigger}
                        passcodeServices={passcodeServices}
                    />
                    {phoneClient && (
                        <ModalCall
                            isOpen={isOpenCall}
                            toggleModal={toggleModalCall}
                            user={user}
                            setRefreshTrigger={setRefreshTrigger}
                            passcodeServices={passcodeServices}
                            phoneClient={phoneClient}
                            refreshUserData={refreshUserData}
                        />
                    )}

                    {phoneDetail != "" && (
                        <ModalDetails
                            isOpen={isOpenDetails}
                            setIsOpen={setIsOpenDetails}
                            toggleModal={toggleModalDetails}
                            user={user}
                            setRefreshTrigger={setRefreshTrigger}
                            phoneDetail={phoneDetail}
                            setPhoneDetail={setPhoneDetail}
                            fetchTableDetails={fetchTableDetails}
                        />
                    )}



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

export default PassCode;