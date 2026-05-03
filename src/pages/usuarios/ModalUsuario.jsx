import { Modal, Button, Form, Row, Col } from 'react-bootstrap';

const ModalUsuario = ({ show, onHide, form, onChange, onSubmit, editando, guardando }) => {
  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton style={{ border: 'none', paddingBottom: 0 }}>
        <Modal.Title style={{ fontWeight: 700, fontSize: '18px' }}>
          {editando ? 'Editar Usuario' : 'Nuevo Usuario'}
        </Modal.Title>
      </Modal.Header>
      <Form onSubmit={onSubmit}>
        <Modal.Body style={{ padding: '20px 24px' }}>
          <Row>
            <Col md={12}>
              <Form.Group className="mb-3">
                <Form.Label style={{ fontWeight: 600, fontSize: '13px' }}>Nombre *</Form.Label>
                <Form.Control
                  name="nombre" value={form.nombre}
                  onChange={onChange} required
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
                  onChange={onChange} required
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
                    onChange={onChange} required
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
                  onChange={onChange}
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
          <Button variant="light" onClick={onHide} style={{ borderRadius: '8px' }}>
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
  );
};

export default ModalUsuario;