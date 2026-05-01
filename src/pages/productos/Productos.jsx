import { useState, useEffect }                    from 'react';
import { Modal, Button, Table, Form, Row, Col }   from 'react-bootstrap';
import API           from '../../api/axios';
import Loading       from '../../components/common/Loading';
import AlertaMensaje from '../../components/common/AlertaMensaje';
import { formatMoney } from '../../helpers/format';
import { FaPlus, FaEdit, FaTrash, FaSearch } from 'react-icons/fa';

const inicial = {
  nombre: '', descripcion: '', codigo_barra: '',
  precio_compra: '', precio_venta: '',
  stock_minimo: 5, id_categoria: '', id_proveedor_principal: ''
};

const Productos = () => {
  const [productos,   setProductos]   = useState([]);
  const [categorias,  setCategorias]  = useState([]);
  const [proveedores, setProveedores] = useState([]);
  const [loading,     setLoading]     = useState(true);
  const [error,       setError]       = useState('');
  const [exito,       setExito]       = useState('');
  const [buscar,      setBuscar]      = useState('');
  const [filtrocat,   setFiltroCat]   = useState('');
  const [modal,       setModal]       = useState(false);
  const [modalElim,   setModalElim]   = useState(false);
  const [form,        setForm]        = useState(inicial);
  const [editando,    setEditando]    = useState(null);
  const [eliminando,  setEliminando]  = useState(null);
  const [guardando,   setGuardando]   = useState(false);

  // ─── Cargar datos ──────────────────────────────────────
  const cargar = async (b = buscar, c = filtrocat) => {
    try {
      setLoading(true);
      const params = {};
      if (b) params.buscar       = b;
      if (c) params.id_categoria = c;

      const [resProd, resCat, resProv] = await Promise.all([
        API.get('/productos',   { params }),
        API.get('/categorias'),
        API.get('/proveedores')
      ]);

      setProductos(resProd.data.data);
      setCategorias(resCat.data.data);
      setProveedores(resProv.data.data);
    } catch {
      setError('Error al cargar productos');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
  cargar();
  // eslint-disable-next-line react-hooks/exhaustive-deps
}, []);

  // ─── Buscar ────────────────────────────────────────────
  const handleBuscar = (e) => {
    e.preventDefault();
    cargar(buscar, filtrocat);
  };

  // ─── Abrir modal crear ─────────────────────────────────
  const abrirCrear = () => {
    setForm(inicial);
    setEditando(null);
    setModal(true);
  };

  // ─── Abrir modal editar ────────────────────────────────
  const abrirEditar = (p) => {
    setForm({
      nombre:                 p.nombre,
      descripcion:            p.descripcion            || '',
      codigo_barra:           p.codigo_barra           || '',
      precio_compra:          p.precio_compra,
      precio_venta:           p.precio_venta,
      stock_minimo:           p.stock_minimo,
      id_categoria:           p.id_categoria           || '',
      id_proveedor_principal: p.id_proveedor_principal || ''
    });
    setEditando(p.id);
    setModal(true);
  };

  // ─── Guardar ───────────────────────────────────────────
  const guardar = async (e) => {
    e.preventDefault();
    setGuardando(true);
    try {
      if (editando) {
        await API.put(`/productos/${editando}`, form);
        setExito('Producto actualizado correctamente');
      } else {
        await API.post('/productos', form);
        setExito('Producto creado correctamente');
      }
      setModal(false);
      cargar();
    } catch (err) {
      setError(err.response?.data?.mensaje || 'Error al guardar');
    } finally {
      setGuardando(false);
    }
  };

  // ─── Eliminar ──────────────────────────────────────────
  const confirmarEliminar = (p) => {
    setEliminando(p);
    setModalElim(true);
  };

  const eliminar = async () => {
    try {
      await API.delete(`/productos/${eliminando.id}`);
      setExito('Producto eliminado correctamente');
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
          <h4 style={{ margin: 0, fontWeight: 700, color: '#1a1f2e' }}>Productos</h4>
          <p style={{ margin: '4px 0 0', color: '#8892a4', fontSize: '14px' }}>
            {productos.length} productos registrados
          </p>
        </div>
        <Button onClick={abrirCrear} style={{
          background: '#4e9af1', border: 'none',
          borderRadius: '8px', padding: '8px 16px',
          display: 'flex', alignItems: 'center', gap: '8px'
        }}>
          <FaPlus /> Nuevo Producto
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
            <Col md={5}>
              <Form.Label style={{ fontWeight: 600, fontSize: '13px' }}>
                Buscar
              </Form.Label>
              <div style={{ position: 'relative' }}>
                <Form.Control
                  value={buscar}
                  onChange={e => setBuscar(e.target.value)}
                  placeholder="Nombre o código de barra..."
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
              <Form.Label style={{ fontWeight: 600, fontSize: '13px' }}>
                Categoría
              </Form.Label>
              <Form.Select
                value={filtrocat}
                onChange={e => setFiltroCat(e.target.value)}
                style={{ borderRadius: '8px' }}
              >
                <option value="">Todas las categorías</option>
                {categorias.map(c => (
                  <option key={c.id} value={c.id}>{c.nombre}</option>
                ))}
              </Form.Select>
            </Col>
            <Col md={3}>
              <div style={{ display: 'flex', gap: '8px' }}>
                <Button type="submit" style={{
                  background: '#4e9af1', border: 'none',
                  borderRadius: '8px', flex: 1
                }}>
                  Buscar
                </Button>
                <Button variant="light" onClick={() => {
                  setBuscar(''); setFiltroCat(''); cargar('', '');
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
              {['#', 'Nombre', 'Categoría', 'P. Compra', 'P. Venta', 'Stock Mín.', 'Acciones'].map(h => (
                <th key={h} style={{ padding: '14px 20px', color: '#8892a4', fontWeight: 600, fontSize: '13px' }}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {productos.length === 0 ? (
              <tr>
                <td colSpan={7} style={{ textAlign: 'center', padding: '40px', color: '#8892a4' }}>
                  No hay productos registrados
                </td>
              </tr>
            ) : (
              productos.map((p, i) => (
                <tr key={p.id}>
                  <td style={{ padding: '14px 20px', color: '#8892a4' }}>{i + 1}</td>
                  <td style={{ padding: '14px 20px' }}>
                    <div style={{ fontWeight: 600, color: '#1a1f2e' }}>{p.nombre}</div>
                    {p.codigo_barra && (
                      <div style={{ fontSize: '12px', color: '#8892a4' }}>{p.codigo_barra}</div>
                    )}
                  </td>
                  <td style={{ padding: '14px 20px' }}>
                    <span style={{
                      background: '#ebf4ff', color: '#4e9af1',
                      borderRadius: '6px', padding: '3px 8px', fontSize: '12px'
                    }}>
                      {p.categoria?.nombre || '—'}
                    </span>
                  </td>
                  <td style={{ padding: '14px 20px', color: '#8892a4' }}>
                    {formatMoney(p.precio_compra)}
                  </td>
                  <td style={{ padding: '14px 20px', fontWeight: 600, color: '#48bb78' }}>
                    {formatMoney(p.precio_venta)}
                  </td>
                  <td style={{ padding: '14px 20px', color: '#8892a4' }}>
                    {p.stock_minimo}
                  </td>
                  <td style={{ padding: '14px 20px' }}>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button onClick={() => abrirEditar(p)} style={{
                        background: '#ebf4ff', color: '#4e9af1',
                        border: 'none', borderRadius: '6px',
                        padding: '6px 10px', cursor: 'pointer'
                      }}>
                        <FaEdit />
                      </button>
                      <button onClick={() => confirmarEliminar(p)} style={{
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
            {editando ? 'Editar Producto' : 'Nuevo Producto'}
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
                    placeholder="Nombre del producto"
                    style={{ borderRadius: '8px' }}
                  />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label style={{ fontWeight: 600, fontSize: '13px' }}>Código de barra</Form.Label>
                  <Form.Control
                    name="codigo_barra" value={form.codigo_barra}
                    onChange={handleChange}
                    placeholder="7501234567890"
                    style={{ borderRadius: '8px' }}
                  />
                </Form.Group>
              </Col>
              <Col md={12}>
                <Form.Group className="mb-3">
                  <Form.Label style={{ fontWeight: 600, fontSize: '13px' }}>Descripción</Form.Label>
                  <Form.Control
                    as="textarea" rows={2}
                    name="descripcion" value={form.descripcion}
                    onChange={handleChange}
                    placeholder="Descripción opcional"
                    style={{ borderRadius: '8px' }}
                  />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label style={{ fontWeight: 600, fontSize: '13px' }}>Precio compra *</Form.Label>
                  <Form.Control
                    type="number" step="0.01" min="0"
                    name="precio_compra" value={form.precio_compra}
                    onChange={handleChange} required
                    placeholder="0.00"
                    style={{ borderRadius: '8px' }}
                  />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label style={{ fontWeight: 600, fontSize: '13px' }}>Precio venta *</Form.Label>
                  <Form.Control
                    type="number" step="0.01" min="0"
                    name="precio_venta" value={form.precio_venta}
                    onChange={handleChange} required
                    placeholder="0.00"
                    style={{ borderRadius: '8px' }}
                  />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label style={{ fontWeight: 600, fontSize: '13px' }}>Stock mínimo</Form.Label>
                  <Form.Control
                    type="number" min="0"
                    name="stock_minimo" value={form.stock_minimo}
                    onChange={handleChange}
                    style={{ borderRadius: '8px' }}
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label style={{ fontWeight: 600, fontSize: '13px' }}>Categoría</Form.Label>
                  <Form.Select
                    name="id_categoria" value={form.id_categoria}
                    onChange={handleChange}
                    style={{ borderRadius: '8px' }}
                  >
                    <option value="">Seleccionar categoría</option>
                    {categorias.map(c => (
                      <option key={c.id} value={c.id}>{c.nombre}</option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label style={{ fontWeight: 600, fontSize: '13px' }}>Proveedor principal</Form.Label>
                  <Form.Select
                    name="id_proveedor_principal" value={form.id_proveedor_principal}
                    onChange={handleChange}
                    style={{ borderRadius: '8px' }}
                  >
                    <option value="">Seleccionar proveedor</option>
                    {proveedores.map(p => (
                      <option key={p.id} value={p.id}>{p.nombre}</option>
                    ))}
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

      {/* Modal Eliminar */}
      <Modal show={modalElim} onHide={() => setModalElim(false)} centered>
        <Modal.Header closeButton style={{ border: 'none' }}>
          <Modal.Title style={{ fontWeight: 700, fontSize: '18px' }}>Eliminar Producto</Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ padding: '0 24px 20px' }}>
          ¿Estás seguro que deseas eliminar <strong>{eliminando?.nombre}</strong>?
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

export default Productos;