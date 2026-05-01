import { useState, useEffect } from 'react';
import { Modal, Button, Table, Form } from 'react-bootstrap';
import API             from '../../api/axios';
import Loading         from '../../components/common/Loading';
import AlertaMensaje   from '../../components/common/AlertaMensaje';
import { FaPlus, FaEdit, FaTrash } from 'react-icons/fa';

const inicial = { nombre: '', descripcion: '' };

const Categorias = () => {
  const [categorias, setCategorias] = useState([]);
  const [loading,    setLoading]    = useState(true);
  const [error,      setError]      = useState('');
  const [exito,      setExito]      = useState('');

  // Modal
  const [modal,      setModal]      = useState(false);
  const [modalElim,  setModalElim]  = useState(false);
  const [form,       setForm]       = useState(inicial);
  const [editando,   setEditando]   = useState(null);
  const [eliminando, setEliminando] = useState(null);
  const [guardando,  setGuardando]  = useState(false);

  // ─── Cargar categorías ──────────────────────────────────
  const cargar = async () => {
    try {
      setLoading(true);
      const { data } = await API.get('/categorias');
      setCategorias(data.data);
    } catch {
      setError('Error al cargar categorías');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { cargar(); }, []);

  // ─── Abrir modal crear ──────────────────────────────────
  const abrirCrear = () => {
    setForm(inicial);
    setEditando(null);
    setModal(true);
  };

  // ─── Abrir modal editar ─────────────────────────────────
  const abrirEditar = (cat) => {
    setForm({ nombre: cat.nombre, descripcion: cat.descripcion || '' });
    setEditando(cat.id);
    setModal(true);
  };

  // ─── Guardar (crear o editar) ───────────────────────────
  const guardar = async (e) => {
    e.preventDefault();
    setGuardando(true);
    try {
      if (editando) {
        await API.put(`/categorias/${editando}`, form);
        setExito('Categoría actualizada correctamente');
      } else {
        await API.post('/categorias', form);
        setExito('Categoría creada correctamente');
      }
      setModal(false);
      cargar();
    } catch (err) {
      setError(err.response?.data?.mensaje || 'Error al guardar');
    } finally {
      setGuardando(false);
    }
  };

  // ─── Eliminar ───────────────────────────────────────────
  const confirmarEliminar = (cat) => {
    setEliminando(cat);
    setModalElim(true);
  };

  const eliminar = async () => {
    try {
      await API.delete(`/categorias/${eliminando.id}`);
      setExito('Categoría eliminada correctamente');
      setModalElim(false);
      cargar();
    } catch (err) {
      setError(err.response?.data?.mensaje || 'Error al eliminar');
    }
  };

  if (loading) return <Loading />;

  return (
    <div>
      {/* Título */}
      <div style={{
        display:        'flex',
        justifyContent: 'space-between',
        alignItems:     'center',
        marginBottom:   '24px',
        flexWrap:       'wrap',
        gap:            '12px'
      }}>
        <div>
          <h4 style={{ margin: 0, fontWeight: 700, color: '#1a1f2e' }}>
            Categorías
          </h4>
          <p style={{ margin: '4px 0 0', color: '#8892a4', fontSize: '14px' }}>
            {categorias.length} categorías registradas
          </p>
        </div>
        <Button
          onClick={abrirCrear}
          style={{
            background:   '#4e9af1',
            border:       'none',
            borderRadius: '8px',
            padding:      '8px 16px',
            display:      'flex',
            alignItems:   'center',
            gap:          '8px'
          }}
        >
          <FaPlus /> Nueva Categoría
        </Button>
      </div>

      {/* Alertas */}
      <AlertaMensaje tipo="danger"  mensaje={error} onClose={() => setError('')} />
      <AlertaMensaje tipo="success" mensaje={exito} onClose={() => setExito('')} />

      {/* Tabla */}
      <div style={{
        background:   '#fff',
        borderRadius: '12px',
        boxShadow:    '0 1px 4px rgba(0,0,0,0.08)',
        overflow:     'hidden'
      }}>
        <Table hover responsive style={{ margin: 0 }}>
          <thead style={{ background: '#f8fafc' }}>
            <tr>
              <th style={{ padding: '14px 20px', color: '#8892a4', fontWeight: 600, fontSize: '13px' }}>#</th>
              <th style={{ padding: '14px 20px', color: '#8892a4', fontWeight: 600, fontSize: '13px' }}>Nombre</th>
              <th style={{ padding: '14px 20px', color: '#8892a4', fontWeight: 600, fontSize: '13px' }}>Descripción</th>
              <th style={{ padding: '14px 20px', color: '#8892a4', fontWeight: 600, fontSize: '13px' }}>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {categorias.length === 0 ? (
              <tr>
                <td colSpan={4} style={{ textAlign: 'center', padding: '40px', color: '#8892a4' }}>
                  No hay categorías registradas
                </td>
              </tr>
            ) : (
              categorias.map((cat, i) => (
                <tr key={cat.id}>
                  <td style={{ padding: '14px 20px', color: '#8892a4' }}>{i + 1}</td>
                  <td style={{ padding: '14px 20px', fontWeight: 600, color: '#1a1f2e' }}>
                    {cat.nombre}
                  </td>
                  <td style={{ padding: '14px 20px', color: '#8892a4' }}>
                    {cat.descripcion || '—'}
                  </td>
                  <td style={{ padding: '14px 20px' }}>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button
                        onClick={() => abrirEditar(cat)}
                        style={{
                          background:   '#ebf4ff',
                          color:        '#4e9af1',
                          border:       'none',
                          borderRadius: '6px',
                          padding:      '6px 10px',
                          cursor:       'pointer'
                        }}
                      >
                        <FaEdit />
                      </button>
                      <button
                        onClick={() => confirmarEliminar(cat)}
                        style={{
                          background:   '#fff5f5',
                          color:        '#fc8181',
                          border:       'none',
                          borderRadius: '6px',
                          padding:      '6px 10px',
                          cursor:       'pointer'
                        }}
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </Table>
      </div>

      {/* Modal Crear/Editar */}
      <Modal show={modal} onHide={() => setModal(false)} centered>
        <Modal.Header closeButton style={{ border: 'none', paddingBottom: 0 }}>
          <Modal.Title style={{ fontWeight: 700, fontSize: '18px' }}>
            {editando ? 'Editar Categoría' : 'Nueva Categoría'}
          </Modal.Title>
        </Modal.Header>
        <Form onSubmit={guardar}>
          <Modal.Body style={{ padding: '20px 24px' }}>
            <Form.Group className="mb-3">
              <Form.Label style={{ fontWeight: 600, fontSize: '13px' }}>
                Nombre *
              </Form.Label>
              <Form.Control
                type="text"
                value={form.nombre}
                onChange={e => setForm({ ...form, nombre: e.target.value })}
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
                rows={3}
                value={form.descripcion}
                onChange={e => setForm({ ...form, descripcion: e.target.value })}
                placeholder="Descripción opcional"
                style={{ borderRadius: '8px' }}
              />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer style={{ border: 'none', paddingTop: 0 }}>
            <Button
              variant="light"
              onClick={() => setModal(false)}
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

      {/* Modal Eliminar */}
      <Modal show={modalElim} onHide={() => setModalElim(false)} centered>
        <Modal.Header closeButton style={{ border: 'none' }}>
          <Modal.Title style={{ fontWeight: 700, fontSize: '18px' }}>
            Eliminar Categoría
          </Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ padding: '0 24px 20px' }}>
          ¿Estás seguro que deseas eliminar la categoría{' '}
          <strong>{eliminando?.nombre}</strong>?
        </Modal.Body>
        <Modal.Footer style={{ border: 'none', paddingTop: 0 }}>
          <Button
            variant="light"
            onClick={() => setModalElim(false)}
            style={{ borderRadius: '8px' }}
          >
            Cancelar
          </Button>
          <Button
            variant="danger"
            onClick={eliminar}
            style={{ borderRadius: '8px' }}
          >
            Eliminar
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Categorias;