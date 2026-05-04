import React from 'react'
import { Modal, Button } from 'react-bootstrap';
export const ModelEliminarCategoria = ({show, onHide, categoria, onEliminar }) => {
  return (
      <Modal show={show} onHide={onHide} centered>
            <Modal.Header closeButton style={{ border: 'none' }}>
              <Modal.Title style={{ fontWeight: 700, fontSize: '18px' }}>
                Eliminar Categoría
              </Modal.Title>
            </Modal.Header>
            <Modal.Body style={{ padding: '0 24px 20px' }}>
              ¿Estás seguro que deseas eliminar la categoría{' '}
              <strong>{categoria?.nombre}</strong>?
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
                variant="danger"
                onClick={onEliminar}
                style={{ borderRadius: '8px' }}
              >
                Eliminar
              </Button>
            </Modal.Footer>
          </Modal>
  )
}
