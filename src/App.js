import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import PrivateRoute  from './routes/PrivateRoute';
import RoleRoute     from './routes/RoleRoute';
import Layout        from './components/layout/Layout';
import Login         from './pages/Login';
import Dashboard     from './pages/Dashboard';
import Categorias    from './pages/categorias/Categorias';
import Proveedores   from './pages/proveedores/Proveedores';
import Productos     from './pages/productos/Productos';
import Clientes      from './pages/clientes/Clientes';
import Compras       from './pages/compras/Compras';
import Ventas        from './pages/ventas/Ventas';
import Usuarios      from './pages/usuarios/Usuarios';
import SinPermiso    from './pages/SinPermiso';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={
          <PrivateRoute>
            <Layout />
          </PrivateRoute>
        }>
          {/* Todos los roles */}
          <Route index element={<Dashboard />} />

          {/* Admin y Bodeguero */}
          <Route path="categorias" element={
            <RoleRoute roles={['admin', 'bodeguero']}>
              <Categorias />
            </RoleRoute>
          } />
          <Route path="proveedores" element={
            <RoleRoute roles={['admin', 'bodeguero']}>
              <Proveedores />
            </RoleRoute>
          } />
          <Route path="compras" element={
            <RoleRoute roles={['admin', 'bodeguero']}>
              <Compras />
            </RoleRoute>
          } />

          {/* Todos los roles */}
          <Route path="productos" element={<Productos />} />

          {/* Admin y Cajero */}
          <Route path="clientes" element={
            <RoleRoute roles={['admin', 'cajero']}>
              <Clientes />
            </RoleRoute>
          } />
          <Route path="ventas" element={
            <RoleRoute roles={['admin', 'cajero']}>
              <Ventas />
            </RoleRoute>
          } />

          {/* Solo Admin */}
          <Route path="usuarios" element={
            <RoleRoute roles={['admin']}>
              <Usuarios />
            </RoleRoute>
          } />

          {/* Sin permiso */}
          <Route path="sin-permiso" element={<SinPermiso />} />

        </Route>
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;