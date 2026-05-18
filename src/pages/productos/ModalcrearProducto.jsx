import React from 'react'
import { Modal, Button, Form, Row, Col } from 'react-bootstrap';
const ModalcrearProducto = ({show, onHide, onSubmit, editando, onClick, form, guardando, categorias, proveedores, onChange}) => {
  return (
    <Modal show={show} onHide={onHide} centered size="lg">
        <Modal.Header closeButton style={{ border: 'none', paddingBottom: 0 }}>
          <Modal.Title style={{ fontWeight: 700, fontSize: '18px' }}>
            {editando ? 'Editar Producto' : 'Nuevo Producto'}
          </Modal.Title>
        </Modal.Header>
        <Form onSubmit={onSubmit}>
          <Modal.Body style={{ padding: '20px 24px' }}>
            <Row>
              <Col md={8}>
                <Form.Group className="mb-3">
                  <Form.Label style={{ fontWeight: 600, fontSize: '13px' }}>Nombre *</Form.Label>
                  <Form.Control
                    name="nombre" value={form.nombre}
                    onChange={onChange} required
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
                    onChange={onChange}
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
                    onChange={onChange}
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
                    onChange={onChange} required
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
                    onChange={onChange} required
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
                    onChange={onChange}
                    style={{ borderRadius: '8px' }}
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label style={{ fontWeight: 600, fontSize: '13px' }}>Categoría</Form.Label>
                  <Form.Select
                    name="id_categoria" value={form.id_categoria}
                    onChange={onChange}
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
                    onChange={onChange}
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
            <Button variant="light" onClick={onclick} style={{ borderRadius: '8px' }}>
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
  )
}

export default ModalcrearProducto