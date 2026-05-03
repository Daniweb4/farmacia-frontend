import { Modal, Button, Form } from 'react-bootstrap';

const ModalPassword = ({ show, onHide, form, onChange, onSubmit, usuario, guardando }) => {
  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton style={{ border: 'none', paddingBottom: 0 }}>
        <Modal.Title style={{ fontWeight: 700, fontSize: '18px' }}>
          Cambiar Contraseña — {usuario?.nombre}
        </Modal.Title>
      </Modal.Header>
      <Form onSubmit={onSubmit}>
        <Modal.Body style={{ padding: '20px 24px' }}>
          <Form.Group className="mb-3">
            <Form.Label style={{ fontWeight: 600, fontSize: '13px' }}>
              Contraseña actual *
            </Form.Label>
            <Form.Control
              type="password" name="password_actual"
              value={form.password_actual}
              onChange={onChange} required
              style={{ borderRadius: '8px' }}
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label style={{ fontWeight: 600, fontSize: '13px' }}>
              Nueva contraseña *
            </Form.Label>
            <Form.Control
              type="password" name="password_nuevo"
              value={form.password_nuevo}
              onChange={onChange} required
              style={{ borderRadius: '8px' }}
            />
          </Form.Group>
          <Form.Group>
            <Form.Label style={{ fontWeight: 600, fontSize: '13px' }}>
              Confirmar contraseña *
            </Form.Label>
            <Form.Control
              type="password" name="confirmar"
              value={form.confirmar}
              onChange={onChange} required
              style={{ borderRadius: '8px' }}
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer style={{ border: 'none', paddingTop: 0 }}>
          <Button variant="light" onClick={onHide} style={{ borderRadius: '8px' }}>
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
  );
};

export default ModalPassword;