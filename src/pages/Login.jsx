import { useState }    from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth }     from '../context/AuthContext';
import API             from '../api/axios';
import { FaPills, FaEye, FaEyeSlash } from 'react-icons/fa';

const Login = () => {
  const [form, setForm]         = useState({ email: '', password: '' });
  const [error, setError]       = useState('');
  const [loading, setLoading]   = useState(false);
  const [verPass, setVerPass]   = useState(false);

  const { login }    = useAuth();
  const navigate     = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const { data } = await API.post('/auth/login', form);
      login(data.data, data.token);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.mensaje || 'Error al iniciar sesión');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight:      '100vh',
      background:     'linear-gradient(135deg, #1a1f2e 0%, #2d3448 100%)',
      display:        'flex',
      alignItems:     'center',
      justifyContent: 'center',
      padding:        '16px'
    }}>
      <div style={{
        background:   '#fff',
        borderRadius: '16px',
        padding:      '40px 36px',
        width:        '100%',
        maxWidth:     '420px',
        boxShadow:    '0 20px 60px rgba(0,0,0,0.3)'
      }}>

        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{
            background:   '#4e9af1',
            borderRadius: '50%',
            width:        '64px',
            height:       '64px',
            display:      'flex',
            alignItems:   'center',
            justifyContent: 'center',
            margin:       '0 auto 16px'
          }}>
            <FaPills size={28} color="#fff" />
          </div>
          <h4 style={{ margin: 0, fontWeight: 700, color: '#1a1f2e' }}>
            Sistema de Farmacia
          </h4>
          <p style={{ margin: '8px 0 0', color: '#8892a4', fontSize: '14px' }}>
            Inicia sesión para continuar
          </p>
        </div>

        {/* Error */}
        {error && (
          <div style={{
            background:   '#fff5f5',
            border:       '1px solid #fed7d7',
            borderRadius: '8px',
            padding:      '12px 16px',
            marginBottom: '20px',
            color:        '#c53030',
            fontSize:     '14px'
          }}>
            {error}
          </div>
        )}

        {/* Formulario */}
        <form onSubmit={handleSubmit}>

          {/* Email */}
          <div style={{ marginBottom: '16px' }}>
            <label style={{
              display:      'block',
              marginBottom: '6px',
              fontWeight:   600,
              fontSize:     '13px',
              color:        '#1a1f2e'
            }}>
              Correo electrónico
            </label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="correo@farmacia.com"
              required
              style={{
                width:        '100%',
                padding:      '10px 14px',
                border:       '1px solid #e2e8f0',
                borderRadius: '8px',
                fontSize:     '14px',
                outline:      'none',
                boxSizing:    'border-box',
                transition:   'border 0.2s'
              }}
              onFocus={e  => e.target.style.border = '1px solid #4e9af1'}
              onBlur={e   => e.target.style.border = '1px solid #e2e8f0'}
            />
          </div>

          {/* Password */}
          <div style={{ marginBottom: '24px' }}>
            <label style={{
              display:      'block',
              marginBottom: '6px',
              fontWeight:   600,
              fontSize:     '13px',
              color:        '#1a1f2e'
            }}>
              Contraseña
            </label>
            <div style={{ position: 'relative' }}>
              <input
                type={verPass ? 'text' : 'password'}
                name="password"
                value={form.password}
                onChange={handleChange}
                placeholder="••••••••"
                required
                style={{
                  width:        '100%',
                  padding:      '10px 40px 10px 14px',
                  border:       '1px solid #e2e8f0',
                  borderRadius: '8px',
                  fontSize:     '14px',
                  outline:      'none',
                  boxSizing:    'border-box',
                  transition:   'border 0.2s'
                }}
                onFocus={e => e.target.style.border = '1px solid #4e9af1'}
                onBlur={e  => e.target.style.border = '1px solid #e2e8f0'}
              />
              <button
                type="button"
                onClick={() => setVerPass(!verPass)}
                style={{
                  position:   'absolute',
                  right:      '12px',
                  top:        '50%',
                  transform:  'translateY(-50%)',
                  background: 'none',
                  border:     'none',
                  cursor:     'pointer',
                  color:      '#8892a4',
                  padding:    0
                }}
              >
                {verPass ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>

          {/* Botón */}
          <button
            type="submit"
            disabled={loading}
            style={{
              width:        '100%',
              padding:      '12px',
              background:   loading ? '#a0c4f8' : '#4e9af1',
              color:        '#fff',
              border:       'none',
              borderRadius: '8px',
              fontSize:     '15px',
              fontWeight:   600,
              cursor:       loading ? 'not-allowed' : 'pointer',
              transition:   'background 0.2s'
            }}
          >
            {loading ? 'Iniciando sesión...' : 'Iniciar sesión'}
          </button>

        </form>
      </div>
    </div>
  );
};

export default Login;