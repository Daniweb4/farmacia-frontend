import { useState, useEffect }        from 'react';
import { Modal, Button, Table, Form, Row, Col } from 'react-bootstrap';
import API           from '../../api/axios';
import Loading       from '../../components/common/Loading';
import AlertaMensaje from '../../components/common/AlertaMensaje';
import { FaPlus, FaEdit, FaTrash } from 'react-icons/fa';

const inicial = {
  nombre: '', ruc: '', telefono: '', email: '', direccion: ''
};

const Proveedores = () => {
  const [proveedores, setProveedores] = useState([]);
  const [loading,     setLoading]     = useState(true);
  const [error,       setError]       = useState('');
  const [exito,       setExito]       = useState('');
  const [modal,       setModal]       = useState(false);
  const [modalElim,   setModalElim]   = useState(false);
  const [form,        setForm]        = useState(inicial);
  const [editando,    setEditando]    = useState(null);
  const [eliminando,  setEliminando]  = useState(null);
  const [guardando,   setGuardando]   = useState(false);

  const cargar = async () => {
    try {
      setLoading(true);
      const { data } = await API.get('/proveedores');
      setProveedores(data.data);
    } catch {
      setError('Error al cargar proveedores');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { cargar(); }, []);

  const abrirCrear = () => {
    setForm(inicial);
    setEditando(null);
    setModal(true);
  };

  const abrirEditar = (p) => {
    setForm({
      nombre:    p.nombre,
      ruc:       p.ruc       || '',
      telefono:  p.telefono  || '',
      email:     p.email     || '',
      direccion: p.direccion || ''
    });
    setEditando(p.id);
    setModal(true);
  };

  const guardar = async (e) => {
    e.preventDefault();
    setGuardando(true);
    try {
      if (editando) {
        await API.put(`/proveedores/${editando}`, form);
        setExito('Proveedor actualizado correctamente');
      } else {
        await API.post('/proveedores', form);
        setExito('Proveedor creado correctamente');
      }
      setModal(false);
      cargar();
    } catch (err) {
      setError(err.response?.data?.mensaje || 'Error al guardar');
    } finally {
      setGuardando(false);
    }
  };

  const confirmarEliminar = (p) => {
    setEliminando(p);
    setModalElim(true);
  };

  const eliminar = async () => {
    try {
      await API.delete(`/proveedores/${eliminando.id}`);
      setExito('Proveedor eliminado correctamente');
      setModalElim(false);
      cargar();
    } catch (err) {
      setError(err.response?.data?.mensaje || 'Error al eliminar');
    }
  };

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  if (loading) return <Loading />;

  return (
    <div>
      {/* Título */}
      <div style={{
        display:        'flex',
        justifyContent: 'space-between',
        alignItems:     'center',
        marginBottom:   '24px',
        flexWrap:       'wrap',
        gap:            '12px'
      }}>
        <div>
          <h4 style={{ margin: 0, fontWeight: 700, color: '#1a1f2e' }}>Proveedores</h4>
          <p style={{ margin: '4px 0 0', color: '#8892a4', fontSize: '14px' }}>
            {proveedores.length} proveedores registrados
          </p>
        </div>
        <Button
          onClick={abrirCrear}
          style={{
            background: '#4e9af1', border: 'none',
            borderRadius: '8px', padding: '8px 16px',
            display: 'flex', alignItems: 'center', gap: '8px'
          }}
        >
          <FaPlus /> Nuevo Proveedor
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
              {['#', 'Nombre', 'RUC', 'Teléfono', 'Email', 'Acciones'].map(h => (
                <th key={h} style={{ padding: '14px 20px', color: '#8892a4', fontWeight: 600, fontSize: '13px' }}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {proveedores.length === 0 ? (
              <tr>
                <td colSpan={6} style={{ textAlign: 'center', padding: '40px', color: '#8892a4' }}>
                  No hay proveedores registrados
                </td>
              </tr>
            ) : (
              proveedores.map((p, i) => (
                <tr key={p.id}>
                  <td style={{ padding: '14px 20px', color: '#8892a4' }}>{i + 1}</td>
                  <td style={{ padding: '14px 20px', fontWeight: 600, color: '#1a1f2e' }}>{p.nombre}</td>
                  <td style={{ padding: '14px 20px', color: '#8892a4' }}>{p.ruc || '—'}</td>
                  <td style={{ padding: '14px 20px', color: '#8892a4' }}>{p.telefono || '—'}</td>
                  <td style={{ padding: '14px 20px', color: '#8892a4' }}>{p.email || '—'}</td>
                  <td style={{ padding: '14px 20px' }}>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button onClick={() => abrirEditar(p)} style={{
                        background: '#ebf4ff', color: '#4e9af1',
                        border: 'none', borderRadius: '6px', padding: '6px 10px', cursor: 'pointer'
                      }}>
                        <FaEdit />
                      </button>
                      <button onClick={() => confirmarEliminar(p)} style={{
                        background: '#fff5f5', color: '#fc8181',
                        border: 'none', borderRadius: '6px', padding: '6px 10px', cursor: 'pointer'
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
      <Modal show={modal} onHide={() => setModal(false)} centered size="lg">
        <Modal.Header closeButton style={{ border: 'none', paddingBottom: 0 }}>
          <Modal.Title style={{ fontWeight: 700, fontSize: '18px' }}>
            {editando ? 'Editar Proveedor' : 'Nuevo Proveedor'}
          </Modal.Title>
        </Modal.Header>
        <Form onSubmit={guardar}>
          <Modal.Body style={{ padding: '20px 24px' }}>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label style={{ fontWeight: 600, fontSize: '13px' }}>Nombre *</Form.Label>
                  <Form.Control
                    name="nombre" value={form.nombre}
                    onChange={handleChange} required
                    placeholder="Nombre del proveedor"
                    style={{ borderRadius: '8px' }}
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label style={{ fontWeight: 600, fontSize: '13px' }}>RUC</Form.Label>
                  <Form.Control
                    name="ruc" value={form.ruc}
                    onChange={handleChange}
                    placeholder="RUC del proveedor"
                    style={{ borderRadius: '8px' }}
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label style={{ fontWeight: 600, fontSize: '13px' }}>Teléfono</Form.Label>
                  <Form.Control
                    name="telefono" value={form.telefono}
                    onChange={handleChange}
                    placeholder="Teléfono"
                    style={{ borderRadius: '8px' }}
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label style={{ fontWeight: 600, fontSize: '13px' }}>Email</Form.Label>
                  <Form.Control
                    type="email" name="email" value={form.email}
                    onChange={handleChange}
                    placeholder="correo@proveedor.com"
                    style={{ borderRadius: '8px' }}
                  />
                </Form.Group>
              </Col>
              <Col md={12}>
                <Form.Group>
                  <Form.Label style={{ fontWeight: 600, fontSize: '13px' }}>Dirección</Form.Label>
                  <Form.Control
                    as="textarea" rows={2}
                    name="direccion" value={form.direccion}
                    onChange={handleChange}
                    placeholder="Dirección del proveedor"
                    style={{ borderRadius: '8px' }}
                  />
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

      {/* Modal Eliminar */}
      <Modal show={modalElim} onHide={() => setModalElim(false)} centered>
        <Modal.Header closeButton style={{ border: 'none' }}>
          <Modal.Title style={{ fontWeight: 700, fontSize: '18px' }}>Eliminar Proveedor</Modal.Title>
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

export default Proveedores;