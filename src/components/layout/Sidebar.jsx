import { NavLink }   from 'react-router-dom';
import {
  FaTachometerAlt, FaPills, FaBoxes,
  FaShoppingCart,  FaCashRegister, FaUsers,
  FaTruck, FaUsersCog, FaTimes
} from 'react-icons/fa';
import { useAuth }   from '../../context/AuthContext';

// ─── Menú por rol ─────────────────────────────────────────
const menuPorRol = {
  admin: [
    { path: '/',            icono: <FaTachometerAlt />, label: 'Dashboard'   },
    { path: '/productos',   icono: <FaPills />,         label: 'Productos'   },
    { path: '/categorias',  icono: <FaBoxes />,         label: 'Categorías'  },
    { path: '/proveedores', icono: <FaTruck />,         label: 'Proveedores' },
    { path: '/clientes',    icono: <FaUsers />,         label: 'Clientes'    },
    { path: '/compras',     icono: <FaShoppingCart />,  label: 'Compras'     },
    { path: '/ventas',      icono: <FaCashRegister />,  label: 'Ventas'      },
  ],
  cajero: [
    { path: '/',          icono: <FaTachometerAlt />, label: 'Dashboard' },
    { path: '/ventas',    icono: <FaCashRegister />,  label: 'Ventas'    },
    { path: '/clientes',  icono: <FaUsers />,         label: 'Clientes'  },
    { path: '/productos', icono: <FaPills />,         label: 'Productos' },
  ],
  bodeguero: [
    { path: '/',            icono: <FaTachometerAlt />, label: 'Dashboard'   },
    { path: '/productos',   icono: <FaPills />,         label: 'Productos'   },
    { path: '/categorias',  icono: <FaBoxes />,         label: 'Categorías'  },
    { path: '/proveedores', icono: <FaTruck />,         label: 'Proveedores' },
    { path: '/compras',     icono: <FaShoppingCart />,  label: 'Compras'     },
  ]
};

const Sidebar = ({ onClose }) => {
  const { usuario } = useAuth();

  // Obtener menú según rol
  const menu = menuPorRol[usuario?.rol] || menuPorRol.cajero;

  const estiloLink = ({ isActive }) => ({
    display:        'flex',
    alignItems:     'center',
    gap:            '12px',
    padding:        '12px 20px',
    color:          isActive ? '#4e9af1' : '#8892a4',
    background:     isActive ? '#2d3448' : 'transparent',
    textDecoration: 'none',
    borderLeft:     isActive ? '3px solid #4e9af1' : '3px solid transparent',
    transition:     'all 0.2s',
    fontSize:       '14px'
  });

  return (
    <div style={{
      width:         '240px',
      minHeight:     '100vh',
      background:    '#1a1f2e',
      color:         '#fff',
      display:       'flex',
      flexDirection: 'column'
    }}>

      {/* Logo + botón cerrar */}
      <div style={{
        padding:        '20px',
        borderBottom:   '1px solid #2d3448',
        display:        'flex',
        alignItems:     'center',
        justifyContent: 'space-between'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <FaPills size={28} color="#4e9af1" />
          <div>
            <div style={{ fontWeight: 700, fontSize: '15px' }}>Farmacia</div>
            <div style={{ fontSize: '11px', color: '#8892a4' }}>Sistema de Gestión</div>
          </div>
        </div>
        <button
          onClick={onClose}
          style={{
            background: 'none', border: 'none',
            color: '#8892a4', cursor: 'pointer',
            padding: '4px', display: 'flex'
          }}
        >
          <FaTimes size={18} />
        </button>
      </div>

      {/* Rol del usuario */}
      <div style={{
        padding:       '12px 20px',
        borderBottom:  '1px solid #2d3448',
        display:       'flex',
        alignItems:    'center',
        gap:           '8px'
      }}>
        <FaUsersCog size={14} color="#8892a4" />
        <span style={{
          fontSize:      '12px',
          color:         '#8892a4',
          textTransform: 'capitalize'
        }}>
          {usuario?.nombre} — {usuario?.rol}
        </span>
      </div>

      {/* Menú según rol */}
      <nav style={{ padding: '12px 0', flex: 1 }}>
        {menu.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.path === '/'}
            style={estiloLink}
            onClick={onClose}
          >
            {item.icono}
            <span>{item.label}</span>
          </NavLink>
        ))}

        {/* Sección admin — solo visible para admin */}
        {usuario?.rol === 'admin' && (
          <>
            <div style={{
              padding:       '16px 20px 8px',
              color:         '#8892a4',
              fontSize:      '11px',
              textTransform: 'uppercase',
              letterSpacing: '1px'
            }}>
              Administración
            </div>
            <NavLink
              to="/usuarios"
              style={estiloLink}
              onClick={onClose}
            >
              <FaUsersCog />
              <span>Usuarios</span>
            </NavLink>
          </>
        )}
      </nav>

      {/* Versión */}
      <div style={{
        padding:   '16px 20px',
        borderTop: '1px solid #2d3448',
        color:     '#8892a4',
        fontSize:  '12px',
        textAlign: 'center'
      }}>
        v1.0.0
      </div>
    </div>
  );
};

export default Sidebar;