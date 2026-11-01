import { useEffect, useState } from "react";
import ModalAddTemplates from "../ModalAddTemplates";
import { EyeIcon, TrashIcon } from '@heroicons/react/24/outline';
const TabTemplates = ({
    smsTemplatesServices,
    error,
    setError,
    smsApisServices,
    columns,
    setColumns,
    DataTable,
    refreshTrigger,
    setRefreshTrigger,
    isLoading,
    setIsLoading
}) => {

    const [isOpen, setIsOpen] = useState(false);
    const toggleModal = () => setIsOpen(!isOpen);
    const [isDeleting, setIsDeleting] = useState(null);



    const handleDelete = async (id) => {
        // Confirmación opcional
        if (!window.confirm("¿Estás seguro de eliminar esta plantilla?")) return;

        try {
            setIsDeleting(id); // Marcamos este ID como "en proceso"
            const response = await smsTemplatesServices.deleteTemplate(id);

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

    const fetchTableData = async () => {
        try {
            const response = await smsTemplatesServices.listTemplates();
            return response.data;
        } catch (error) {
            console.error("Error fetching templates data:", error);
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
                width: '300px',
                cell: row => {
                    // Creamos un estado local solo para esta celda
                    const [localValue, setLocalValue] = useState(row.name);

                    const handleBlur = async () => {
                        // Aquí podrías llamar a tu API para guardar el cambio cuando el usuario termine de escribir
                        await smsTemplatesServices.updateValueTemplate({
                            name: localValue,
                            _id: row._id
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
                name: 'Descripción',
                selector: row => row.description,
                sortable: true,
                width: '450px',
                cell: row => {
                    const [localValue, setLocalValue] = useState(row.description);

                    const handleBlur = async () => {
                        // Aquí podrías llamar a tu API para guardar el cambio cuando el usuario termine de escribir
                        await smsTemplatesServices.updateValueTemplate({
                            description: localValue,
                            _id: row._id
                        })
                    };
                    return (
                        <div className="w-full py-3">
                            <textarea
                                value={localValue}
                                onChange={(e) => setLocalValue(e.target.value)}
                                onBlur={handleBlur}
                                rows="3"
                                placeholder="Configura el mensaje..."
                                className="h-20 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 outline-none transition-all focus:border-blue-500"
                            />
                        </div>
                    );
                }
            },
            {
                name: 'Fecha de creación',
                selector: row => row.createdAt,
                sortable: true,
                width: '250px'
            }

        ];

        setColumns(colmns);
    }, [isDeleting]);

    return (
        <>
            <div className="space-y-5">
                <h3 className="text-lg font-medium text-gray-800 dark:text-white">Plantillas SMS</h3>
                <div className="border-t border-gray-100 px-6 py-6.5 dark:border-gray-800">
                    <div className="flex items-center gap-5">

                        <button className="inline-flex items-center gap-2 px-4 py-3 text-sm font-medium text-white transition rounded-lg bg-brand-500 shadow-theme-xs hover:bg-brand-600"
                            onClick={toggleModal}
                        > Añadir </button>


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

                        <ModalAddTemplates
                            isOpen={isOpen}
                            toggleModal={toggleModal}
                            setRefreshTrigger={setRefreshTrigger}
                            smsTemplatesServices={smsTemplatesServices}
                        />


                    </div>

                </div>
            </div>
        </>
    )

}

export default TabTemplates;