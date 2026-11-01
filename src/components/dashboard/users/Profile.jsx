import { useState, useEffect, use } from "react";
import { useAuth } from '../../../context/AuthContext';
import DataTable from "../../packages/DataTable";
import userServices from '../../../api/http/users/Profile'
import axios from "axios";

const Profile = () => {
    const { user } = useAuth();
    const pageName = "Perfil";
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [name, setName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [idTelegram, setIdTelegram] = useState("");

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const response = await userServices.getProfile(user.username);
                if (response.status) {
                    const { name, lastName, email, idTelegram } = response.data;    
                    setName(name);
                    setLastName(lastName);
                    setEmail(email);
                    setIdTelegram(idTelegram);
                } else {
                    setError(response.message || "Error al cargar el perfil");
                }
            } catch (err) {
                console.error("Error al cargar el perfil:", err);
                setError("Error al cargar el perfil");
            }
        };
        fetchProfile();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            if (error) {
                setPasswordError(error);
                return; // Detiene el envío si hay error
            }
            const data = {
                username: user.username,
                name,
                lastName,
                email,
                idTelegram
            }
            setIsLoading(true);
            const response = await userServices.updateProfile(data)
            if (response.status) {
                setError("");

            } else {
                setError(response.message || "Error al actualizar el perfil");
            }
           
        } catch (err) {
            console.error("Error al actualizar el perfil:", err);
            setError("Error al actualizar el perfil");
        } finally {
            setIsLoading(false);
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
                        Actualizar perfil
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 sm:text-base">
                        Actualizar tus datos de perfil.
                    </p>
                </div>

                <div className="border-t border-gray-100 px-1 py-6.5 dark:border-gray-800">
                    {error && (
                        <div className="p-3 mb-4 text-sm text-white-600 bg-red-100 rounded-lg dark:bg-red-900/30 dark:text-white-400">
                            {error}
                        </div>
                    )}

                    <form className="flex flex-col text-left" onSubmit={handleSubmit}>
                        <div className="custom-scrollbar h-[400px] overflow-y-auto px-2 space-y-7">
                            <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2">
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
                                <div>
                                    <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">Apellidos</label>
                                    <input
                                        type="text"
                                        value={lastName}
                                        onChange={(e) => setLastName(e.target.value)}
                                        className="h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs focus:border-blue-500 focus:ring-3 focus:ring-blue-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 outline-none transition-all"
                                        placeholder="Ingrese los apellidos"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">Correo electrónico</label>
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs focus:border-blue-500 focus:ring-3 focus:ring-blue-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 outline-none transition-all"
                                        placeholder="Ingrese el correo electrónico"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">ID Telegram</label>
                                    <input
                                        type="text"
                                        value={idTelegram}
                                        onChange={(e) => setIdTelegram(e.target.value)}
                                        className="h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs focus:border-blue-500 focus:ring-3 focus:ring-blue-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 outline-none transition-all"
                                        placeholder="Ingrese el ID de Telegram"
                                    />
                                </div>

                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="flex w-full justify-center rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-blue-700 sm:w-auto transition-colors disabled:bg-blue-400"
                                >
                                    {isLoading ? "Guardando..." : "Guardar"}
                                </button>

                            </div>
                        </div>




                    </form>

                </div>



            </div>
        </>
    );
};

export default Profile;