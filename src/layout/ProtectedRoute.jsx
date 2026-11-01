import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const ProtectedRoute = () => {
  const { user, loading } = useAuth();

  if (loading) return <div>Cargando sesión...</div>;
  
  if (!user) {
    return <Navigate to="/auth/login" replace />;
  }

  return <Outlet />; // Renderiza las rutas hijas si hay usuario
};