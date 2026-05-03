import { useNavigate } from 'react-router-dom';
import { FaLock }      from 'react-icons/fa';

const SinPermiso = () => {
  const navigate = useNavigate();

  return (
    <div style={{
      display:        'flex',
      flexDirection:  'column',
      alignItems:     'center',
      justifyContent: 'center',
      minHeight:      '60vh',
      gap:            '16px'
    }}>
      <div style={{
        background:   '#fff5f5',
        borderRadius: '50%',
        width:        '80px',
        height:       '80px',
        display:      'flex',
        alignItems:   'center',
        justifyContent: 'center'
      }}>
        <FaLock size={32} color="#fc8181" />
      </div>

      <h4 style={{ margin: 0, fontWeight: 700, color: '#1a1f2e' }}>
        Sin permiso
      </h4>

      <p style={{ margin: 0, color: '#8892a4', textAlign: 'center' }}>
        No tienes permiso para acceder a esta página.
      </p>

      <button
        onClick={() => navigate('/')}
        style={{
          background:   '#4e9af1',
          color:        '#fff',
          border:       'none',
          borderRadius: '8px',
          padding:      '10px 24px',
          cursor:       'pointer',
          fontWeight:   600
        }}
      >
        Volver al Dashboard
      </button>
    </div>
  );
};

export default SinPermiso;