import { useState, useEffect, use } from "react";
import { useAuth } from '../../../context/AuthContext';
import DataTable from "../../packages/DataTable";
import serverServices from '../../../api/http/settings/server'
import axios from "axios";

const Server = () => {
    const { user } = useAuth();
    const pageName = "Servidor";
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [description, setDescription] = useState("");
    const [url, setUrl] = useState("");
    const [urlAutoremove, setUrlAutoremove] = useState("");
    const [tokenTelegram, setTokenTelegram] = useState("");
    const [emailServer, setEmailServer] = useState("");


    useEffect(() => {
        const fetchServer = async () => {
            try {
                const response = await serverServices.getServer();
                if (response.status) {
                    const { description, url, urlAutoremove, tokenTelegram, emailServer } = response.data;
                    setDescription(description);
                    setUrl(url);
                    setUrlAutoremove(urlAutoremove);
                    setTokenTelegram(tokenTelegram);
                    setEmailServer(emailServer);
                } else {
                    setError(response.message || "Error al cargar el servidor");
                }
            } catch (err) {
                console.error("Error al cargar el servidor:", err);
                setError("Error al cargar el servidor");
            }
        };
        fetchServer();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {

            const data = {
                description,
                url,
                urlAutoremove,
                tokenTelegram,
                emailServer
            }

            setIsLoading(true);
            const response = await serverServices.updateServer(data)
            if (response.status) {
                setError("");

            } else {
                setError(response.message || "Error al actualizar el servidor");
            }

        } catch (err) {
            console.error("Error al actualizar el servidor:", err);
            setError("Error al actualizar el servidor");
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
                        Actualizar servidor
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 sm:text-base">
                        Actualizar la información del servidor.
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
                                    <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">Descripción</label>
                                    <input
                                        type="text"
                                        value={description}
                                        onChange={(e) => setDescription(e.target.value)}
                                        className="h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs focus:border-blue-500 focus:ring-3 focus:ring-blue-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 outline-none transition-all"
                                        placeholder="Ingrese la descripción"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">URL del servidor</label>
                                    <input
                                        type="text"
                                        value={url}
                                        onChange={(e) => setUrl(e.target.value)}
                                        className="h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs focus:border-blue-500 focus:ring-3 focus:ring-blue-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 outline-none transition-all"
                                        placeholder="Ingrese la URL"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">URL del autoremove</label>
                                    <input
                                        type="text"
                                        value={urlAutoremove}
                                        onChange={(e) => setUrlAutoremove(e.target.value)}
                                        className="h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs focus:border-blue-500 focus:ring-3 focus:ring-blue-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 outline-none transition-all"
                                        placeholder="Ingrese la URL del autoremove"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">Token de Telegram</label>
                                    <input
                                        type="text"
                                        value={tokenTelegram}
                                        onChange={(e) => setTokenTelegram(e.target.value)}
                                        className="h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs focus:border-blue-500 focus:ring-3 focus:ring-blue-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 outline-none transition-all"
                                        placeholder="Ingrese el token de Telegram"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">Email del Servidor</label>
                                    <input
                                        type="email"
                                        value={emailServer}
                                        onChange={(e) => setEmailServer(e.target.value)}
                                        className="h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs focus:border-blue-500 focus:ring-3 focus:ring-blue-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 outline-none transition-all"
                                        placeholder="Ingrese el email del servidor"
                                        required
                                    />
                                </div>
                                <div>

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

export default Server;