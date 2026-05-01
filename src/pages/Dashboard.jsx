import { useState, useEffect } from 'react';
import API                     from '../api/axios';
import Loading                 from '../components/common/Loading';
import { formatMoney }         from '../helpers/format';
import {
  FaPills, FaUsers, FaCashRegister,
  FaShoppingCart, FaExclamationTriangle,
  FaClock
} from 'react-icons/fa';

const tarjetas = (data) => [
  {
    titulo: 'Productos',
    valor:   data.totalProductos,
    icono:  <FaPills size={24} />,
    color:  '#4e9af1',
    bg:     '#ebf4ff'
  },
  {
    titulo: 'Clientes',
    valor:   data.totalClientes,
    icono:  <FaUsers size={24} />,
    color:  '#48bb78',
    bg:     '#f0fff4'
  },
  {
    titulo: 'Ventas hoy',
    valor:   formatMoney(data.ventasHoy?.total || 0),
    sub:    `${data.ventasHoy?.cantidad || 0} transacciones`,
    icono:  <FaCashRegister size={24} />,
    color:  '#ed8936',
    bg:     '#fffaf0'
  },
  {
    titulo: 'Compras hoy',
    valor:   data.comprasHoy,
    icono:  <FaShoppingCart size={24} />,
    color:  '#9f7aea',
    bg:     '#faf5ff'
  },
  {
    titulo: 'Alertas stock',
    valor:   data.alertasStock,
    sub:    'Productos bajo mínimo',
    icono:  <FaExclamationTriangle size={24} />,
    color:  '#fc8181',
    bg:     '#fff5f5'
  },
  {
    titulo: 'Lotes por vencer',
    valor:   data.lotesPorVencer,
    sub:    'Próximos 30 días',
    icono:  <FaClock size={24} />,
    color:  '#f6ad55',
    bg:     '#fffaf0'
  }
];

const Dashboard = () => {
  const [datos,   setDatos]   = useState(null);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState('');

  useEffect(() => {
    const cargar = async () => {
      try {
        const { data } = await API.get('/dashboard/resumen');
        setDatos(data.data);
      } catch (err) {
        setError('Error al cargar el dashboard');
      } finally {
        setLoading(false);
      }
    };
    cargar();
  }, []);

  if (loading) return <Loading />;

  if (error) return (
    <div style={{
      background:   '#fff5f5',
      border:       '1px solid #fed7d7',
      borderRadius: '8px',
      padding:      '16px',
      color:        '#c53030'
    }}>
      {error}
    </div>
  );

  return (
    <div>
      {/* Título */}
      <div style={{ marginBottom: '24px' }}>
        <h4 style={{ margin: 0, fontWeight: 700, color: '#1a1f2e' }}>
          Dashboard
        </h4>
        <p style={{ margin: '4px 0 0', color: '#8892a4', fontSize: '14px' }}>
          Resumen general del sistema
        </p>
      </div>

      {/* Tarjetas */}
      <div style={{
        display:             'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
        gap:                 '16px'
      }}>
        {tarjetas(datos).map((t, i) => (
          <div key={i} style={{
            background:   '#fff',
            borderRadius: '12px',
            padding:      '20px',
            boxShadow:    '0 1px 4px rgba(0,0,0,0.08)',
            display:      'flex',
            alignItems:   'flex-start',
            gap:          '16px'
          }}>
            {/* Icono */}
            <div style={{
              background:   t.bg,
              color:        t.color,
              borderRadius: '10px',
              padding:      '12px',
              flexShrink:   0
            }}>
              {t.icono}
            </div>

            {/* Info */}
            <div>
              <div style={{
                fontSize:   '13px',
                color:      '#8892a4',
                marginBottom: '4px'
              }}>
                {t.titulo}
              </div>
              <div style={{
                fontSize:   '22px',
                fontWeight: 700,
                color:      '#1a1f2e',
                lineHeight: 1
              }}>
                {t.valor}
              </div>
              {t.sub && (
                <div style={{
                  fontSize:   '12px',
                  color:      '#8892a4',
                  marginTop:  '4px'
                }}>
                  {t.sub}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;