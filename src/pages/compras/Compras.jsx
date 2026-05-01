import { useState, useEffect }                  from 'react';
import { Modal, Button, Table, Form, Row, Col } from 'react-bootstrap';
import API           from '../../api/axios';
import Loading       from '../../components/common/Loading';
import AlertaMensaje from '../../components/common/AlertaMensaje';
import { formatMoney, formatFechaHora } from '../../helpers/format';
import { FaPlus, FaEye, FaBan, FaTrash } from 'react-icons/fa';

const itemInicial = {
  id_producto: '', cantidad: 1, precio_unitario: '',
  numero_lote: '', fecha_vencimiento: ''
};

const Compras = () => {
  const [compras,     setCompras]     = useState([]);
  const [productos,   setProductos]   = useState([]);
  const [proveedores, setProveedores] = useState([]);
  const [loading,     setLoading]     = useState(true);
  const [error,       setError]       = useState('');
  const [exito,       setExito]       = useState('');

  // Modal nueva compra
  const [modalNueva,  setModalNueva]  = useState(false);
  const [idProveedor, setIdProveedor] = useState('');
  const [detalles,    setDetalles]    = useState([{ ...itemInicial }]);
  const [guardando,   setGuardando]   = useState(false);

  // Modal detalle
  const [modalDetalle, setModalDetalle] = useState(false);
  const [compraActual, setCompraActual] = useState(null);

  // Modal anular
  const [modalAnular,  setModalAnular]  = useState(false);
  const [anulando,     setAnulando]     = useState(null);

  // ─── Cargar ────────────────────────────────────────────
  const cargar = async () => {
    try {
      setLoading(true);
      const [resComp, resProd, resProv] = await Promise.all([
        API.get('/compras'),
        API.get('/productos'),
        API.get('/proveedores')
      ]);
      setCompras(resComp.data.data);
      setProductos(resProd.data.data);
      setProveedores(resProv.data.data);
    } catch {
      setError('Error al cargar compras');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargar();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ─── Manejo de detalles ────────────────────────────────
  const agregarItem = () => {
    setDetalles([...detalles, { ...itemInicial }]);
  };

  const quitarItem = (i) => {
    setDetalles(detalles.filter((_, idx) => idx !== i));
  };

  const actualizarItem = (i, campo, valor) => {
    const nuevos = [...detalles];
    nuevos[i][campo] = valor;

    // Auto-rellenar precio de compra del producto
    if (campo === 'id_producto' && valor) {
      const prod = productos.find(p => p.id === parseInt(valor));
      if (prod) nuevos[i].precio_unitario = prod.precio_compra;
    }
    setDetalles(nuevos);
  };

  // ─── Total ─────────────────────────────────────────────
  const calcularTotal = () => {
    return detalles.reduce((acc, d) => {
      return acc + (parseFloat(d.cantidad || 0) * parseFloat(d.precio_unitario || 0));
    }, 0);
  };

  // ─── Guardar compra ────────────────────────────────────
  const guardar = async (e) => {
    e.preventDefault();
    setGuardando(true);
    try {
      await API.post('/compras', {
        id_proveedor: parseInt(idProveedor),
        detalles:     detalles.map(d => ({
          id_producto:       parseInt(d.id_producto),
          cantidad:          parseInt(d.cantidad),
          precio_unitario:   parseFloat(d.precio_unitario),
          numero_lote:       d.numero_lote,
          fecha_vencimiento: d.fecha_vencimiento
        }))
      });
      setExito('Compra registrada correctamente');
      setModalNueva(false);
      setIdProveedor('');
      setDetalles([{ ...itemInicial }]);
      cargar();
    } catch (err) {
      setError(err.response?.data?.mensaje || 'Error al guardar compra');
    } finally {
      setGuardando(false);
    }
  };

  // ─── Ver detalle ───────────────────────────────────────
  const verDetalle = async (id) => {
    try {
      const { data } = await API.get(`/compras/${id}`);
      setCompraActual(data.data);
      setModalDetalle(true);
    } catch {
      setError('Error al cargar detalle');
    }
  };

  // ─── Anular ────────────────────────────────────────────
  const confirmarAnular = (c) => {
    setAnulando(c);
    setModalAnular(true);
  };

  const anular = async () => {
    try {
      await API.patch(`/compras/${anulando.id}/anular`);
      setExito('Compra anulada correctamente');
      setModalAnular(false);
      cargar();
    } catch (err) {
      setError(err.response?.data?.mensaje || 'Error al anular');
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
          <h4 style={{ margin: 0, fontWeight: 700, color: '#1a1f2e' }}>Compras</h4>
          <p style={{ margin: '4px 0 0', color: '#8892a4', fontSize: '14px' }}>
            {compras.length} compras registradas
          </p>
        </div>
        <Button onClick={() => setModalNueva(true)} style={{
          background: '#4e9af1', border: 'none',
          borderRadius: '8px', padding: '8px 16px',
          display: 'flex', alignItems: 'center', gap: '8px'
        }}>
          <FaPlus /> Nueva Compra
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
              {['#', 'Proveedor', 'Usuario', 'Total', 'Estado', 'Fecha', 'Acciones'].map(h => (
                <th key={h} style={{ padding: '14px 20px', color: '#8892a4', fontWeight: 600, fontSize: '13px' }}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {compras.length === 0 ? (
              <tr>
                <td colSpan={7} style={{ textAlign: 'center', padding: '40px', color: '#8892a4' }}>
                  No hay compras registradas
                </td>
              </tr>
            ) : (
              compras.map((c, i) => (
                <tr key={c.id}>
                  <td style={{ padding: '14px 20px', color: '#8892a4' }}>{i + 1}</td>
                  <td style={{ padding: '14px 20px', fontWeight: 600, color: '#1a1f2e' }}>
                    {c.proveedor?.nombre || '—'}
                  </td>
                  <td style={{ padding: '14px 20px', color: '#8892a4' }}>
                    {c.usuario?.nombre || '—'}
                  </td>
                  <td style={{ padding: '14px 20px', fontWeight: 600, color: '#48bb78' }}>
                    {formatMoney(c.total)}
                  </td>
                  <td style={{ padding: '14px 20px' }}>
                    <span style={{
                      background:   c.estado === 'recibida' ? '#f0fff4' : c.estado === 'anulada' ? '#fff5f5' : '#fffaf0',
                      color:        c.estado === 'recibida' ? '#48bb78' : c.estado === 'anulada' ? '#fc8181' : '#ed8936',
                      borderRadius: '6px', padding: '3px 8px',
                      fontSize: '12px', fontWeight: 600
                    }}>
                      {c.estado}
                    </span>
                  </td>
                  <td style={{ padding: '14px 20px', color: '#8892a4', fontSize: '13px' }}>
                    {formatFechaHora(c.created_at)}
                  </td>
                  <td style={{ padding: '14px 20px' }}>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button onClick={() => verDetalle(c.id)} style={{
                        background: '#ebf4ff', color: '#4e9af1',
                        border: 'none', borderRadius: '6px',
                        padding: '6px 10px', cursor: 'pointer'
                      }}>
                        <FaEye />
                      </button>
                      {c.estado !== 'anulada' && (
                        <button onClick={() => confirmarAnular(c)} style={{
                          background: '#fff5f5', color: '#fc8181',
                          border: 'none', borderRadius: '6px',
                          padding: '6px 10px', cursor: 'pointer'
                        }}>
                          <FaBan />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </Table>
      </div>

      {/* Modal Nueva Compra */}
      <Modal show={modalNueva} onHide={() => setModalNueva(false)} centered size="xl">
        <Modal.Header closeButton style={{ border: 'none', paddingBottom: 0 }}>
          <Modal.Title style={{ fontWeight: 700, fontSize: '18px' }}>Nueva Compra</Modal.Title>
        </Modal.Header>
        <Form onSubmit={guardar}>
          <Modal.Body style={{ padding: '20px 24px' }}>

            {/* Proveedor */}
            <Row className="mb-4">
              <Col md={6}>
                <Form.Label style={{ fontWeight: 600, fontSize: '13px' }}>Proveedor *</Form.Label>
                <Form.Select
                  value={idProveedor}
                  onChange={e => setIdProveedor(e.target.value)}
                  required style={{ borderRadius: '8px' }}
                >
                  <option value="">Seleccionar proveedor</option>
                  {proveedores.map(p => (
                    <option key={p.id} value={p.id}>{p.nombre}</option>
                  ))}
                </Form.Select>
              </Col>
            </Row>

            {/* Productos */}
            <div style={{
              background: '#f8fafc', borderRadius: '10px',
              padding: '16px', marginBottom: '16px'
            }}>
              <div style={{
                display: 'flex', justifyContent: 'space-between',
                alignItems: 'center', marginBottom: '12px'
              }}>
                <span style={{ fontWeight: 600, fontSize: '14px' }}>Productos</span>
                <Button onClick={agregarItem} size="sm" style={{
                  background: '#4e9af1', border: 'none', borderRadius: '6px'
                }}>
                  <FaPlus /> Agregar
                </Button>
              </div>

              {detalles.map((item, i) => (
                <div key={i} style={{
                  background: '#fff', borderRadius: '8px',
                  padding: '12px', marginBottom: '8px',
                  border: '1px solid #e2e8f0'
                }}>
                  <Row className="g-2 align-items-end">
                    <Col md={3}>
                      <Form.Label style={{ fontSize: '12px', fontWeight: 600 }}>Producto *</Form.Label>
                      <Form.Select
                        value={item.id_producto}
                        onChange={e => actualizarItem(i, 'id_producto', e.target.value)}
                        required style={{ borderRadius: '6px', fontSize: '13px' }}
                      >
                        <option value="">Seleccionar</option>
                        {productos.map(p => (
                          <option key={p.id} value={p.id}>{p.nombre}</option>
                        ))}
                      </Form.Select>
                    </Col>
                    <Col md={2}>
                      <Form.Label style={{ fontSize: '12px', fontWeight: 600 }}>Cantidad *</Form.Label>
                      <Form.Control
                        type="number" min="1"
                        value={item.cantidad}
                        onChange={e => actualizarItem(i, 'cantidad', e.target.value)}
                        required style={{ borderRadius: '6px', fontSize: '13px' }}
                      />
                    </Col>
                    <Col md={2}>
                      <Form.Label style={{ fontSize: '12px', fontWeight: 600 }}>P. Unitario *</Form.Label>
                      <Form.Control
                        type="number" step="0.01" min="0"
                        value={item.precio_unitario}
                        onChange={e => actualizarItem(i, 'precio_unitario', e.target.value)}
                        required style={{ borderRadius: '6px', fontSize: '13px' }}
                      />
                    </Col>
                    <Col md={2}>
                      <Form.Label style={{ fontSize: '12px', fontWeight: 600 }}>Nº Lote</Form.Label>
                      <Form.Control
                        value={item.numero_lote}
                        onChange={e => actualizarItem(i, 'numero_lote', e.target.value)}
                        placeholder="LOTE-001"
                        style={{ borderRadius: '6px', fontSize: '13px' }}
                      />
                    </Col>
                    <Col md={2}>
                      <Form.Label style={{ fontSize: '12px', fontWeight: 600 }}>Vencimiento *</Form.Label>
                      <Form.Control
                        type="date"
                        value={item.fecha_vencimiento}
                        onChange={e => actualizarItem(i, 'fecha_vencimiento', e.target.value)}
                        required style={{ borderRadius: '6px', fontSize: '13px' }}
                      />
                    </Col>
                    <Col md={1}>
                      {detalles.length > 1 && (
                        <button type="button" onClick={() => quitarItem(i)} style={{
                          background: '#fff5f5', color: '#fc8181',
                          border: 'none', borderRadius: '6px',
                          padding: '8px', cursor: 'pointer', width: '100%'
                        }}>
                          <FaTrash />
                        </button>
                      )}
                    </Col>
                  </Row>
                </div>
              ))}
            </div>

            {/* Total */}
            <div style={{
              display: 'flex', justifyContent: 'flex-end',
              alignItems: 'center', gap: '16px'
            }}>
              <span style={{ fontWeight: 600, color: '#8892a4' }}>Total:</span>
              <span style={{ fontSize: '22px', fontWeight: 700, color: '#1a1f2e' }}>
                {formatMoney(calcularTotal())}
              </span>
            </div>

          </Modal.Body>
          <Modal.Footer style={{ border: 'none', paddingTop: 0 }}>
            <Button variant="light" onClick={() => setModalNueva(false)} style={{ borderRadius: '8px' }}>
              Cancelar
            </Button>
            <Button type="submit" disabled={guardando} style={{
              background: '#4e9af1', border: 'none', borderRadius: '8px'
            }}>
              {guardando ? 'Guardando...' : 'Registrar Compra'}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>

      {/* Modal Detalle */}
      <Modal show={modalDetalle} onHide={() => setModalDetalle(false)} centered size="lg">
        <Modal.Header closeButton style={{ border: 'none' }}>
          <Modal.Title style={{ fontWeight: 700, fontSize: '18px' }}>
            Detalle de Compra
          </Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ padding: '0 24px 20px' }}>
          {compraActual && (
            <>
              <Row className="mb-3">
                <Col md={6}>
                  <small style={{ color: '#8892a4' }}>Proveedor</small>
                  <div style={{ fontWeight: 600 }}>{compraActual.proveedor?.nombre}</div>
                </Col>
                <Col md={3}>
                  <small style={{ color: '#8892a4' }}>Estado</small>
                  <div style={{ fontWeight: 600, textTransform: 'capitalize' }}>{compraActual.estado}</div>
                </Col>
                <Col md={3}>
                  <small style={{ color: '#8892a4' }}>Total</small>
                  <div style={{ fontWeight: 700, color: '#48bb78', fontSize: '18px' }}>
                    {formatMoney(compraActual.total)}
                  </div>
                </Col>
              </Row>
              <Table bordered size="sm" style={{ fontSize: '13px' }}>
                <thead style={{ background: '#f8fafc' }}>
                  <tr>
                    <th>Producto</th>
                    <th>Lote</th>
                    <th>Vencimiento</th>
                    <th>Cantidad</th>
                    <th>P. Unitario</th>
                    <th>Subtotal</th>
                  </tr>
                </thead>
                <tbody>
                  {compraActual.detalles?.map((d, i) => (
                    <tr key={i}>
                      <td>{d.producto?.nombre}</td>
                      <td>{d.lote?.numero_lote || '—'}</td>
                      <td>{d.lote?.fecha_vencimiento || '—'}</td>
                      <td>{d.cantidad}</td>
                      <td>{formatMoney(d.precio_unitario)}</td>
                      <td>{formatMoney(d.subtotal)}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </>
          )}
        </Modal.Body>
      </Modal>

      {/* Modal Anular */}
      <Modal show={modalAnular} onHide={() => setModalAnular(false)} centered>
        <Modal.Header closeButton style={{ border: 'none' }}>
          <Modal.Title style={{ fontWeight: 700, fontSize: '18px' }}>Anular Compra</Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ padding: '0 24px 20px' }}>
          ¿Estás seguro que deseas anular esta compra? Se revertirá el stock de todos los lotes.
        </Modal.Body>
        <Modal.Footer style={{ border: 'none', paddingTop: 0 }}>
          <Button variant="light" onClick={() => setModalAnular(false)} style={{ borderRadius: '8px' }}>
            Cancelar
          </Button>
          <Button variant="danger" onClick={anular} style={{ borderRadius: '8px' }}>
            Anular Compra
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Compras;