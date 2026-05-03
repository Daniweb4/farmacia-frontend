import { useState, useEffect }  from 'react';
import { Button, Table }        from 'react-bootstrap';
import API                      from '../../api/axios';
import Loading                  from '../../components/common/Loading';
import AlertaMensaje             from '../../components/common/AlertaMensaje';
import ModalUsuario              from './ModalUsuario';
import ModalPassword             from './ModalPassword';
import ModalEliminarUsuario      from './ModalEliminarUsuario';
import { FaPlus, FaEdit, FaTrash, FaKey } from 'react-icons/fa';

const inicial     = { nombre: '', email: '', password: '', rol: 'cajero' };
const inicialPass = { password_actual: '', password_nuevo: '', confirmar: '' };

const rolColor = {
  admin:     { bg: '#ebf4ff', color: '#4e9af1' },
  cajero:    { bg: '#f0fff4', color: '#48bb78' },
  bodeguero: { bg: '#faf5ff', color: '#9f7aea' }
};

const Usuarios = () => {
  const [usuarios,   setUsuarios]   = useState([]);
  const [loading,    setLoading]    = useState(true);
  const [error,      setError]      = useState('');
  const [exito,      setExito]      = useState('');

  // Modales
  const [modal,      setModal]      = useState(false);
  const [modalElim,  setModalElim]  = useState(false);
  const [modalPass,  setModalPass]  = useState(false);

  // Forms
  const [form,       setForm]       = useState(inicial);
  const [formPass,   setFormPass]   = useState(inicialPass);

  // Seleccionados
  const [editando,   setEditando]   = useState(null);
  const [eliminando, setEliminando] = useState(null);
  const [cambiando,  setCambiando]  = useState(null);
  const [guardando,  setGuardando]  = useState(false);

  // ─── Cargar ────────────────────────────────────────────
  const cargar = async () => {
    try {
      setLoading(true);
      const { data } = await API.get('/usuarios');
      setUsuarios(data.data);
    } catch {
      setError('Error al cargar usuarios');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { cargar(); }, []);

  // ─── Abrir modales ─────────────────────────────────────
  const abrirCrear = () => {
    setForm(inicial);
    setEditando(null);
    setModal(true);
  };

  const abrirEditar = (u) => {
    setForm({ nombre: u.nombre, email: u.email, password: '', rol: u.rol });
    setEditando(u.id);
    setModal(true);
  };

  const abrirPassword = (u) => {
    setFormPass(inicialPass);
    setCambiando(u);
    setModalPass(true);
  };

  // ─── Guardar usuario ───────────────────────────────────
  const guardar = async (e) => {
    e.preventDefault();
    setGuardando(true);
    try {
      if (editando) {
        await API.put(`/usuarios/${editando}`, {
          nombre: form.nombre,
          email:  form.email,
          rol:    form.rol
        });
        setExito('Usuario actualizado correctamente');
      } else {
        await API.post('/usuarios', form);
        setExito('Usuario creado correctamente');
      }
      setModal(false);
      cargar();
    } catch (err) {
      setError(err.response?.data?.mensaje || 'Error al guardar');
    } finally {
      setGuardando(false);
    }
  };

  // ─── Cambiar contraseña ────────────────────────────────
  const guardarPassword = async (e) => {
    e.preventDefault();
    if (formPass.password_nuevo !== formPass.confirmar) {
      setError('Las contraseñas no coinciden');
      return;
    }
    setGuardando(true);
    try {
      await API.patch(`/usuarios/${cambiando.id}/password`, {
        password_actual: formPass.password_actual,
        password_nuevo:  formPass.password_nuevo
      });
      setExito('Contraseña actualizada correctamente');
      setModalPass(false);
    } catch (err) {
      setError(err.response?.data?.mensaje || 'Error al cambiar contraseña');
    } finally {
      setGuardando(false);
    }
  };

  // ─── Eliminar ──────────────────────────────────────────
  const eliminar = async () => {
    try {
      await API.delete(`/usuarios/${eliminando.id}`);
      setExito('Usuario eliminado correctamente');
      setModalElim(false);
      cargar();
    } catch (err) {
      setError(err.response?.data?.mensaje || 'Error al eliminar');
    }
  };

  if (loading) return <Loading />;

  return (
    <div>
      {/* Título */}
      <div style={{
        display: 'flex', justifyContent: 'space-between',
        alignItems: 'center', marginBottom: '24px',
        flexWrap: 'wrap', gap: '12px'
      }}>
        <div>
          <h4 style={{ margin: 0, fontWeight: 700, color: '#1a1f2e' }}>Usuarios</h4>
          <p style={{ margin: '4px 0 0', color: '#8892a4', fontSize: '14px' }}>
            {usuarios.length} usuarios registrados
          </p>
        </div>
        <Button onClick={abrirCrear} style={{
          background: '#4e9af1', border: 'none',
          borderRadius: '8px', padding: '8px 16px',
          display: 'flex', alignItems: 'center', gap: '8px'
        }}>
          <FaPlus /> Nuevo Usuario
        </Button>
      </div>

      <AlertaMensaje tipo="danger"  mensaje={error} onClose={() => setError('')} />
      <AlertaMensaje tipo="success" mensaje={exito} onClose={() => setExito('')} />

      {/* Tabla */}
      <div style={{
        background: '#fff', borderRadius: '12px',
        boxShadow: '0 1px 4px rgba(0,0,0,0.08)', overflow: 'hidden'
      }}>
        <Table hover responsive style={{ margin: 0 }}>
          <thead style={{ background: '#f8fafc' }}>
            <tr>
              {['#', 'Nombre', 'Email', 'Rol', 'Acciones'].map(h => (
                <th key={h} style={{
                  padding: '14px 20px', color: '#8892a4',
                  fontWeight: 600, fontSize: '13px'
                }}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {usuarios.length === 0 ? (
              <tr>
                <td colSpan={5} style={{ textAlign: 'center', padding: '40px', color: '#8892a4' }}>
                  No hay usuarios registrados
                </td>
              </tr>
            ) : (
              usuarios.map((u, i) => (
                <tr key={u.id}>
                  <td style={{ padding: '14px 20px', color: '#8892a4' }}>{i + 1}</td>
                  <td style={{ padding: '14px 20px', fontWeight: 600, color: '#1a1f2e' }}>{u.nombre}</td>
                  <td style={{ padding: '14px 20px', color: '#8892a4' }}>{u.email}</td>
                  <td style={{ padding: '14px 20px' }}>
                    <span style={{
                      background:    rolColor[u.rol]?.bg,
                      color:         rolColor[u.rol]?.color,
                      borderRadius:  '6px', padding: '3px 10px',
                      fontSize:      '12px', fontWeight: 600,
                      textTransform: 'capitalize'
                    }}>
                      {u.rol}
                    </span>
                  </td>
                  <td style={{ padding: '14px 20px' }}>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button onClick={() => abrirEditar(u)} style={{
                        background: '#ebf4ff', color: '#4e9af1',
                        border: 'none', borderRadius: '6px',
                        padding: '6px 10px', cursor: 'pointer'
                      }}>
                        <FaEdit />
                      </button>
                      <button onClick={() => abrirPassword(u)} style={{
                        background: '#f0fff4', color: '#48bb78',
                        border: 'none', borderRadius: '6px',
                        padding: '6px 10px', cursor: 'pointer'
                      }}>
                        <FaKey />
                      </button>
                      <button onClick={() => { setEliminando(u); setModalElim(true); }} style={{
                        background: '#fff5f5', color: '#fc8181',
                        border: 'none', borderRadius: '6px',
                        padding: '6px 10px', cursor: 'pointer'
                      }}>
                        <FaTrash />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </Table>
      </div>

      {/* Modales */}
      <ModalUsuario
        show={modal}
        onHide={() => setModal(false)}
        form={form}
        onChange={e => setForm({ ...form, [e.target.name]: e.target.value })}
        onSubmit={guardar}
        editando={editando}
        guardando={guardando}
      />

      <ModalPassword
        show={modalPass}
        onHide={() => setModalPass(false)}
        form={formPass}
        onChange={e => setFormPass({ ...formPass, [e.target.name]: e.target.value })}
        onSubmit={guardarPassword}
        usuario={cambiando}
        guardando={guardando}
      />

      <ModalEliminarUsuario
        show={modalElim}
        onHide={() => setModalElim(false)}
        usuario={eliminando}
        onEliminar={eliminar}
      />
    </div>
  );
};

export default Usuarios;