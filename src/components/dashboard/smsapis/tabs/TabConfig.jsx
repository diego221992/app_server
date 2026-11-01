import { useEffect, useState } from "react";
import { EyeIcon, TrashIcon } from '@heroicons/react/24/outline';
const TabConfig = ({
    smsApisServices,
    columns,
    setColumns,
    DataTable,
    refreshTrigger,
    setRefreshTrigger

}) => {

    const [isDeleting, setIsDeleting] = useState(null);

    const fetchTableData = async () => {
        try {
            const response = await smsApisServices.listApis();
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
                            onClick={() => handleDelete(row._id)}
                            disabled={isDeleting === row._id}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-full transition-colors disabled:opacity-50"
                            title="Eliminar registro"
                        >
                            {isDeleting === row._id ? (
                                // Icono de carga (Spinner)
                                <svg className="animate-spin h-5 w-5 text-red-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                            ) : (
                                // Icono de Papelera original
                                <TrashIcon className="w-5 h-5" />
                            )}
                        </button>
                    </div>
                ),
                ignoreRowClick: true,
                width: '120px',
            },
            {
                name: 'Nombre',
                selector: row => row.name,
                sortable: true,
                width: '200px'
            },
            {
                name: 'Descripción',
                selector: row => row.description,
                sortable: true,
                width: '400px',
                cell: row => {
                    // Creamos un estado local solo para esta celda
                    const [localValue, setLocalValue] = useState(row.description);

                    const handleBlur = async () => {
                        // Aquí podrías llamar a tu API para guardar el cambio cuando el usuario termine de escribir
                        await smsApisServices.updateValue({
                            description: localValue,
                            idApi: row.idApi
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
                name: 'Url',
                selector: row => `https://${row.urlApi}`,
                sortable: true,
                width: '250px'
            },
            {
                name: 'Tarifa',
                selector: row => row.fee, // Solo devolvemos el valor
                sortable: true,
                width: '150px',
                cell: row => {
                    // Creamos un estado local solo para esta celda
                    const [localValue, setLocalValue] = useState(row.fee);

                    const handleBlur = async () => {
                        // Aquí podrías llamar a tu API para guardar el cambio cuando el usuario termine de escribir
                        await smsApisServices.updateValue({
                            fee: localValue,
                            idApi: row.idApi
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
            }

        ];

        setColumns(colmns);
    }, []);

    const handleDelete = async (id) => {
        // Confirmación opcional
        if (!window.confirm("¿Estás seguro de eliminar esta Api?")) return;

        try {
            setIsDeleting(id); // Marcamos este ID como "en proceso"
            const response = await smsApisServices.deleteApi(id);

            if (response.status) {
                // Disparamos el refresh para actualizar la tabla
                setRefreshTrigger(prev => prev + 1);
            } else {
                setError(response.message || "No se pudo eliminar");
            }
        } catch (error) {
            console.error("Error al eliminar:", error);
            setError("Error de conexión al eliminar");
        } finally {
            setIsDeleting(null); // Limpiamos el estado al terminar
        }
    };

    return (
        <>
            <div className="space-y-5">
                <h3 className="text-lg font-medium text-gray-800 dark:text-white">Apis SMS</h3>
                <div className="grid grid-cols-1 gap-4">
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
    )

}

export default TabConfig;