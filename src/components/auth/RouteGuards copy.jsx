import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

// 1. Protege rutas privadas (Dashboard)
export const PrivateRoute = () => {
  const { user, loading } = useAuth();

  if (loading) return <div>Cargando sesión...</div>;
  
  // Si NO hay usuario, mándalo al login
  return user ? <Outlet /> : <Navigate to="/auth/login" replace />;
};

// 2. Protege rutas públicas (Login) - Evita volver al login si ya estás dentro
export const PublicRoute = () => {
  const { user, loading } = useAuth();

  if (loading) return <div>Cargando...</div>;

  // Si YA hay usuario, mándalo al dashboard principal
  return !user ? <Outlet /> : <Navigate to="/dashboard/requirements/processes" replace />;
};