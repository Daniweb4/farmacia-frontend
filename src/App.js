import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import PrivateRoute  from './routes/PrivateRoute';
import Layout        from './components/layout/Layout';
import Login         from './pages/Login';
import Dashboard     from './pages/Dashboard';
import Categorias    from './pages/categorias/Categorias';
import Proveedores from './pages/proveedores/Proveedores';
import Productos from './pages/productos/Productos';
import Clientes from './pages/clientes/Clientes';
import Compras from './pages/compras/Compras';
import Ventas from './pages/ventas/Ventas';
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
          <Route index              element={<Dashboard />} />
          <Route path="categorias"  element={<Categorias />} />
          <Route path="proveedores" element={<Proveedores />} />
          <Route path="productos" element={<Productos />} />
          <Route path="clientes" element={<Clientes />} />
          <Route path="compras" element={<Compras />} />
           <Route path="ventas"        element={<Ventas />}      />
        </Route>
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
