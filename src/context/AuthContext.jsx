import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios"; // Asegúrate de configurar axios con withCredentials

const AuthContext = createContext();
const url = `${window.APP_CONFIG.API_URL}auth/`;

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Verificar sesión al cargar la app (Silent Login)
  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Llamamos a tu ruta de refresh-token
        const res = await axios.post(`${url}refreshToken`, {}, { withCredentials: true });
        if (res.data.status) {
          setUser(res.data.response); // O los datos que devuelva tu API
        }
      } catch (err) {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    checkAuth();
  }, []);

  const login = (userData) => {
    setUser(userData);
    // Nota: Es mejor no guardar datos sensibles en localStorage si usas cookies
  };

  const logout = async () => {
    try {
      // No enviamos nada, el servidor lee la cookie 'refreshToken'
      await axios.post(`${url}logout`, {}, { withCredentials: true });
    } catch (err) {
      console.error("Error al invalidar sesión en servidor", err);
    } finally {
      // Siempre limpiamos el estado local para que el usuario sea redirigido
      setUser(null);
      setLoading(false);
    }
  };

  // --- NUEVA FUNCIÓN PARA ACTUALIZAR SALDO ---
  const refreshUserData = async () => {
    try {
      // Usamos el endpoint de refreshToken o uno específico de perfil
      const res = await axios.post(`${url}refreshToken`, {}, { withCredentials: true });
      if (res.data.status) {
        setUser(res.data.response); // Actualiza el estado global
      }
    } catch (err) {
      console.error("Error al refrescar datos de usuario", err);
    }
  };


  useEffect(() => {
    if (!user || !user.expirationDate) return;

    const checkExpiration = () => {
      const now = new Date();

      // 1. Creamos el objeto de la fecha de expiración
      const expDate = new Date(user.expirationDate);

      // 2. Definimos el "límite real": el inicio del día SIGUIENTE al vencimiento
      // Esto permite que todo el día de la fecha de vencimiento sea válido.
      const deadline = new Date(
        expDate.getFullYear(),
        expDate.getMonth(),
        expDate.getDate() + 1 // Sumamos un día
      );

      // Si 'ahora' ya es igual o mayor al inicio del día siguiente, cerramos sesión
      if (now >= deadline) {
        console.warn("La membresía ha vencido. Ejecutando logout...");
        logout();
      }
    };

    checkExpiration();

    // Revisar cada 10 segundos es útil si el usuario está conectado a medianoche
    const interval = setInterval(checkExpiration, 10000);

    return () => clearInterval(interval);
  }, [user]);




  return (
    <AuthContext.Provider value={{ user, login, refreshUserData, logout, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);