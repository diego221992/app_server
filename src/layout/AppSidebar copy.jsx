import { useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import logo from "../assets/images/logo/logo.svg";

const MENU_ITEMS = [
    {
        label: "Equipos",
        path: "/dashboard/requirements/processes",
        // Icono: Laptop/Monitor (Dispositivos)
        icon: (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        ),
    },
    /*{
        label: "Soporte",
        path: "/dashboard/requirements/support",
        // Icono: Auriculares con Engranaje (Soporte Técnico)
        icon: (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5zm12.93 2.93a1 1 0 011.41 0L19.586 10m-2.236-.358a1 1 0 10-1.414-1.414l-1.415 1.415a1 1 0 001.415 1.414l1.414-1.415z" />
        ),
    },*/
    {
        label: "Autoremove",
        path: "/dashboard/autoremove",
        // Icono: Logotipo de Apple
        icon: (
            <path fill="currentColor" d="M17.05 20.28c-.98.95-2.05 1.72-3.2 1.72-1.11 0-1.4-.64-2.8-.64-1.42 0-1.78.62-2.81.64-1.12.02-2.13-.74-3.14-1.72-2.05-1.99-3.64-5.61-1.59-9.14 1.02-1.75 2.82-2.86 4.79-2.89 1.5-.02 2.9.99 3.82.99s2.61-1.2 4.41-1.01c.75.03 2.87.27 4.24 2.27-.11.07-2.52 1.47-2.5 4.38.02 3.49 3.05 4.71 3.09 4.73a9.4 9.4 0 01-1.31 2.67M12.02 7.21c-.01-4.04 3.33-7.22 3.39-7.21.05 4.18-3.37 7.23-3.39 7.21Z" />
        ),
    },
    {
        label: "Pass-code",
        path: "/dashboard/passcode",
        // Icono: Teclado numérico
        icon: (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9h.01M9 17h.01M9 11h.01M12 11h.01M12 14h.01M12 17h.01M15 11h.01M15 14h.01M15 17h.01" />
        ),
    },
    {
        label: "Usuarios",
        // Icono: Grupo de personas
        icon: (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
        ),
        children: [
            { label: "Administrar", path: "/dashboard/users/manager" },
            { label: "Perfil", path: "/dashboard/users/profile" },
        ]
    },
    {
        label: "Servidor",
        path: "/dashboard/server",
        // Icono: Rack de Servidores
        icon: (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01" />
        ),
    },
    {
        label: "Dominios",
        path: "/dashboard/domains",
        // Icono: Mundo/Red
        icon: (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
        ),
    },
    {
        label: "SMS apis",
        path: "/dashboard/smsapis",
        // Icono: Braces Signal (Señal entre Corchetes)
        icon: (
            <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4M15 12h.01M18 12h.01M12 12h.01" />
            </svg>
        ),
    },
];
const AppSidebar = ({ sidebarToggle, setSidebarToggle }) => {
    const [selected, setSelected] = useState('');
    const location = useLocation();

    // Verificamos si estamos en móvil (usando Tailwind lg:breakpoint)
    // sidebarToggle en móvil significa "ABIERTO", en escritorio significa "COLAPSADO"

    return (
        <>
            {/* Backdrop para móvil: cierra el menú al tocar fuera */}
            <div
                className={`fixed inset-0 z-[9998] bg-black/50 transition-opacity lg:hidden ${sidebarToggle ? 'opacity-100 visible' : 'opacity-0 invisible'}`}
                onClick={() => setSidebarToggle(false)}
            ></div>

            <aside
                className={`fixed left-0 top-0 z-[9999] flex h-screen flex-col overflow-y-hidden border-r border-gray-200 bg-white px-5 transition-all duration-300 dark:border-gray-800 dark:bg-black lg:static lg:translate-x-0 
                ${sidebarToggle
                        ? 'translate-x-0 w-[290px] lg:w-[90px]' // Abierto en móvil / Colapsado en Desktop
                        : '-translate-x-full lg:translate-x-0 lg:w-[290px]' // Oculto en móvil / Extendido en Desktop
                    }`}
            >
                {/* Header */}
                <div className={`flex items-center gap-2 pt-8 pb-7 ${sidebarToggle ? 'lg:justify-center' : 'justify-between'}`}>
                    <Link to="/dashboard">
                        <img className="h-10 w-auto" src={logo} alt="Logo" />
                    </Link>
                </div>

                <div className="flex flex-col overflow-y-auto no-scrollbar">
                    <nav className="mt-5">
                        <h3 className="mb-4 text-xs uppercase text-gray-400">
                            {/* Mostrar texto si: (En desktop NO está colapsado) O (En móvil está abierto) */}
                            {(!sidebarToggle || (sidebarToggle && window.innerWidth < 1024)) && <span>MENU</span>}
                        </h3>

                        <ul className="flex flex-col gap-2">
                            {MENU_ITEMS.map((item) => {
                                // Detectamos si la ruta actual es hija de este menú para mantenerlo abierto al recargar
                                const isChildActive = item.children?.some(child => location.pathname.includes(child.path));
                                const showText = !sidebarToggle || window.innerWidth < 1024;

                                return (
                                    <li key={item.label}>
                                        <NavLink
                                            to={item.children ? "#" : item.path} // Si tiene hijos, no navega, solo activa el toggle
                                            onClick={(e) => {
                                                if (item.children) {
                                                    e.preventDefault(); // Solo prevenimos recarga si es un disparador de submenú
                                                    setSelected(selected === item.label ? '' : item.label);
                                                } else {
                                                    // Link simple: Cerramos cualquier submenú abierto
                                                    setSelected('');

                                                    // En móvil, cerramos el sidebar tras click
                                                    if (window.innerWidth < 1024) {
                                                        setSidebarToggle(false);
                                                    }
                                                }
                                            }}
                                            className={({ isActive }) =>
                                                `flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200 ${
                                                // Marcamos azul si la ruta coincide O si un hijo está activo O si el acordeón está abierto
                                                (isActive && !item.children) || isChildActive || (item.children && selected === item.label)
                                                    ? 'bg-blue-50 text-blue-600 dark:bg-gray-800 dark:text-white'
                                                    : 'text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-900'
                                                }`
                                            }
                                        >
                                            <svg className="shrink-0 fill-current" width="22" height="22" viewBox="0 0 24 24">
                                                {item.icon}
                                            </svg>

                                            {showText && (
                                                <>
                                                    <span className="text-sm font-medium">{item.label}</span>
                                                    {item.children && (
                                                        <svg
                                                            className={`ml-auto transition-transform duration-300 ${selected === item.label ? 'rotate-180' : ''}`}
                                                            width="18" height="18" viewBox="0 0 20 20" fill="none"
                                                        >
                                                            <path d="M4.79175 7.39584L10.0001 12.6042L15.2084 7.39585" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                                        </svg>
                                                    )}
                                                </>
                                            )}
                                        </NavLink>

                                        {/* Submenu con animación fluida sin recarga */}
                                        {item.children && showText && (
                                            <div className={`overflow-hidden transition-all duration-300 ${selected === item.label || isChildActive ? 'max-h-40 opacity-100 mt-2' : 'max-h-0 opacity-0'}`}>
                                                <ul className="flex flex-col gap-2 pl-10 border-l border-gray-100 ml-4 dark:border-gray-800">
                                                    {item.children.map((child) => (
                                                        <li key={child.path}>
                                                            <NavLink
                                                                to={child.path}
                                                                onClick={() => {
                                                                    if (window.innerWidth < 1024) setSidebarToggle(false);
                                                                }}
                                                                className={({ isActive }) =>
                                                                    `text-sm transition-colors block py-1 ${isActive
                                                                        ? 'text-blue-600 font-semibold'
                                                                        : 'text-gray-500 hover:text-blue-500 dark:text-gray-400'
                                                                    }`
                                                                }
                                                            >
                                                                {child.label}
                                                            </NavLink>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        )}
                                    </li>
                                );
                            })}
                        </ul>
                    </nav>
                </div>
            </aside>
        </>
    );
};

export default AppSidebar;