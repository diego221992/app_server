import React, { useEffect, useState } from 'react';
import authServices from '../../api/http/auth/login';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import apple_logo from '../../assets/images/logo/apple_logo.svg';

const Login = () => {
    const { login } = useAuth();
    const navigate = useNavigate();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [isPreloading, setIsPreloading] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => setIsPreloading(false), 800);
        return () => clearTimeout(timer);
    }, []);

    const handleLogin = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);
        try {
            const response = await authServices.login(username, password);
            if (response && response.status) {
                login(response.response);
                navigate("/dashboard", { replace: true });
            } else {
                setError("Credenciales inválidas. Intente de nuevo.");
            }
        } catch (err) {
            setError("Error de conexión con el servidor.");
        } finally {
            setLoading(false);
        }
    };

    // Función para manejar el cambio en los inputs y limpiar el error
    const handleInputChange = (setter) => (e) => {
        if (error) setError(""); // Si hay un error, lo borramos al escribir
        setter(e.target.value);
    };

    return (
        <div className="relative min-h-screen w-full flex items-center justify-center p-4 overflow-hidden font-sans selection:bg-blue-500/30">
            
            {/* FONDO TECNOLÓGICO DINÁMICO */}
            <div className="absolute inset-0 bg-[#0a0a0c]">
                {/* Esferas de luz difuminadas (Glow effect) */}
                <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-600/20 rounded-full blur-[120px] animate-pulse"></div>
                <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-purple-600/10 rounded-full blur-[120px]"></div>
                
                {/* Patrón de puntos sutil (Grid) */}
                <div className="absolute inset-0 opacity-[0.15]" 
                     style={{ backgroundImage: `radial-gradient(#ffffff 0.5px, transparent 0.5px)`, backgroundSize: '30px 30px' }}>
                </div>
            </div>

            {/* PRELOADER */}
            {isPreloading && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#0a0a0c]">
                    <div className="relative w-16 h-16">
                        <div className="absolute inset-0 border-4 border-blue-500/20 rounded-full"></div>
                        <div className="absolute inset-0 border-4 border-t-blue-500 rounded-full animate-spin"></div>
                    </div>
                </div>
            )}

            {/* TARJETA GLASSMORPHISM */}
            <div className="relative z-10 w-full max-w-[440px] transition-all duration-700 ease-out translate-y-0 opacity-100">
                <div className="backdrop-blur-xl bg-white/[0.03] border border-white/[0.08] rounded-[40px] p-8 md:p-12 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.6)]">
                    
                    {/* LOGO Y TÍTULO */}
                    <div className="text-center mb-10">
                        {/* Contenedor del logo con resplandor para que la manzana resalte */}
                        <div className="relative inline-flex items-center justify-center w-20 h-20 mb-6 rounded-2xl bg-white/[0.08] border border-white/[0.15] shadow-[0_0_20px_rgba(255,255,255,0.1)] group transition-transform hover:scale-105 overflow-hidden">
                            {/* Brillo interno de fondo */}
                            <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent"></div>
                            
                            <img
                                src={apple_logo}
                                alt="Logo"
                                className="relative z-10 w-10 h-10 object-contain brightness-[10] contrast-[10] drop-shadow-[0_0_10px_rgba(255,255,255,0.7)]"
                            />
                        </div>
                        <h1 className="text-3xl font-bold tracking-tight text-white mb-2">
                            Unlock <span className="text-blue-500">System</span>
                        </h1>
                        <p className="text-sm text-gray-400 font-medium tracking-wide uppercase">
                            Plataforma de desbloqueo
                        </p>
                    </div>

                    {error && (
                        <div className="mb-6 animate-bounce text-[13px] font-semibold text-red-400 bg-red-500/10 border border-red-500/20 py-3 px-4 rounded-2xl text-center">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleLogin} className="space-y-5">
                        {/* INPUT USUARIO */}
                        <div className="group">
                            <label className="block text-[13px] font-bold text-gray-400 ml-4 mb-2 transition-colors group-focus-within:text-blue-400">
                                USUARIO
                            </label>
                            <div className="relative">
                                <span className="absolute inset-y-0 left-5 flex items-center text-gray-500 group-focus-within:text-blue-500 transition-colors">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                    </svg>
                                </span>
                                <input
                                    type="text"
                                    value={username}
                                    onChange={handleInputChange(setUsername)}
                                    required
                                    placeholder="Ingrese su usuario"
                                    className="w-full h-14 pl-14 pr-4 rounded-2xl bg-white/[0.05] border border-white/[0.1] text-white placeholder:text-gray-600 outline-none focus:border-blue-500/50 focus:bg-white/[0.08] focus:ring-4 focus:ring-blue-500/10 transition-all"
                                />
                            </div>
                        </div>

                        {/* INPUT PASSWORD */}
                        <div className="group">
                            <label className="block text-[13px] font-bold text-gray-400 ml-4 mb-2 transition-colors group-focus-within:text-blue-400">
                                CONTRASEÑA
                            </label>
                            <div className="relative">
                                <span className="absolute inset-y-0 left-5 flex items-center text-gray-500 group-focus-within:text-blue-500 transition-colors">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                    </svg>
                                </span>
                                <input
                                    type="password"
                                    value={password}
                                    onChange={handleInputChange(setPassword)}
                                    required
                                    placeholder="••••••••"
                                    className="w-full h-14 pl-14 pr-4 rounded-2xl bg-white/[0.05] border border-white/[0.1] text-white placeholder:text-gray-600 outline-none focus:border-blue-500/50 focus:bg-white/[0.08] focus:ring-4 focus:ring-blue-500/10 transition-all"
                                />
                            </div>
                        </div>

                        {/* BOTÓN SUBMIT */}
                        <div className="pt-4">
                            <button
                                type="submit"
                                disabled={loading}
                                className="relative overflow-hidden w-full h-14 rounded-2xl bg-blue-600 text-white font-bold text-[16px] hover:bg-blue-500 active:scale-[0.97] transition-all disabled:opacity-50 flex items-center justify-center shadow-[0_10px_25px_-5px_rgba(37,99,235,0.4)]"
                            >
                                {loading ? (
                                    <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                ) : (
                                    <span className="flex items-center gap-2 uppercase tracking-widest">
                                        Autenticar
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                        </svg>
                                    </span>
                                )}
                            </button>
                        </div>
                    </form>

                    <div className="mt-8 pt-6 border-t border-white/[0.05] text-center">
                         <p className="text-gray-500 text-xs">
                             © {new Date().getFullYear()} Unlock Tech. Todos los derechos reservados.
                         </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;