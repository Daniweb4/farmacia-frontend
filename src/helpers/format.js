// Formatear moneda en dólares
export const formatMoney = (valor) => {
  return new Intl.NumberFormat('es-EC', {
    style:    'currency',
    currency: 'USD'
  }).format(valor);
};

// Formatear fecha
export const formatFecha = (fecha) => {
  return new Date(fecha).toLocaleDateString('es-EC', {
    year:  'numeric',
    month: '2-digit',
    day:   '2-digit'
  });
};

// Formatear fecha y hora
export const formatFechaHora = (fecha) => {
  return new Date(fecha).toLocaleString('es-EC', {
    year:   'numeric',
    month:  '2-digit',
    day:    '2-digit',
    hour:   '2-digit',
    minute: '2-digit'
  });
};