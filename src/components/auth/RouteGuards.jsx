import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

// 1. Protege rutas privadas (Dashboard)
export const PrivateRoute = () => {
  const { user, loading } = useAuth();

  if (loading) return <div>Cargando sesión...</div>;
  
  return user ? <Outlet /> : <Navigate to="/auth/login" replace />;
};

// 2. Protege rutas públicas (Login)
export const PublicRoute = () => {
  const { user, loading } = useAuth();

  if (loading) return <div>Cargando...</div>;

  return !user ? <Outlet /> : <Navigate to="/dashboard/requirements/processes" replace />;
};

// 3. Valida el acceso por ROL para RUTAS
export const RoleRoute = ({ allowedRoles }) => {
  const { user, loading } = useAuth();

  if (loading) return <div>Validando permisos...</div>;

  const hasAccess = user && allowedRoles.includes(user.role);

  return hasAccess 
    ? <Outlet /> 
    : <Navigate to="/dashboard/requirements/processes" replace />;
};

// 4. NUEVO: Valida el acceso para COMPONENTES (UI)
export const CanAccess = ({ children, allowedRoles }) => {
  const { user, loading } = useAuth();

  if (loading) return null;

  // Si tiene el rol, renderiza lo que está adentro (children), si no, nada (null)
  return user && allowedRoles.includes(user.role) ? children : null;
};