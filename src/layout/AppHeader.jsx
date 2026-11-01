import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const AppHeader = ({ sidebarToggle, setSidebarToggle }) => {
    const { logout, user } = useAuth();
    const [userDropdown, setUserDropdown] = useState(false);

    // Memoizamos los cálculos de fecha para que solo cambien si cambia 'user'
    const dateInfo = useMemo(() => {
        const today = new Date();
        const expirationDate = user?.expirationDate ? new Date(user.expirationDate) : null;
        
        const isExpired = expirationDate ? expirationDate < today : false;
        const diffTime = expirationDate ? expirationDate - today : 0;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        const isNearExpiration = expirationDate && diffDays <= 2;

        return {
            today,
            expirationDate,
            isExpired,
            isNearExpiration,
            isLowCredit: (user?.credits || 0) < 5
        };
    }, [user]);

    const formatDate = (date) => {
        if (!date) return 'N/A';
        return date.toLocaleDateString('es-ES', { 
            day: '2-digit', 
            month: '2-digit',
            year: 'numeric' 
        });
    };

    // Función segura para alternar el sidebar
    const handleToggle = () => {
        if (typeof setSidebarToggle === 'function') {
            setSidebarToggle(!sidebarToggle);
        }
    };

    return (
        <>
            {/* Overlay para móvil */}
            {sidebarToggle && (
                <div 
                    className="fixed inset-0 z-[9998] bg-black/50 lg:hidden"
                    onClick={() => typeof setSidebarToggle === 'function' && setSidebarToggle(false)}
                ></div>
            )}

            <header className="sticky top-0 z-[999] flex w-full border-b border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900">
                <div className="flex grow items-center justify-between px-4 py-2 lg:px-6">
                    
                    {/* LADO IZQUIERDO */}
                    <div className="flex items-center gap-3">
                        {/* Botón AHORA VISIBLE EN TODO MOMENTO */}
                        <button
                            onClick={handleToggle}
                            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                            aria-label="Toggle Sidebar"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                            </svg>
                        </button>
                        {/* Se eliminó el span de iPhantom */}
                    </div>

                    {/* LADO DERECHO */}
                    <div className="flex items-center gap-2 sm:gap-4">
                        
                        <div className="flex items-center gap-3 border-r border-gray-200 pr-3 sm:gap-4 sm:pr-4 dark:border-gray-800">
                            
                            {/* 1. Saldo */}
                            <div className="flex flex-col items-end min-w-[55px]">
                                <span className="text-[9px] uppercase text-gray-400 font-bold leading-none">Saldo</span>
                                <span className={`text-xs sm:text-sm font-bold mt-0.5 ${dateInfo.isLowCredit ? 'text-red-500 animate-pulse' : 'text-green-600 dark:text-green-400'}`}>
                                    ${Number(user?.credits || 0).toFixed(2)}
                                </span>
                            </div>

                            {/* 2. Hoy */}
                            <div className="hidden md:flex flex-col items-end min-w-[65px]">
                                <span className="text-[9px] uppercase text-gray-400 font-bold leading-none">Hoy</span>
                                <span className="text-xs sm:text-sm font-bold mt-0.5 text-gray-600 dark:text-gray-400">
                                    {formatDate(dateInfo.today)}
                                </span>
                            </div>

                            {/* 3. Vence */}
                            <div className="flex flex-col items-end min-w-[65px]">
                                <span className="text-[9px] uppercase text-gray-400 font-bold leading-none">Vence</span>
                                <span className={`text-xs sm:text-sm font-bold mt-0.5 ${
                                    dateInfo.isNearExpiration || dateInfo.isExpired 
                                    ? 'text-red-500 animate-pulse' 
                                    : 'text-gray-700 dark:text-gray-200'
                                }`}>
                                    {formatDate(dateInfo.expirationDate)}
                                </span>
                            </div>
                        </div>

                        {/* User Area */}
                        <div className="relative">
                            <button
                                onClick={() => setUserDropdown(!userDropdown)}
                                className="flex items-center group"
                            >
                                <div className="flex flex-col items-end mr-2">
                                    <span className="text-xs sm:text-sm font-semibold text-gray-800 dark:text-gray-200 leading-none">
                                        {user?.name || "Usuario"}
                                    </span>
                                    <span className="text-[10px] text-gray-500 capitalize">
                                        {user?.role === 'admin'
                                          ? 'Administrador'
                                          : 'Estandar'
                                        }

                                    </span>
                                </div>
                                
                                <div className="h-9 w-9 rounded-full bg-gradient-to-tr from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold text-xs shadow-sm group-hover:scale-105 transition-transform">
                                    {user?.name?.charAt(0) || "U"}
                                </div>
                            </button>

                            {userDropdown && (
                                <>
                                    <div className="fixed inset-0 z-10" onClick={() => setUserDropdown(false)}></div>
                                    <div className="absolute right-0 mt-3 z-20 w-60 origin-top-right rounded-xl border border-gray-200 bg-white shadow-2xl dark:border-gray-800 dark:bg-gray-900 p-2">
                                        <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-800 mb-2">
                                            <p className="text-sm font-bold text-gray-800 dark:text-white truncate">
                                                {user?.name} {user?.lastName}
                                            </p>
                                            <p className="text-xs text-gray-500 truncate">{user?.email}</p>
                                        </div>
                                        
                                        <Link 
                                            to="/dashboard/users/profile" 
                                            onClick={() => setUserDropdown(false)}
                                            className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800 transition-colors"
                                        >
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                                            Configuración de Perfil
                                        </Link>

                                        <button 
                                            onClick={logout} 
                                            className="mt-2 w-full flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-bold text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors"
                                        >
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
                                            Cerrar Sesión
                                        </button>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </header>
        </>
    );
}

export default AppHeader;