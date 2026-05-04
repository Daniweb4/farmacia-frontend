import React from 'react'
import { Modal, Button, Form } from 'react-bootstrap';
export const ModalCrearCategoria = ({show, onHide, form, onChange, onSubmit, editando, guardando}) => {
  return (
    <Modal show={show} onHide={onHide}centered>
        <Modal.Header closeButton style={{ border: 'none', paddingBottom: 0 }}>
          <Modal.Title style={{ fontWeight: 700, fontSize: '18px' }}>
            {editando ? 'Editar Categoría' : 'Nueva Categoría'}
          </Modal.Title>
        </Modal.Header>
        <Form onSubmit={onSubmit}>
          <Modal.Body style={{ padding: '20px 24px' }}>
            <Form.Group className="mb-3">
              <Form.Label style={{ fontWeight: 600, fontSize: '13px' }}>
                Nombre *
              </Form.Label>
              <Form.Control
                name="nombre" value={form.nombre}
                onChange={onChange}
                placeholder="Ej: Analgésicos"
                required
                style={{ borderRadius: '8px' }}
              />
            </Form.Group>
            <Form.Group>
              <Form.Label style={{ fontWeight: 600, fontSize: '13px' }}>
                Descripción
              </Form.Label>
              <Form.Control
                as="textarea"
                rows={9}
                value={form.descripcion}
                name="descripcion"
                onChange={onChange}
                placeholder="Descripción opcional"
                style={{ borderRadius: '8px' }}
              />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer style={{ border: 'none', paddingTop: 0 }}>
            <Button
              variant="light"
              onClick={onHide}
              style={{ borderRadius: '8px' }}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={guardando}
              style={{
                background:   '#4e9af1',
                border:       'none',
                borderRadius: '8px'
              }}
            >
              {guardando ? 'Guardando...' : 'Guardar'}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
  )
}
