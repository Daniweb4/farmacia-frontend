import { Navigate } from 'react-router-dom';
import { useAuth }  from '../context/AuthContext';

const RoleRoute = ({ children, roles }) => {
  const { usuario } = useAuth();

  if (!roles.includes(usuario?.rol)) {
    return <Navigate to="/sin-permiso" />;
  }

  return children;
};

export default RoleRoute;