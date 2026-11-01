import { useState, useRef } from 'react';
import { validate } from '../../../../utils/validationHelper';

const FormAdd = ({ toggleModal, setRefreshTrigger, setError, usersServices }) => {

    const getTodayDate = () => {
        const today = new Date();
        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, '0');
        const day = String(today.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    const todayStr = getTodayDate();
    const dateInputRef = useRef(null);

    const handleInputClick = () => {
        if (dateInputRef.current && dateInputRef.current.showPicker) {
            dateInputRef.current.showPicker();
        }
    };

    // Estados de los campos
    const [isLoading, setIsLoading] = useState(false);
    const [name, setName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [idTelegram, setIdTelegram] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [expirationDate, setExpirationDate] = useState(todayStr);

    // --- ESTADO PARA EL ERROR DE PASSWORD ---
    const [passwordError, setPasswordError] = useState(null);

    const handlePasswordChange = (e) => {
        const val = e.target.value;
        setPassword(val);
        const error = validate.minLength(val, 5);
        setPasswordError(error);
    };

    // --- MANEJADOR ACTUALIZADO CON ASYNC/AWAIT Y SERVICE ---
    const handleAddUser = async (e) => {
        e.preventDefault();

        // Validar antes de enviar
        const error = validate.minLength(password, 5);
        if (error) {
            setPasswordError(error);
            return;
        }

        const data = {
            name,
            lastName,
            email,
            idTelegram,
            username,
            password,
            expirationDate
        };

        setIsLoading(true);
        setError(null); // Limpiamos errores previos

        try {
            // Llamada al servicio inyectado por props
            const response = await usersServices.addUsers(data);
            
            console.log("Usuario agregado:", response);
            toggleModal(false);
            setRefreshTrigger(prev => prev + 1);
            
        } catch (err) {
            console.error("Error en FormAdd:", err);
            // Si tu servicio devuelve un mensaje específico en el error, lo usamos
            const errorMsg = err.response?.data?.msgStatus || "Error al agregar el usuario. Intente nuevamente.";
            setError(errorMsg);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            <form onSubmit={handleAddUser} className="flex flex-col text-left">
                <div className="custom-scrollbar h-[400px] overflow-y-auto px-2 space-y-7">
                    <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2">

                        {/* Nombres */}
                        <div>
                            <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">Nombres</label>
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs focus:border-blue-500 focus:ring-3 focus:ring-blue-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 outline-none transition-all"
                                placeholder="Ingrese los nombres"
                                required
                            />
                        </div>

                        {/* Apellidos */}
                        <div>
                            <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">Apellidos</label>
                            <input
                                type="text"
                                value={lastName}
                                onChange={(e) => setLastName(e.target.value)}
                                className="h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs focus:border-blue-500 focus:ring-3 focus:ring-blue-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 outline-none transition-all"
                                placeholder="Ingrese los apellidos"
                            />
                        </div>

                        {/* Correo */}
                        <div>
                            <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">Correo</label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs focus:border-blue-500 focus:ring-3 focus:ring-blue-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 outline-none transition-all"
                                placeholder="Correo para notificaciones"
                            />
                        </div>

                        {/* ID Telegram */}
                        <div>
                            <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">ID de telegram</label>
                            <input
                                type="text"
                                value={idTelegram}
                                onChange={(e) => setIdTelegram(e.target.value)}
                                className="h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs focus:border-blue-500 focus:ring-3 focus:ring-blue-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 outline-none transition-all"
                                placeholder="ID para notificaciones"
                            />
                        </div>

                        {/* Usuario */}
                        <div>
                            <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">Usuario</label>
                            <input
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                className="h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs focus:border-blue-500 focus:ring-3 focus:ring-blue-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 outline-none transition-all"
                                placeholder="Usuario de inicio de sesión"
                                required
                            />
                        </div>

                        {/* Contraseña */}
                        <div>
                            <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">Contraseña</label>
                            <input
                                type="password"
                                value={password}
                                onChange={handlePasswordChange}
                                className={`h-11 w-full rounded-lg border bg-transparent px-4 py-2.5 text-sm shadow-theme-xs outline-none transition-all 
                                ${passwordError
                                        ? "border-red-500 focus:border-red-500 focus:ring-red-500/10 dark:border-red-500"
                                        : "border-gray-300 focus:border-blue-500 focus:ring-blue-500/10 dark:border-gray-700"
                                    } 
                                text-gray-800 dark:bg-gray-900 dark:text-white/90`}
                                placeholder="Contraseña de inicio de sesión"
                                required
                            />
                            {passwordError && (
                                <p className="text-xs text-red-500 mt-1">{passwordError}</p>
                            )}
                        </div>

                        {/* Fecha */}
                        <div>
                            <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">Fecha de vencimiento</label>
                            <input
                                ref={dateInputRef}
                                type="date"
                                value={expirationDate}
                                min={todayStr}
                                onChange={(e) => setExpirationDate(e.target.value)}
                                onClick={handleInputClick}
                                className="h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs focus:border-blue-500 focus:ring-3 focus:ring-blue-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 outline-none transition-all appearance-none"
                                required
                            />
                        </div>

                    </div>
                </div>

                {/* Botones de acción */}
                <div className="flex items-center gap-3 px-2 mt-6 lg:justify-end">
                    <button
                        onClick={() => toggleModal(false)}
                        type="button"
                        className="flex w-full justify-center rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] sm:w-auto transition-colors"
                    >
                        Cerrar
                    </button>
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="flex w-full justify-center rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-blue-700 sm:w-auto transition-colors disabled:bg-blue-400"
                    >
                        {isLoading ? "Guardando..." : "Guardar"}
                    </button>
                </div>
            </form>
        </>
    );
};

export default FormAdd;