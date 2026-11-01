import { useState, useEffect } from "react";
import { useAuth } from '../../../context/AuthContext';
import DataTable from "../../packages/DataTable";
import usersservices from '../../../api/http/users/Manager'
import ModalUsers from "./ModalUsers";
import FormAdd from "./form/FormAdd";
import { EyeIcon, TrashIcon, KeyIcon, ArrowPathIcon } from '@heroicons/react/24/outline'; // Asegúrate de instalar heroicons

const Manager = () => {
    const { user } = useAuth();
    const pageName = "Administrar";
    const [columns, setColumns] = useState([]);
    const [refreshTrigger, setRefreshTrigger] = useState(0);
    const [isOpen, setIsOpen] = useState(false);
    const toggleModalAdd = () => setIsOpen(!isOpen);
    const [error, setError] = useState("");
    const [deleteRefresh, setDeleteRefresh] = useState(false);

    const fetchTableData = async () => {
        try {
            const response = await usersservices.listUsers();
            return response.data;
        } catch (error) {
            console.error("Error fetching autoremove data:", error);
            return [];
        }
    };

    const handleDelete = async (username) => {
        try {
            setDeleteRefresh(true)
            console.log(username)
            setRefreshTrigger(prev => prev + 1);
            const response = await usersservices.deleteUsers(username);
            setRefreshTrigger(prev => prev + 1);
            return response.data;
        } catch (error) {
            console.error("Error delete user data:", error);
            return [];
        } finally {
            setDeleteRefresh(false)
        }
    }


    useEffect(() => {
        const colmns = [
            {
                name: 'Acciones',
                cell: row => (
                    <div className="flex items-center gap-2">
                        <button
                            onClick={async () => {
                                // 1. Solicitar el nuevo valor al usuario
                                const newPassword = window.prompt("Ingrese la nueva contraseña:");

                                // Validar que el usuario no haya cancelado o dejado vacío el campo
                                if (newPassword) {

                                    // Verificamos que la longitud sea de al menos 5 caracteres 📏
                                    if (newPassword.length < 5) {
                                        alert("La contraseña debe tener al menos 5 caracteres ⚠️");
                                        return; // Detenemos la ejecución si no cumple
                                    }

                                    // 2. Confirmación nativa antes de proceder
                                    const isConfirmed = window.confirm("¿Estás seguro de que deseas actualizar la contraseña?");

                                    if (isConfirmed) {
                                        try {
                                            // 3. Ejecutar la actualización enviando el objeto dinámico
                                            // await updateValue({ password: newPassword }, row.username);
                                            await usersservices.updateValue({
                                                username: row.username,
                                                password: newPassword
                                            })
                                            alert("Contraseña actualizada con éxito ✅");
                                        } catch (error) {
                                            alert("Error al actualizar la contraseña ❌");
                                        }
                                    }
                                }
                            }}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
                            title="Actualizar contraseña"
                        >
                            <KeyIcon className="w-5 h-5" />
                        </button>
                        <button
                            onClick={async () => {
                                if (window.confirm("¿Estás seguro de que deseas eliminar este registro?")) {
                                    {
                                        await handleDelete(row.username)
                                    }

                                }
                            }}
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
                width: '180px', // Un poco más de espacio para que no respiren tan justo
            },
            {
                name: 'Usuario',
                selector: row => row.username,
                sortable: true,
                // Eliminamos minWidth de aquí
                cell: row => (
                    <div className="min-w-[150px] font-medium text-gray-700 dark:text-gray-300 break-all py-2">
                        {row.username}
                    </div>
                ),
            },
            {
                name: 'Vencimiento',
                selector: row => row.expirationDate,
                sortable: true,
                width: '180px',
                cell: (row) => {
                    // 1. Limpiamos la fecha original para mostrarla en el input (YYYY-MM-DD)
                    const cleanDate = row.expirationDate ? row.expirationDate.substring(0, 10) : "";

                    // 2. Fecha mínima permitida (hoy)
                    const today = new Date().toISOString().split('T')[0];

                    // 3. Manejador de cambio
                    const handleChange = async (e) => {
                        const inputVal = e.target.value; // Ejemplo: "2030-03-18"

                        if (!inputVal) return;

                        // Creamos un objeto Date a partir del input
                        // Usamos las 12:00 PM para evitar problemas de saltos de zona horaria al guardar
                        const dateObj = new Date(`${inputVal}T12:00:00`);

                        // Convertimos a formato ISO completo: "2030-03-18T12:00:00.000Z"
                        // El backend usualmente acepta el sufijo 'Z' (Zulu) como equivalente a '+00:00'
                        const fullIsoDate = dateObj.toISOString();

                        console.log("Enviando al servidor:", fullIsoDate);

                        try {
                            await usersservices.updateValue({
                                username: row.username,
                                expirationDate: fullIsoDate // Enviamos el formato largo
                            });
                        } catch (error) {
                            console.error("Error al actualizar fecha:", error);
                        }
                    };

                    return (
                        <input
                            type="date"
                            defaultValue={cleanDate}
                            min={today}
                            onChange={handleChange}
                            onClick={(e) => e.target.showPicker()}
                            className="h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs focus:border-blue-500 focus:ring-3 focus:ring-blue-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 outline-none transition-all cursor-pointer"
                        />
                    );
                },
            },
            {
                name: 'Estatus',
                selector: row => row.status,
                sortable: true,
                cell: row => {
                    // Inicializamos con el valor booleano de la fila
                    const [status, setStatus] = useState(row.status);

                    const handleChange = async (e) => {
                        const newValue = e.target.value === 'true'; // Convertimos el string a booleano
                        setStatus(newValue);

                        await usersservices.updateValue({
                            username: row.username,
                            status: newValue
                        })

                    };

                    return (
                        <select
                            value={status} // Vinculamos el select al estado local
                            onChange={handleChange}
                            className="h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 outline-none transition-all focus:border-blue-500"
                        >
                            <option value="true">Activo ✅</option>
                            <option value="false">Desactivado ❌</option>
                        </select>
                    );
                },
            },
            {
                name: 'Credito',
                selector: row => row.credits, // Solo devolvemos el valor
                sortable: true,
                width: '150px',
                cell: row => {
                    // Creamos un estado local solo para esta celda
                    const [localValue, setLocalValue] = useState(row.credits);

                    const handleBlur = async () => {
                        // Aquí podrías llamar a tu API para guardar el cambio cuando el usuario termine de escribir
                        await usersservices.updateValue({
                            username: row.username,
                            credits: localValue
                        })
                    };

                    return (
                        <input
                            type="number"
                            value={localValue}
                            onChange={(e) => setLocalValue(e.target.value)}
                            onBlur={handleBlur} // Se dispara al salir del input
                            className="h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 outline-none transition-all focus:border-blue-500"
                        />
                    );
                },
            },
            {
                name: 'Nombres',
                selector: row => row.name,
                sortable: true,
                cell: row => <div className="min-w-[100px]">{row.name}</div>
            },
            {
                name: 'Apellidos',
                selector: row => row.lastName,
                sortable: true,
                cell: row => <div className="min-w-[120px]">{row.lastName}</div>
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
                        Administrar usuarios
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 sm:text-base">
                        Actualizar usuarios, eliminar o cambiar su rol.
                    </p>
                </div>

                <div className="border-t border-gray-100 px-6 py-6.5 dark:border-gray-800">
                    <div className="flex items-center gap-5">
                        <ModalUsers
                            error={error}
                            isOpen={isOpen}
                            toggleModal={toggleModalAdd}
                            title={"Agregar usuario"}
                            subTitle={"Por favor ingresa los datos del usuario que deseas agregar"}
                            contentBody={<FormAdd
                                toggleModal={toggleModalAdd}
                                setRefreshTrigger={setRefreshTrigger}
                                setError={setError}
                                usersServices={usersservices}
                            />

                            }
                        />
                        <button className="inline-flex items-center gap-2 px-4 py-3 text-sm font-medium text-white transition rounded-lg bg-brand-500 shadow-theme-xs hover:bg-brand-600"
                            onClick={toggleModalAdd}
                        > Administrar </button>

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

export default Manager;