import { Outlet }        from 'react-router-dom';
import { useState }      from 'react';
import Sidebar           from './Sidebar';
import Navbar            from './Navbar';
import useWindowSize     from '../../hooks/useWindowSize';

const Layout = () => {
  const [sidebarAbierto, setSidebarAbierto] = useState(false);
  const { esMobil } = useWindowSize();

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#f5f7fa' }}>

      {/* Overlay oscuro en móvil */}
      {esMobil && sidebarAbierto && (
        <div
          onClick={() => setSidebarAbierto(false)}
          style={{
            position:   'fixed',
            inset:      0,
            background: 'rgba(0,0,0,0.5)',
            zIndex:     99
          }}
        />
      )}

      {/* Sidebar */}
      <div style={{
        position:   esMobil ? 'fixed' : 'relative',
        left:       esMobil ? (sidebarAbierto ? '0' : '-240px') : '0',
        top:        0,
        zIndex:     100,
        transition: 'left 0.3s ease',
        height:     '100vh'
      }}>
        <Sidebar onClose={() => setSidebarAbierto(false)} />
      </div>

      {/* Contenido principal */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        <Navbar onToggleSidebar={() => setSidebarAbierto(!sidebarAbierto)} />
        <main style={{ flex: 1, padding: esMobil ? '16px' : '24px', overflowY: 'auto' }}>
          <Outlet />
        </main>
      </div>

    </div>
  );
};

export default Layout;