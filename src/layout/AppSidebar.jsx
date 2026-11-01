import { useState, useEffect } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import logo from "../assets/images/logo/apple_logo.svg";
import { CanAccess } from '../components/auth/RouteGuards';

const MENU_ITEMS = [
    {
        label: "Equipos",
        path: "/dashboard/requirements/processes",
        icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />,
        roles: ['admin', 'standart']
    },
    {
        label: "Soporte",
        path: "/dashboard/requirements/support",
        icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M18 18h-3v-4h3.832a2 2 0 001.946-1.515l.59-2.357A11 11 0 102 12v1.5a2.5 2.5 0 005 0V12a11 11 0 005-9.141M7 14H4v4h3" />,
        roles: ['admin', 'standart']
    },
    {
        label: "Autoremove",
        path: "/dashboard/autoremove",
        icon: <path fill="currentColor" d="M17.05 20.28c-.98.95-2.05 1.72-3.2 1.72-1.11 0-1.4-.64-2.8-.64-1.42 0-1.78.62-2.81.64-1.12.02-2.13-.74-3.14-1.72-2.05-1.99-3.64-5.61-1.59-9.14 1.02-1.75 2.82-2.86 4.79-2.89 1.5-.02 2.9.99 3.82.99s2.61-1.2 4.41-1.01c.75.03 2.87.27 4.24 2.27-.11.07-2.52 1.47-2.5 4.38.02 3.49 3.05 4.71 3.09 4.73a9.4 9.4 0 01-1.31 2.67M12.02 7.21c-.01-4.04 3.33-7.22 3.39-7.21.05 4.18-3.37 7.23-3.39 7.21Z" />,
        roles: ['admin', 'standart']
    },
    {
        label: "Pass-code",
        path: "/dashboard/passcode",
        icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9h.01M9 17h.01M9 11h.01M12 11h.01M12 14h.01M12 17h.01M15 11h.01M15 14h.01M15 17h.01" />,
        roles: ['admin', 'standart']
    },
    {
        label: "Usuarios",
        icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />,
        roles: ['admin', 'standart'],
        children: [
            { label: "Administrar", path: "/dashboard/users/manager", roles: ['admin'] },
            { label: "Perfil", path: "/dashboard/users/profile", roles: ['admin', 'standart'] },
        ]
    },
    {
        label: "Servidor",
        path: "/dashboard/server",
        icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01" />,
        roles: ['admin']
    },
    {
        label: "Dominios",
        path: "/dashboard/domains",
        icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />,
        roles: ['admin', 'standart']
    },
    {
        label: "SMS apis",
        path: "/dashboard/smsapis",
        icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4M15 12h.01M18 12h.01M12 12h.01" />,
        roles: ['admin']
    },
];

const AppSidebar = ({ sidebarToggle, setSidebarToggle }) => {
    const [selected, setSelected] = useState('');
    const [isMobile, setIsMobile] = useState(false);
    const location = useLocation();

    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth < 1024);
        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    useEffect(() => {
        const activeParent = MENU_ITEMS.find(item =>
            item.children?.some(child => child.path === location.pathname)
        );
        if (activeParent) setSelected(activeParent.label);
        else setSelected('');

        if (isMobile && typeof setSidebarToggle === 'function') {
            setSidebarToggle(false);
        }
    }, [location.pathname, isMobile, setSidebarToggle]);

    const showText = !sidebarToggle || isMobile;

    const itemBaseClass = "group flex items-center gap-3 px-4 py-2.5 rounded-2xl transition-all duration-300 active:scale-[0.97]";
    const activeClass = "bg-gradient-to-br from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-200/50";
    const inactiveClass = "text-slate-500 hover:bg-white hover:text-blue-600 hover:shadow-sm";

    return (
        <>
            <div
                className={`fixed inset-0 z-[9998] bg-slate-900/10 backdrop-blur-md transition-opacity lg:hidden ${sidebarToggle ? 'opacity-100 visible' : 'opacity-0 invisible'}`}
                onClick={() => typeof setSidebarToggle === 'function' && setSidebarToggle(false)}
            />

            <aside
                className={`fixed left-0 top-0 z-[9999] flex h-screen flex-col border-r border-slate-200/50 transition-all duration-500 lg:static lg:translate-x-0 
                bg-gradient-to-b from-blue-50/50 via-white to-slate-50/80 px-4
                ${sidebarToggle
                        ? 'translate-x-0 w-[280px] lg:w-[105px]'
                        : '-translate-x-full lg:translate-x-0 lg:w-[280px]'
                    }`}
            >
                <div className={`flex items-center justify-center pt-10 pb-8 ${!sidebarToggle || isMobile ? 'px-2' : ''}`}>
                    <Link
                        to="/dashboard/requirements/processes"
                        className="transition-all hover:opacity-80 active:scale-95 flex justify-center items-center"
                    >
                        <img
                            className="h-20 w-auto object-contain"
                            src={logo}
                            alt="Logo"
                        />
                    </Link>
                </div>

                <div className="flex flex-col overflow-y-auto no-scrollbar grow">
                    <nav className="mt-4">
                        <h3 className="px-4 mb-4 text-[11px] font-bold uppercase tracking-[1.5px] text-slate-400/70">
                            {showText && <span>Dashboard</span>}
                        </h3>

                        <ul className="flex flex-col gap-2">
                            {MENU_ITEMS.map((item) => {
                                const isChildActive = item.children?.some(child => location.pathname === child.path);
                                const isExpanded = selected === item.label;

                                return (
                                    <CanAccess key={item.label} allowedRoles={item.roles}>
                                        <li>
                                            {item.children ? (
                                                <button
                                                    onClick={() => setSelected(isExpanded ? '' : item.label)}
                                                    className={`${itemBaseClass} w-full ${isChildActive || isExpanded ? 'bg-white shadow-sm text-blue-600' : inactiveClass}`}
                                                >
                                                    <svg className={`shrink-0 transition-colors ${isChildActive || isExpanded ? 'text-blue-600' : 'text-slate-400 group-hover:text-blue-500'}`} width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                                        {item.icon}
                                                    </svg>
                                                    {showText && (
                                                        <>
                                                            <span className="text-sm font-bold grow text-left">{item.label}</span>
                                                            <svg className={`ml-auto transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`} width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6" /></svg>
                                                        </>
                                                    )}
                                                </button>
                                            ) : (
                                                <NavLink
                                                    to={item.path}
                                                    className={({ isActive }) => `${itemBaseClass} ${isActive ? activeClass : inactiveClass}`}
                                                >
                                                    {({ isActive }) => (
                                                        <>
                                                            <svg className={`shrink-0 ${isActive ? 'text-white' : 'text-slate-400 group-hover:text-blue-500'}`} width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                                                {item.icon}
                                                            </svg>
                                                            {showText && <span className="text-sm font-bold">{item.label}</span>}
                                                        </>
                                                    )}
                                                </NavLink>
                                            )}

                                            {item.children && showText && (
                                                <div className={`overflow-hidden transition-all duration-300 ease-in-out ${isExpanded ? 'max-h-40 opacity-100 mt-2 mb-2' : 'max-h-0 opacity-0'}`}>
                                                    <ul className="flex flex-col gap-1 ml-9 pl-4 border-l-2 border-blue-50">
                                                        {item.children.map((child) => (
                                                            <CanAccess key={child.path} allowedRoles={child.roles}>
                                                                <li>
                                                                    <NavLink
                                                                        to={child.path}
                                                                        className={({ isActive }) =>
                                                                            `text-[13px] block py-2 px-3 rounded-xl transition-all ${isActive
                                                                                ? 'text-blue-600 bg-blue-50 font-bold'
                                                                                : 'text-slate-500 hover:text-blue-600 hover:bg-white hover:translate-x-1'
                                                                            }`
                                                                        }
                                                                    >
                                                                        {child.label}
                                                                    </NavLink>
                                                                </li>
                                                            </CanAccess>
                                                        ))}
                                                    </ul>
                                                </div>
                                            )}
                                        </li>
                                    </CanAccess>
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