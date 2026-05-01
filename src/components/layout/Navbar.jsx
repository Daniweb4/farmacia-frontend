import { FaUserCircle, FaSignOutAlt, FaBars } from 'react-icons/fa';
import { useAuth }       from '../../context/AuthContext';
import { useNavigate }   from 'react-router-dom';
import useWindowSize     from '../../hooks/useWindowSize';

const Navbar = ({ onToggleSidebar }) => {
  const { usuario, logout } = useAuth();
  const navigate            = useNavigate();
  const { esMobil }         = useWindowSize();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div style={{
      height:         '60px',
      background:     '#fff',
      borderBottom:   '1px solid #e9ecef',
      display:        'flex',
      alignItems:     'center',
      justifyContent: 'space-between',
      padding:        '0 16px',
      boxShadow:      '0 1px 4px rgba(0,0,0,0.08)',
      position:       'sticky',
      top:            0,
      zIndex:         98
    }}>

     {/* Izquierda */}
<div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
  
  {/* Botón hamburguesa SOLO en móvil */}
  {esMobil && (
    <button
      onClick={onToggleSidebar}
      style={{
        background: 'none',
        border:     'none',
        cursor:     'pointer',
        padding:    '4px',
        color:      '#1a1f2e',
        display:    'flex',
        alignItems: 'center'
      }}
    >
      <FaBars size={20} />
    </button>
  )}

  <h6 style={{ margin: 0, color: '#1a1f2e', fontWeight: 600, fontSize: '15px' }}>
    Sistema de Farmacia
  </h6>
</div>

      {/* Derecha */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <FaUserCircle size={24} color="#4e9af1" />
          {!esMobil && (
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span style={{ fontSize: '13px', fontWeight: 600, color: '#1a1f2e', lineHeight: 1.2 }}>
                {usuario?.nombre}
              </span>
              <span style={{ fontSize: '11px', color: '#8892a4', textTransform: 'capitalize' }}>
                {usuario?.rol}
              </span>
            </div>
          )}
        </div>

        <button
          onClick={handleLogout}
          style={{
            background:   'none',
            border:       '1px solid #e9ecef',
            borderRadius: '8px',
            padding:      '6px 10px',
            cursor:       'pointer',
            display:      'flex',
            alignItems:   'center',
            gap:          '6px',
            color:        '#8892a4',
            fontSize:     '13px'
          }}
        >
          <FaSignOutAlt />
          {!esMobil && <span>Salir</span>}
        </button>
      </div>
    </div>
  );
};

export default Navbar;