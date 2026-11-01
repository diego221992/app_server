const EditableCell = ({ initialValue, row, field, type, smsApisServices }) => {
    const [value, setValue] = useState(initialValue);
    const [isSaving, setIsSaving] = useState(false);

    const handleUpdate = async () => {
        if (value === initialValue) return; // No guardar si no cambió

        setIsSaving(true);
        try {
            await smsApisServices.updateValue({
                idApi: row.idApi || row._id, // Asegúrate de usar el ID correcto
                [field]: value
            });
            // Opcional: mostrar un check de éxito temporal
        } catch (error) {
            console.error("Error al actualizar:", error);
            setValue(initialValue); // Revertir si falla
        } finally {
            setIsSaving(false);
        }
    };

    if (type === "textarea") {
        return (
            <textarea
                value={value}
                onChange={(e) => setValue(e.target.value)}
                onBlur={handleUpdate}
                rows="2"
                className={`w-full my-2 rounded-xl border border-gray-200 bg-gray-50/50 p-3 text-sm text-gray-800 outline-none transition-all focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/5 dark:border-gray-700 dark:bg-gray-900 dark:text-white resize-none scrollbar-hide ${isSaving ? 'opacity-50' : ''}`}
                placeholder="Escribe el mensaje aquí..."
            />
        );
    }

    return (
        <input
            type="text"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onBlur={handleUpdate}
            className={`h-10 w-full rounded-lg border border-gray-200 bg-gray-50/50 px-3 text-sm text-gray-800 outline-none transition-all focus:border-blue-500 focus:bg-white dark:border-gray-700 dark:bg-gray-900 dark:text-white ${isSaving ? 'opacity-50' : ''}`}
        />
    );
};