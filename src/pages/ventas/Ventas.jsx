import { useState, useEffect }                  from 'react';
import { Modal, Button, Table, Form, Row, Col } from 'react-bootstrap';
import API           from '../../api/axios';
import Loading       from '../../components/common/Loading';
import AlertaMensaje from '../../components/common/AlertaMensaje';
import { formatMoney, formatFechaHora } from '../../helpers/format';
import { FaPlus, FaEye, FaBan, FaSearch } from 'react-icons/fa';

const itemInicial = {
  id_producto: '', id_lote: '', cantidad: 1, precio_unitario: ''
};

const Ventas = () => {
  const [ventas,     setVentas]     = useState([]);
  const [productos,  setProductos]  = useState([]);
  const [clientes,   setClientes]   = useState([]);
  const [loading,    setLoading]    = useState(true);
  const [error,      setError]      = useState('');
  const [exito,      setExito]      = useState('');

  // Filtros
  const [desde,      setDesde]      = useState('');
  const [hasta,      setHasta]      = useState('');

  // Modal nueva venta
  const [modalNueva,  setModalNueva]  = useState(false);
  const [idCliente,   setIdCliente]   = useState('');
  const [descuento,   setDescuento]   = useState(0);
  const [detalles,    setDetalles]    = useState([{ ...itemInicial }]);
  const [guardando,   setGuardando]   = useState(false);
  const [lotesDisp,   setLotesDisp]   = useState({});

  // Modal detalle
  const [modalDetalle, setModalDetalle] = useState(false);
  const [ventaActual,  setVentaActual]  = useState(null);

  // Modal anular
  const [modalAnular,  setModalAnular]  = useState(false);
  const [anulando,     setAnulando]     = useState(null);

  // ─── Cargar ────────────────────────────────────────────
  const cargar = async (d = desde, h = hasta) => {
    try {
      setLoading(true);
      const params = {};
      if (d) params.desde = d;
      if (h) params.hasta = h;

      const [resVent, resProd, resCli] = await Promise.all([
        API.get('/ventas',    { params }),
        API.get('/productos'),
        API.get('/clientes')
      ]);

      setVentas(resVent.data.data);
      setProductos(resProd.data.data);
      setClientes(resCli.data.data);
    } catch {
      setError('Error al cargar ventas');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargar();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ─── Cargar lotes disponibles por producto ─────────────
  const cargarLotes = async (idProducto, index) => {
    if (!idProducto) return;
    try {
      const { data } = await API.get(`/productos/${idProducto}`);
      const lotes    = data.data.lotes || [];
      setLotesDisp(prev => ({ ...prev, [index]: lotes }));

      // Si solo hay un lote, seleccionarlo automáticamente
      if (lotes.length === 1) {
        actualizarItem(index, 'id_lote', lotes[0].id);
      }
    } catch {
      setLotesDisp(prev => ({ ...prev, [index]: [] }));
    }
  };

  // ─── Manejo de detalles ────────────────────────────────
  const agregarItem = () => {
    setDetalles([...detalles, { ...itemInicial }]);
  };

  const quitarItem = (i) => {
    const nuevos = detalles.filter((_, idx) => idx !== i);
    const nuevosLotes = { ...lotesDisp };
    delete nuevosLotes[i];
    setDetalles(nuevos);
    setLotesDisp(nuevosLotes);
  };

  const actualizarItem = (i, campo, valor) => {
    const nuevos = [...detalles];
    nuevos[i][campo] = valor;

    if (campo === 'id_producto' && valor) {
      nuevos[i].id_lote = '';
      const prod = productos.find(p => p.id === parseInt(valor));
      if (prod) nuevos[i].precio_unitario = prod.precio_venta;
      cargarLotes(valor, i);
    }

    setDetalles(nuevos);
  };

  // ─── Calcular totales ──────────────────────────────────
  const calcularSubtotal = () => {
    return detalles.reduce((acc, d) => {
      return acc + (parseFloat(d.cantidad || 0) * parseFloat(d.precio_unitario || 0));
    }, 0);
  };

  const calcularImpuesto = () => parseFloat((calcularSubtotal() * 0.15).toFixed(2));
  const calcularTotal    = () => parseFloat((calcularSubtotal() - parseFloat(descuento || 0) + calcularImpuesto()).toFixed(2));

  // ─── Guardar venta ─────────────────────────────────────
  const guardar = async (e) => {
    e.preventDefault();
    setGuardando(true);
    try {
      await API.post('/ventas', {
        id_cliente: idCliente ? parseInt(idCliente) : null,
        descuento:  parseFloat(descuento || 0),
        detalles:   detalles.map(d => ({
          id_producto:     parseInt(d.id_producto),
          id_lote:         parseInt(d.id_lote),
          cantidad:        parseInt(d.cantidad),
          precio_unitario: parseFloat(d.precio_unitario)
        }))
      });
      setExito('Venta registrada correctamente');
      setModalNueva(false);
      setIdCliente('');
      setDescuento(0);
      setDetalles([{ ...itemInicial }]);
      setLotesDisp({});
      cargar();
    } catch (err) {
      setError(err.response?.data?.mensaje || 'Error al registrar venta');
    } finally {
      setGuardando(false);
    }
  };

  // ─── Ver detalle ───────────────────────────────────────
  const verDetalle = async (id) => {
    try {
      const { data } = await API.get(`/ventas/${id}`);
      setVentaActual(data.data);
      setModalDetalle(true);
    } catch {
      setError('Error al cargar detalle');
    }
  };

  // ─── Anular ────────────────────────────────────────────
  const confirmarAnular = (v) => {
    setAnulando(v);
    setModalAnular(true);
  };

  const anular = async () => {
    try {
      await API.patch(`/ventas/${anulando.id}/anular`);
      setExito('Venta anulada correctamente');
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
          <h4 style={{ margin: 0, fontWeight: 700, color: '#1a1f2e' }}>Ventas</h4>
          <p style={{ margin: '4px 0 0', color: '#8892a4', fontSize: '14px' }}>
            {ventas.length} ventas registradas
          </p>
        </div>
        <Button onClick={() => setModalNueva(true)} style={{
          background: '#4e9af1', border: 'none',
          borderRadius: '8px', padding: '8px 16px',
          display: 'flex', alignItems: 'center', gap: '8px'
        }}>
          <FaPlus /> Nueva Venta
        </Button>
      </div>

      <AlertaMensaje tipo="danger"  mensaje={error} onClose={() => setError('')} />
      <AlertaMensaje tipo="success" mensaje={exito} onClose={() => setExito('')} />

      {/* Filtro por fecha */}
      <div style={{
        background: '#fff', borderRadius: '12px',
        padding: '16px 20px', marginBottom: '16px',
        boxShadow: '0 1px 4px rgba(0,0,0,0.08)'
      }}>
        <Row className="g-2 align-items-end">
          <Col md={4}>
            <Form.Label style={{ fontWeight: 600, fontSize: '13px' }}>Desde</Form.Label>
            <Form.Control
              type="date" value={desde}
              onChange={e => setDesde(e.target.value)}
              style={{ borderRadius: '8px' }}
            />
          </Col>
          <Col md={4}>
            <Form.Label style={{ fontWeight: 600, fontSize: '13px' }}>Hasta</Form.Label>
            <Form.Control
              type="date" value={hasta}
              onChange={e => setHasta(e.target.value)}
              style={{ borderRadius: '8px' }}
            />
          </Col>
          <Col md={4}>
            <div style={{ display: 'flex', gap: '8px' }}>
              <Button onClick={() => cargar(desde, hasta)} style={{
                background: '#4e9af1', border: 'none',
                borderRadius: '8px', flex: 1,
                display: 'flex', alignItems: 'center',
                justifyContent: 'center', gap: '6px'
              }}>
                <FaSearch /> Filtrar
              </Button>
              <Button variant="light" onClick={() => {
                setDesde(''); setHasta(''); cargar('', '');
              }} style={{ borderRadius: '8px' }}>
                Limpiar
              </Button>
            </div>
          </Col>
        </Row>
      </div>

      {/* Tabla */}
      <div style={{
        background: '#fff', borderRadius: '12px',
        boxShadow: '0 1px 4px rgba(0,0,0,0.08)', overflow: 'hidden'
      }}>
        <Table hover responsive style={{ margin: 0 }}>
          <thead style={{ background: '#f8fafc' }}>
            <tr>
              {['#', 'Factura', 'Cliente', 'Subtotal', 'IVA 15%', 'Total', 'Estado', 'Fecha', 'Acciones'].map(h => (
                <th key={h} style={{ padding: '14px 20px', color: '#8892a4', fontWeight: 600, fontSize: '13px' }}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {ventas.length === 0 ? (
              <tr>
                <td colSpan={9} style={{ textAlign: 'center', padding: '40px', color: '#8892a4' }}>
                  No hay ventas registradas
                </td>
              </tr>
            ) : (
              ventas.map((v, i) => (
                <tr key={v.id}>
                  <td style={{ padding: '14px 20px', color: '#8892a4' }}>{i + 1}</td>
                  <td style={{ padding: '14px 20px', fontWeight: 600, color: '#4e9af1' }}>
                    {v.numero_factura}
                  </td>
                  <td style={{ padding: '14px 20px', color: '#1a1f2e' }}>
                    {v.cliente?.nombre || 'Consumidor final'}
                  </td>
                  <td style={{ padding: '14px 20px', color: '#8892a4' }}>
                    {formatMoney(v.subtotal)}
                  </td>
                  <td style={{ padding: '14px 20px', color: '#8892a4' }}>
                    {formatMoney(v.impuesto)}
                  </td>
                  <td style={{ padding: '14px 20px', fontWeight: 700, color: '#48bb78' }}>
                    {formatMoney(v.total)}
                  </td>
                  <td style={{ padding: '14px 20px' }}>
                    <span style={{
                      background:   v.estado === 'completada' ? '#f0fff4' : '#fff5f5',
                      color:        v.estado === 'completada' ? '#48bb78' : '#fc8181',
                      borderRadius: '6px', padding: '3px 8px',
                      fontSize: '12px', fontWeight: 600
                    }}>
                      {v.estado}
                    </span>
                  </td>
                  <td style={{ padding: '14px 20px', color: '#8892a4', fontSize: '13px' }}>
                    {formatFechaHora(v.created_at)}
                  </td>
                  <td style={{ padding: '14px 20px' }}>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button onClick={() => verDetalle(v.id)} style={{
                        background: '#ebf4ff', color: '#4e9af1',
                        border: 'none', borderRadius: '6px',
                        padding: '6px 10px', cursor: 'pointer'
                      }}>
                        <FaEye />
                      </button>
                      {v.estado !== 'anulada' && (
                        <button onClick={() => confirmarAnular(v)} style={{
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

      {/* Modal Nueva Venta */}
      <Modal show={modalNueva} onHide={() => setModalNueva(false)} centered size="xl">
        <Modal.Header closeButton style={{ border: 'none', paddingBottom: 0 }}>
          <Modal.Title style={{ fontWeight: 700, fontSize: '18px' }}>Nueva Venta</Modal.Title>
        </Modal.Header>
        <Form onSubmit={guardar}>
          <Modal.Body style={{ padding: '20px 24px' }}>

            {/* Cliente y descuento */}
            <Row className="mb-4">
              <Col md={6}>
                <Form.Label style={{ fontWeight: 600, fontSize: '13px' }}>
                  Cliente (opcional)
                </Form.Label>
                <Form.Select
                  value={idCliente}
                  onChange={e => setIdCliente(e.target.value)}
                  style={{ borderRadius: '8px' }}
                >
                  <option value="">Consumidor final</option>
                  {clientes.map(c => (
                    <option key={c.id} value={c.id}>{c.nombre} — {c.cedula_ruc}</option>
                  ))}
                </Form.Select>
              </Col>
              <Col md={3}>
                <Form.Label style={{ fontWeight: 600, fontSize: '13px' }}>Descuento ($)</Form.Label>
                <Form.Control
                  type="number" step="0.01" min="0"
                  value={descuento}
                  onChange={e => setDescuento(e.target.value)}
                  style={{ borderRadius: '8px' }}
                />
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
                    <Col md={3}>
                      <Form.Label style={{ fontSize: '12px', fontWeight: 600 }}>Lote *</Form.Label>
                      <Form.Select
                        value={item.id_lote}
                        onChange={e => actualizarItem(i, 'id_lote', e.target.value)}
                        required style={{ borderRadius: '6px', fontSize: '13px' }}
                        disabled={!item.id_producto}
                      >
                        <option value="">Seleccionar lote</option>
                        {(lotesDisp[i] || []).map(l => (
                          <option key={l.id} value={l.id}>
                            {l.numero_lote} — Stock: {l.cantidad_actual} — Vence: {l.fecha_vencimiento}
                          </option>
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
                      <Form.Label style={{ fontSize: '12px', fontWeight: 600 }}>P. Venta *</Form.Label>
                      <Form.Control
                        type="number" step="0.01" min="0"
                        value={item.precio_unitario}
                        onChange={e => actualizarItem(i, 'precio_unitario', e.target.value)}
                        required style={{ borderRadius: '6px', fontSize: '13px' }}
                      />
                    </Col>
                    <Col md={1}>
                      <div style={{ fontSize: '13px', fontWeight: 600, color: '#48bb78' }}>
                        {formatMoney(parseFloat(item.cantidad || 0) * parseFloat(item.precio_unitario || 0))}
                      </div>
                    </Col>
                    <Col md={1}>
                      {detalles.length > 1 && (
                        <button type="button" onClick={() => quitarItem(i)} style={{
                          background: '#fff5f5', color: '#fc8181',
                          border: 'none', borderRadius: '6px',
                          padding: '8px', cursor: 'pointer', width: '100%'
                        }}>
                          ✕
                        </button>
                      )}
                    </Col>
                  </Row>
                </div>
              ))}
            </div>

            {/* Resumen */}
            <div style={{
              background: '#f8fafc', borderRadius: '10px',
              padding: '16px', maxWidth: '300px', marginLeft: 'auto'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ color: '#8892a4', fontSize: '13px' }}>Subtotal</span>
                <span style={{ fontWeight: 600 }}>{formatMoney(calcularSubtotal())}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ color: '#8892a4', fontSize: '13px' }}>Descuento</span>
                <span style={{ fontWeight: 600, color: '#fc8181' }}>- {formatMoney(descuento || 0)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                <span style={{ color: '#8892a4', fontSize: '13px' }}>IVA 15%</span>
                <span style={{ fontWeight: 600 }}>{formatMoney(calcularImpuesto())}</span>
              </div>
              <div style={{
                display: 'flex', justifyContent: 'space-between',
                borderTop: '1px solid #e2e8f0', paddingTop: '12px'
              }}>
                <span style={{ fontWeight: 700, fontSize: '15px' }}>Total</span>
                <span style={{ fontWeight: 700, fontSize: '20px', color: '#1a1f2e' }}>
                  {formatMoney(calcularTotal())}
                </span>
              </div>
            </div>

          </Modal.Body>
          <Modal.Footer style={{ border: 'none', paddingTop: 0 }}>
            <Button variant="light" onClick={() => setModalNueva(false)} style={{ borderRadius: '8px' }}>
              Cancelar
            </Button>
            <Button type="submit" disabled={guardando} style={{
              background: '#4e9af1', border: 'none', borderRadius: '8px'
            }}>
              {guardando ? 'Procesando...' : 'Registrar Venta'}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>

      {/* Modal Detalle */}
      <Modal show={modalDetalle} onHide={() => setModalDetalle(false)} centered size="lg">
        <Modal.Header closeButton style={{ border: 'none' }}>
          <Modal.Title style={{ fontWeight: 700, fontSize: '18px' }}>
            Detalle de Venta
          </Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ padding: '0 24px 20px' }}>
          {ventaActual && (
            <>
              <Row className="mb-3">
                <Col md={4}>
                  <small style={{ color: '#8892a4' }}>Factura</small>
                  <div style={{ fontWeight: 700, color: '#4e9af1' }}>{ventaActual.numero_factura}</div>
                </Col>
                <Col md={4}>
                  <small style={{ color: '#8892a4' }}>Cliente</small>
                  <div style={{ fontWeight: 600 }}>{ventaActual.cliente?.nombre || 'Consumidor final'}</div>
                </Col>
                <Col md={4}>
                  <small style={{ color: '#8892a4' }}>Estado</small>
                  <div style={{
                    fontWeight: 600,
                    color: ventaActual.estado === 'completada' ? '#48bb78' : '#fc8181',
                    textTransform: 'capitalize'
                  }}>
                    {ventaActual.estado}
                  </div>
                </Col>
              </Row>

              <Table bordered size="sm" style={{ fontSize: '13px' }}>
                <thead style={{ background: '#f8fafc' }}>
                  <tr>
                    <th>Producto</th>
                    <th>Lote</th>
                    <th>Cantidad</th>
                    <th>P. Unitario</th>
                    <th>Subtotal</th>
                  </tr>
                </thead>
                <tbody>
                  {ventaActual.detalles?.map((d, i) => (
                    <tr key={i}>
                      <td>{d.producto?.nombre}</td>
                      <td>{d.lote?.numero_lote || '—'}</td>
                      <td>{d.cantidad}</td>
                      <td>{formatMoney(d.precio_unitario)}</td>
                      <td>{formatMoney(d.subtotal)}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>

              <div style={{
                background: '#f8fafc', borderRadius: '10px',
                padding: '16px', maxWidth: '260px', marginLeft: 'auto', marginTop: '16px'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                  <span style={{ color: '#8892a4', fontSize: '13px' }}>Subtotal</span>
                  <span>{formatMoney(ventaActual.subtotal)}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                  <span style={{ color: '#8892a4', fontSize: '13px' }}>Descuento</span>
                  <span style={{ color: '#fc8181' }}>- {formatMoney(ventaActual.descuento)}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                  <span style={{ color: '#8892a4', fontSize: '13px' }}>IVA 15%</span>
                  <span>{formatMoney(ventaActual.impuesto)}</span>
                </div>
                <div style={{
                  display: 'flex', justifyContent: 'space-between',
                  borderTop: '1px solid #e2e8f0', paddingTop: '10px'
                }}>
                  <span style={{ fontWeight: 700 }}>Total</span>
                  <span style={{ fontWeight: 700, fontSize: '18px', color: '#48bb78' }}>
                    {formatMoney(ventaActual.total)}
                  </span>
                </div>
              </div>
            </>
          )}
        </Modal.Body>
      </Modal>

      {/* Modal Anular */}
      <Modal show={modalAnular} onHide={() => setModalAnular(false)} centered>
        <Modal.Header closeButton style={{ border: 'none' }}>
          <Modal.Title style={{ fontWeight: 700, fontSize: '18px' }}>Anular Venta</Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ padding: '0 24px 20px' }}>
          ¿Estás seguro que deseas anular la factura{' '}
          <strong>{anulando?.numero_factura}</strong>?
          El stock será devuelto automáticamente.
        </Modal.Body>
        <Modal.Footer style={{ border: 'none', paddingTop: 0 }}>
          <Button variant="light" onClick={() => setModalAnular(false)} style={{ borderRadius: '8px' }}>
            Cancelar
          </Button>
          <Button variant="danger" onClick={anular} style={{ borderRadius: '8px' }}>
            Anular Venta
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Ventas;