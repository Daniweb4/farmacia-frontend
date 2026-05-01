import { Alert } from 'react-bootstrap';

const AlertaMensaje = ({ tipo = 'danger', mensaje, onClose }) => {
  if (!mensaje) return null;

  return (
    <Alert
      variant={tipo}
      onClose={onClose}
      dismissible={!!onClose}
    >
      {mensaje}
    </Alert>
  );
};

export default AlertaMensaje;