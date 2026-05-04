import React from 'react'
import { Modal, Button, Form, Row, Col } from 'react-bootstrap';
export const ModalCrearProveedor = ({show, form, onHide, onSubmit, onClick, onChange, editando, guardando}) => {
  return (
     <Modal show={show} onHide={onHide} centered size="lg">
            <Modal.Header closeButton style={{ border: 'none', paddingBottom: 0 }}>
              <Modal.Title style={{ fontWeight: 700, fontSize: '18px' }}>
                {editando ? 'Editar Proveedor' : 'Nuevo Proveedor'}
              </Modal.Title>
            </Modal.Header>
            <Form onSubmit={onSubmit}>
              <Modal.Body style={{ padding: '20px 24px' }}>
                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label style={{ fontWeight: 600, fontSize: '13px' }}>Nombre *</Form.Label>
                      <Form.Control
                        name="nombre" value={form.nombre}
                        onChange={onChange} required
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
                        onChange={onChange}
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
                        onChange={onChange}
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
                        onChange={onChange}
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
                        onChange={onChange}
                        placeholder="Dirección del proveedor"
                        style={{ borderRadius: '8px' }}
                      />
                    </Form.Group>
                  </Col>
                </Row>
              </Modal.Body>
              <Modal.Footer style={{ border: 'none', paddingTop: 0 }}>
                <Button variant="light" onClick={onClick} style={{ borderRadius: '8px' }}>
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
