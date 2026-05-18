import React from 'react'
import { Modal, Button } from 'react-bootstrap';
const ModalEliminarProducto = ({show, onHide, producto, onEliminarProducto }) => {
  return (
     <Modal show={show} onHide={onHide} centered>
            <Modal.Header closeButton style={{ border: 'none' }}>
              <Modal.Title style={{ fontWeight: 700, fontSize: '18px' }}>Eliminar Producto</Modal.Title>
            </Modal.Header>
            <Modal.Body style={{ padding: '0 24px 20px' }}>
              ¿Estás seguro que deseas eliminar <strong>{producto?.nombre}</strong>?
            </Modal.Body>
            <Modal.Footer style={{ border: 'none', paddingTop: 0 }}>
              <Button variant="light" onClick={onHide} style={{ borderRadius: '8px' }}>
                Cancelar
              </Button>
              <Button variant="danger" onClick={onEliminarProducto} style={{ borderRadius: '8px' }}>
                Eliminar
              </Button>
            </Modal.Footer>
          </Modal>
  )
}

export default ModalEliminarProducto
