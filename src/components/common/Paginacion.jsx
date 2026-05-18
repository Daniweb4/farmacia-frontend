const Paginacion = ({ paginacion, onCambiar }) => {
  if (!paginacion || paginacion.totalPaginas <= 1) return null;

  const { pagina, totalPaginas, total, limite } = paginacion;

  const inicio = (pagina - 1) * limite + 1;
  const fin    = Math.min(pagina * limite, total);

  // Generar páginas visibles
  const paginas = [];
  for (let i = 1; i <= totalPaginas; i++) {
    if (
      i === 1 ||
      i === totalPaginas ||
      (i >= pagina - 1 && i <= pagina + 1)
    ) {
      paginas.push(i);
    }
  }

  // Agregar puntos suspensivos
  const paginasConPuntos = [];
  paginas.forEach((p, i) => {
    if (i > 0 && p - paginas[i - 1] > 1) {
      paginasConPuntos.push('...');
    }
    paginasConPuntos.push(p);
  });

  const btnStyle = (activo) => ({
    padding:      '6px 12px',
    border:       `1px solid ${activo ? '#4e9af1' : '#e2e8f0'}`,
    borderRadius: '6px',
    background:   activo ? '#4e9af1' : '#fff',
    color:        activo ? '#fff' : '#1a1f2e',
    cursor:       activo ? 'default' : 'pointer',
    fontSize:     '13px',
    fontWeight:   activo ? 600 : 400,
    minWidth:     '36px',
    textAlign:    'center'
  });

  return (
    <div style={{
      display:        'flex',
      justifyContent: 'space-between',
      alignItems:     'center',
      padding:        '16px 20px',
      borderTop:      '1px solid #e2e8f0',
      flexWrap:       'wrap',
      gap:            '12px'
    }}>
      {/* Info */}
      <span style={{ fontSize: '13px', color: '#8892a4' }}>
        Mostrando {inicio}–{fin} de {total} registros
      </span>

      {/* Botones */}
      <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
        {/* Anterior */}
        <button
          onClick={() => onCambiar(pagina - 1)}
          disabled={pagina === 1}
          style={{
            ...btnStyle(false),
            opacity: pagina === 1 ? 0.4 : 1,
            cursor:  pagina === 1 ? 'not-allowed' : 'pointer'
          }}
        >
          ‹
        </button>

        {/* Páginas */}
        {paginasConPuntos.map((p, i) => (
          p === '...' ? (
            <span key={`puntos-${i}`} style={{ color: '#8892a4', padding: '0 4px' }}>...</span>
          ) : (
            <button
              key={p}
              onClick={() => onCambiar(p)}
              style={btnStyle(p === pagina)}
            >
              {p}
            </button>
          )
        ))}

        {/* Siguiente */}
        <button
          onClick={() => onCambiar(pagina + 1)}
          disabled={pagina === totalPaginas}
          style={{
            ...btnStyle(false),
            opacity: pagina === totalPaginas ? 0.4 : 1,
            cursor:  pagina === totalPaginas ? 'not-allowed' : 'pointer'
          }}
        >
          ›
        </button>
      </div>
    </div>
  );
};

export default Paginacion;