import { useState, useEffect }                  from 'react';
import { Modal, Button, Table, Form, Row, Col } from 'react-bootstrap';
import API           from '../../api/axios';
import Loading       from '../../components/common/Loading';
import AlertaMensaje from '../../components/common/AlertaMensaje';
import { FaPlus, FaEdit, FaTrash, FaKey } from 'react-icons/fa';

const inicial = { nombre: '', email: '', password: '', rol: 'cajero' };
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
  const [modal,      setModal]      = useState(false);
  const [modalElim,  setModalElim]  = useState(false);
  const [modalPass,  setModalPass]  = useState(false);
  const [form,       setForm]       = useState(inicial);
  const [formPass,   setFormPass]   = useState(inicialPass);
  const [editando,   setEditando]   = useState(null);
  const [eliminando, setEliminando] = useState(null);
  const [cambiando,  setCambiando]  = useState(null);
  const [guardando,  setGuardando]  = useState(false);

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

  useEffect(() => {
    cargar();
  }, []);

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

  const confirmarEliminar = (u) => {
    setEliminando(u);
    setModalElim(true);
  };

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

  const handleChange     = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  const handleChangePass = (e) => setFormPass({ ...formPass, [e.target.name]: e.target.value });

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
                <th key={h} style={{ padding: '14px 20px', color: '#8892a4', fontWeight: 600, fontSize: '13px' }}>
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
                      background:   rolColor[u.rol]?.bg,
                      color:        rolColor[u.rol]?.color,
                      borderRadius: '6px', padding: '3px 10px',
                      fontSize: '12px', fontWeight: 600,
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
                      <button onClick={() => confirmarEliminar(u)} style={{
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

      {/* Modal Crear/Editar */}
      <Modal show={modal} onHide={() => setModal(false)} centered>
        <Modal.Header closeButton style={{ border: 'none', paddingBottom: 0 }}>
          <Modal.Title style={{ fontWeight: 700, fontSize: '18px' }}>
            {editando ? 'Editar Usuario' : 'Nuevo Usuario'}
          </Modal.Title>
        </Modal.Header>
        <Form onSubmit={guardar}>
          <Modal.Body style={{ padding: '20px 24px' }}>
            <Row>
              <Col md={12}>
                <Form.Group className="mb-3">
                  <Form.Label style={{ fontWeight: 600, fontSize: '13px' }}>Nombre *</Form.Label>
                  <Form.Control
                    name="nombre" value={form.nombre}
                    onChange={handleChange} required
                    placeholder="Nombre completo"
                    style={{ borderRadius: '8px' }}
                  />
                </Form.Group>
              </Col>
              <Col md={12}>
                <Form.Group className="mb-3">
                  <Form.Label style={{ fontWeight: 600, fontSize: '13px' }}>Email *</Form.Label>
                  <Form.Control
                    type="email" name="email" value={form.email}
                    onChange={handleChange} required
                    placeholder="correo@farmacia.com"
                    style={{ borderRadius: '8px' }}
                  />
                </Form.Group>
              </Col>
              {!editando && (
                <Col md={12}>
                  <Form.Group className="mb-3">
                    <Form.Label style={{ fontWeight: 600, fontSize: '13px' }}>Contraseña *</Form.Label>
                    <Form.Control
                      type="password" name="password" value={form.password}
                      onChange={handleChange} required
                      placeholder="Mínimo 6 caracteres"
                      style={{ borderRadius: '8px' }}
                    />
                  </Form.Group>
                </Col>
              )}
              <Col md={12}>
                <Form.Group>
                  <Form.Label style={{ fontWeight: 600, fontSize: '13px' }}>Rol *</Form.Label>
                  <Form.Select
                    name="rol" value={form.rol}
                    onChange={handleChange}
                    style={{ borderRadius: '8px' }}
                  >
                    <option value="cajero">Cajero</option>
                    <option value="bodeguero">Bodeguero</option>
                    <option value="admin">Admin</option>
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>
          </Modal.Body>
          <Modal.Footer style={{ border: 'none', paddingTop: 0 }}>
            <Button variant="light" onClick={() => setModal(false)} style={{ borderRadius: '8px' }}>
              Cancelar
            </Button>
            <Button type="submit" disabled={guardando} style={{
              background: '#4e9af1', border: 'none', borderRadius: '8px'
            }}>
              {guardando ? 'Guardando...' : 'Guardar'}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>

      {/* Modal Cambiar Contraseña */}
      <Modal show={modalPass} onHide={() => setModalPass(false)} centered>
        <Modal.Header closeButton style={{ border: 'none', paddingBottom: 0 }}>
          <Modal.Title style={{ fontWeight: 700, fontSize: '18px' }}>
            Cambiar Contraseña — {cambiando?.nombre}
          </Modal.Title>
        </Modal.Header>
        <Form onSubmit={guardarPassword}>
          <Modal.Body style={{ padding: '20px 24px' }}>
            <Form.Group className="mb-3">
              <Form.Label style={{ fontWeight: 600, fontSize: '13px' }}>Contraseña actual *</Form.Label>
              <Form.Control
                type="password" name="password_actual"
                value={formPass.password_actual}
                onChange={handleChangePass} required
                style={{ borderRadius: '8px' }}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label style={{ fontWeight: 600, fontSize: '13px' }}>Nueva contraseña *</Form.Label>
              <Form.Control
                type="password" name="password_nuevo"
                value={formPass.password_nuevo}
                onChange={handleChangePass} required
                style={{ borderRadius: '8px' }}
              />
            </Form.Group>
            <Form.Group>
              <Form.Label style={{ fontWeight: 600, fontSize: '13px' }}>Confirmar contraseña *</Form.Label>
              <Form.Control
                type="password" name="confirmar"
                value={formPass.confirmar}
                onChange={handleChangePass} required
                style={{ borderRadius: '8px' }}
              />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer style={{ border: 'none', paddingTop: 0 }}>
            <Button variant="light" onClick={() => setModalPass(false)} style={{ borderRadius: '8px' }}>
              Cancelar
            </Button>
            <Button type="submit" disabled={guardando} style={{
              background: '#48bb78', border: 'none', borderRadius: '8px'
            }}>
              {guardando ? 'Guardando...' : 'Cambiar Contraseña'}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>

      {/* Modal Eliminar */}
      <Modal show={modalElim} onHide={() => setModalElim(false)} centered>
        <Modal.Header closeButton style={{ border: 'none' }}>
          <Modal.Title style={{ fontWeight: 700, fontSize: '18px' }}>Eliminar Usuario</Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ padding: '0 24px 20px' }}>
          ¿Estás seguro que deseas eliminar a <strong>{eliminando?.nombre}</strong>?
        </Modal.Body>
        <Modal.Footer style={{ border: 'none', paddingTop: 0 }}>
          <Button variant="light" onClick={() => setModalElim(false)} style={{ borderRadius: '8px' }}>
            Cancelar
          </Button>
          <Button variant="danger" onClick={eliminar} style={{ borderRadius: '8px' }}>
            Eliminar
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Usuarios;