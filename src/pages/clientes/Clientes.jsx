import { useState, useEffect }                  from 'react';
import { Modal, Button, Table, Form, Row, Col } from 'react-bootstrap';
import API           from '../../api/axios';
import Loading       from '../../components/common/Loading';
import AlertaMensaje from '../../components/common/AlertaMensaje';
import { FaPlus, FaEdit, FaTrash, FaSearch } from 'react-icons/fa';

const inicial = {
  nombre: '', cedula_ruc: '', telefono: '',
  email: '', direccion: '', tipo: 'natural'
};

const Clientes = () => {
  const [clientes,   setClientes]   = useState([]);
  const [loading,    setLoading]    = useState(true);
  const [error,      setError]      = useState('');
  const [exito,      setExito]      = useState('');
  const [buscar,     setBuscar]     = useState('');
  const [modal,      setModal]      = useState(false);
  const [modalElim,  setModalElim]  = useState(false);
  const [form,       setForm]       = useState(inicial);
  const [editando,   setEditando]   = useState(null);
  const [eliminando, setEliminando] = useState(null);
  const [guardando,  setGuardando]  = useState(false);

  const cargar = async (b = buscar) => {
    try {
      setLoading(true);
      const params = {};
      if (b) params.buscar = b;
      const { data } = await API.get('/clientes', { params });
      setClientes(data.data);
    } catch {
      setError('Error al cargar clientes');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargar();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleBuscar = (e) => {
    e.preventDefault();
    cargar(buscar);
  };

  const abrirCrear = () => {
    setForm(inicial);
    setEditando(null);
    setModal(true);
  };

  const abrirEditar = (c) => {
    setForm({
      nombre:     c.nombre,
      cedula_ruc: c.cedula_ruc || '',
      telefono:   c.telefono   || '',
      email:      c.email      || '',
      direccion:  c.direccion  || '',
      tipo:       c.tipo
    });
    setEditando(c.id);
    setModal(true);
  };

  const guardar = async (e) => {
    e.preventDefault();
    setGuardando(true);
    try {
      if (editando) {
        await API.put(`/clientes/${editando}`, form);
        setExito('Cliente actualizado correctamente');
      } else {
        await API.post('/clientes', form);
        setExito('Cliente creado correctamente');
      }
      setModal(false);
      cargar();
    } catch (err) {
      setError(err.response?.data?.mensaje || 'Error al guardar');
    } finally {
      setGuardando(false);
    }
  };

  const confirmarEliminar = (c) => {
    setEliminando(c);
    setModalElim(true);
  };

  const eliminar = async () => {
    try {
      await API.delete(`/clientes/${eliminando.id}`);
      setExito('Cliente eliminado correctamente');
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
        display: 'flex', justifyContent: 'space-between',
        alignItems: 'center', marginBottom: '24px',
        flexWrap: 'wrap', gap: '12px'
      }}>
        <div>
          <h4 style={{ margin: 0, fontWeight: 700, color: '#1a1f2e' }}>Clientes</h4>
          <p style={{ margin: '4px 0 0', color: '#8892a4', fontSize: '14px' }}>
            {clientes.length} clientes registrados
          </p>
        </div>
        <Button onClick={abrirCrear} style={{
          background: '#4e9af1', border: 'none',
          borderRadius: '8px', padding: '8px 16px',
          display: 'flex', alignItems: 'center', gap: '8px'
        }}>
          <FaPlus /> Nuevo Cliente
        </Button>
      </div>

      <AlertaMensaje tipo="danger"  mensaje={error} onClose={() => setError('')} />
      <AlertaMensaje tipo="success" mensaje={exito} onClose={() => setExito('')} />

      {/* Buscador */}
      <div style={{
        background: '#fff', borderRadius: '12px',
        padding: '16px 20px', marginBottom: '16px',
        boxShadow: '0 1px 4px rgba(0,0,0,0.08)'
      }}>
        <Form onSubmit={handleBuscar}>
          <Row className="g-2 align-items-end">
            <Col md={8}>
              <Form.Label style={{ fontWeight: 600, fontSize: '13px' }}>Buscar</Form.Label>
              <div style={{ position: 'relative' }}>
                <Form.Control
                  value={buscar}
                  onChange={e => setBuscar(e.target.value)}
                  placeholder="Nombre o cédula/RUC..."
                  style={{ borderRadius: '8px', paddingLeft: '36px' }}
                />
                <FaSearch style={{
                  position: 'absolute', left: '12px',
                  top: '50%', transform: 'translateY(-50%)',
                  color: '#8892a4'
                }} />
              </div>
            </Col>
            <Col md={4}>
              <div style={{ display: 'flex', gap: '8px' }}>
                <Button type="submit" style={{
                  background: '#4e9af1', border: 'none',
                  borderRadius: '8px', flex: 1
                }}>
                  Buscar
                </Button>
                <Button variant="light" onClick={() => {
                  setBuscar(''); cargar('');
                }} style={{ borderRadius: '8px' }}>
                  Limpiar
                </Button>
              </div>
            </Col>
          </Row>
        </Form>
      </div>

      {/* Tabla */}
      <div style={{
        background: '#fff', borderRadius: '12px',
        boxShadow: '0 1px 4px rgba(0,0,0,0.08)', overflow: 'hidden'
      }}>
        <Table hover responsive style={{ margin: 0 }}>
          <thead style={{ background: '#f8fafc' }}>
            <tr>
              {['#', 'Nombre', 'Cédula/RUC', 'Teléfono', 'Tipo', 'Acciones'].map(h => (
                <th key={h} style={{ padding: '14px 20px', color: '#8892a4', fontWeight: 600, fontSize: '13px' }}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {clientes.length === 0 ? (
              <tr>
                <td colSpan={6} style={{ textAlign: 'center', padding: '40px', color: '#8892a4' }}>
                  No hay clientes registrados
                </td>
              </tr>
            ) : (
              clientes.map((c, i) => (
                <tr key={c.id}>
                  <td style={{ padding: '14px 20px', color: '#8892a4' }}>{i + 1}</td>
                  <td style={{ padding: '14px 20px', fontWeight: 600, color: '#1a1f2e' }}>{c.nombre}</td>
                  <td style={{ padding: '14px 20px', color: '#8892a4' }}>{c.cedula_ruc || '—'}</td>
                  <td style={{ padding: '14px 20px', color: '#8892a4' }}>{c.telefono || '—'}</td>
                  <td style={{ padding: '14px 20px' }}>
                    <span style={{
                      background:   c.tipo === 'natural' ? '#f0fff4' : '#faf5ff',
                      color:        c.tipo === 'natural' ? '#48bb78' : '#9f7aea',
                      borderRadius: '6px', padding: '3px 8px', fontSize: '12px',
                      fontWeight:   600, textTransform: 'capitalize'
                    }}>
                      {c.tipo}
                    </span>
                  </td>
                  <td style={{ padding: '14px 20px' }}>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button onClick={() => abrirEditar(c)} style={{
                        background: '#ebf4ff', color: '#4e9af1',
                        border: 'none', borderRadius: '6px',
                        padding: '6px 10px', cursor: 'pointer'
                      }}>
                        <FaEdit />
                      </button>
                      <button onClick={() => confirmarEliminar(c)} style={{
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
      <Modal show={modal} onHide={() => setModal(false)} centered size="lg">
        <Modal.Header closeButton style={{ border: 'none', paddingBottom: 0 }}>
          <Modal.Title style={{ fontWeight: 700, fontSize: '18px' }}>
            {editando ? 'Editar Cliente' : 'Nuevo Cliente'}
          </Modal.Title>
        </Modal.Header>
        <Form onSubmit={guardar}>
          <Modal.Body style={{ padding: '20px 24px' }}>
            <Row>
              <Col md={8}>
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
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label style={{ fontWeight: 600, fontSize: '13px' }}>Tipo</Form.Label>
                  <Form.Select
                    name="tipo" value={form.tipo}
                    onChange={handleChange}
                    style={{ borderRadius: '8px' }}
                  >
                    <option value="natural">Natural</option>
                    <option value="juridico">Jurídico</option>
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label style={{ fontWeight: 600, fontSize: '13px' }}>Cédula / RUC</Form.Label>
                  <Form.Control
                    name="cedula_ruc" value={form.cedula_ruc}
                    onChange={handleChange}
                    placeholder="0912345678"
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
                    placeholder="0991234567"
                    style={{ borderRadius: '8px' }}
                  />
                </Form.Group>
              </Col>
              <Col md={12}>
                <Form.Group className="mb-3">
                  <Form.Label style={{ fontWeight: 600, fontSize: '13px' }}>Email</Form.Label>
                  <Form.Control
                    type="email" name="email" value={form.email}
                    onChange={handleChange}
                    placeholder="correo@ejemplo.com"
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
                    placeholder="Dirección del cliente"
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
          <Modal.Title style={{ fontWeight: 700, fontSize: '18px' }}>Eliminar Cliente</Modal.Title>
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

export default Clientes;