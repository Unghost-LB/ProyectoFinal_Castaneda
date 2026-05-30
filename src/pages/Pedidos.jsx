import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { usePedidos } from '../hooks/usePedidos';
import { useProductos } from '../hooks/useProductos'; 

const MAPA_ESTADOS = {
  'REGISTRADO': 'Registrado',
  'PAGADO': 'Completado',
  'CANCELADO': 'Cancelado',
  'DEVUELTO': 'Devuelto'
};

const EMPTY_FORM = {
  cliente: '', correoCliente: '', productoId: '', nombreProducto: '',
  cantidad: '', precioUnitario: '', total: '', estado: 'REGISTRADO'
};

export default function Pedidos() {
  const { data: pedidos, loading, createPedido, updatePedido, removePedido, fetchPedidos } = usePedidos();
  const { data: productosData, fetchProductos } = useProductos();

  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [editId, setEditId] = useState(null); 
  const [saving, setSaving] = useState(false);
  const [filtro, setFiltro] = useState('todos');

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [pedidoToDelete, setPedidoToDelete] = useState(null);
  
  const pedidosList = Array.isArray(pedidos) ? pedidos : (pedidos?.pedidos || []);
  const productosList = Array.isArray(productosData) ? productosData : (productosData?.productos || []);

  useEffect(() => { 
    fetchPedidos(); 
    if (fetchProductos) fetchProductos(); 
  }, []);

  const handleProductoChange = (productoId) => {
    const prod = productosList.find(p => String(p.id) === String(productoId));
    if (prod) {
      setForm(f => ({ 
        ...f, 
        productoId, 
        nombreProducto: prod.nombre, 
        precioUnitario: prod.precio, 
        total: (prod.precio * (parseInt(f.cantidad) || 1)).toFixed(2) 
      }));
    } else {
      setForm(f => ({ ...f, productoId, nombreProducto: '', precioUnitario: '', total: '' }));
    }
  };

  const handleCantidadChange = (cantidad) => {
    const total = (parseFloat(form.precioUnitario || 0) * (parseInt(cantidad) || 0)).toFixed(2);
    setForm(f => ({ ...f, cantidad, total }));
  };

  const openCreate = () => { setForm(EMPTY_FORM); setEditId(null); setModalOpen(true); };

  const openEdit = (p) => {
    const primerItem = p.items && p.items.length > 0 ? p.items[0] : null;
    
    let rawId = p.producto_id || p.productoId || p.producto?.id || primerItem?.producto_id || primerItem?.productoId;
    const nombreBuscado = p.nombreProducto || p.nombre_producto || p.producto?.nombre || '';
    
    if (!rawId && nombreBuscado) {
      const productoEnlazado = productosList.find(
        prod => (prod.nombre || '').toLowerCase() === nombreBuscado.toLowerCase()
      );
      if (productoEnlazado) rawId = productoEnhazado.id || productoEnlazado.producto_id;
    }

    const idProductoCorrecto = rawId ? String(rawId).trim() : '';
    const cantidadCorrecta = p.cantidad || primerItem?.cantidad || 1;
    const precioUnitarioCorrecto = p.precio_unitario || p.precioUnitario || primerItem?.precio_unitario || p.producto?.precio || 0;

    setForm({ 
      cliente: p.cliente || '', 
      correoCliente: p.correoCliente || '', 
      productoId: idProductoCorrecto, 
      nombreProducto: nombreBuscado || 'Producto', 
      cantidad: cantidadCorrecta, 
      precioUnitario: precioUnitarioCorrecto, 
      total: p.total || (precioUnitarioCorrecto * cantidadCorrecta).toFixed(2), 
      estado: p.estado?.toUpperCase() || 'REGISTRADO' 
    });
    
    setEditId(p.id); 
    setModalOpen(true);
  };

  const handleSubmit = async () => {
    if (!form.cliente || !form.correoCliente || !form.productoId || form.productoId === "" || !form.cantidad) {
      return toast.error('Completa los campos obligatorios, incluyendo el producto');
    }
    
    setSaving(true);
    try {
      if (editId) {
        
        const payloadEstado = { 
          estado: form.estado 
        };
        
        await updatePedido(editId, payloadEstado);
        toast.success('Estado del pedido actualizado ✓');
      } else {
        const payloadCrear = { 
          cliente: form.cliente,
          correoCliente: form.correoCliente, 
          productoId: parseInt(form.productoId), 
          nombreProducto: form.nombreProducto, 
          cantidad: parseInt(form.cantidad),
          precioUnitario: parseFloat(form.precioUnitario)
        };
        
        await createPedido(payloadCrear);
        toast.success('Pedido creado con éxito ✓');
      }
      
      setModalOpen(false); 
      fetchPedidos();      
    } catch (error) {
      setSaving(false);
      
      const mensajeReal = error.response?.data?.message || error.message;
      toast.error(`Error: ${mensajeReal}`);
      console.error("DETALLE DEL ERROR:", error);
    }
    setSaving(false);
  };

  const openDeleteModal = (id) => {
    setPedidoToDelete(id);
    setDeleteModalOpen(true);
  };

  const executeDelete = async () => {
    try {
      await removePedido(pedidoToDelete);
      toast.success('Pedido eliminado con éxito');
      fetchPedidos();
      setDeleteModalOpen(false);
      setPedidoToDelete(null);
    } catch {
      toast.error('Error al eliminar el pedido');
    }
  };
  const traducirEstado = (estado) => {
    const map = {
      'PAGADO': 'Completado',
      'REGISTRADO': 'Registrado',
      'CANCELADO': 'Cancelado',
      'DEVUELTO': 'Devuelto'
    };
    return map[estado?.toUpperCase()] || estado;
  };

  const pedidosFiltrados = pedidosList.filter(p => {
    if (filtro === 'todos') return true;
    return p.estado?.toUpperCase() === filtro.toUpperCase();
  });

  const stats = {
    total: pedidosList.length,
    pendientes: pedidosList.filter(p => p.estado?.toUpperCase() === 'REGISTRADO').length,
    completados: pedidosList.filter(p => p.estado?.toUpperCase() === 'PAGADO').length,
    ingresos: pedidosList.filter(p => p.estado?.toUpperCase() === 'PAGADO')
                .reduce((sum, p) => sum + parseFloat(p.total || 0), 0).toFixed(2),
  };

  const badgeClass = (estado) => {
    const map = { 
      'PAGADO': 'badge-completado', 
      'CANCELADO': 'badge-cancelado',
      'REGISTRADO': 'badge-pendiente' 
    };
    return map[estado?.toUpperCase()] || 'badge-pendiente';
  };

  const formatDate = (dt) => dt ? new Date(dt).toLocaleDateString('es-PE', { day: '2-digit', month: 'short', year: 'numeric' }) : '—';

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1>Pedidos</h1>
          <p>Gestión de órdenes de clientes</p>
        </div>
        <button className="btn btn-primary" onClick={openCreate}>+ Nuevo pedido</button>
      </div>

      <div className="stats-row">
        <div className="stat-card">
          <span className="stat-label">Total pedidos</span>
          <span className="stat-value">{stats.total}</span>
        </div>
        <div className="stat-card">
          <span className="stat-label">Pendientes</span>
          <span className="stat-value">{stats.pendientes}</span>
        </div>
        <div className="stat-card">
          <span className="stat-label">Completados</span>
          <span className="stat-value">{stats.completados}</span>
        </div>
        <div className="stat-card">
          <span className="stat-label">Ingresos</span>
          <span className="stat-value" style={{fontSize:'1.3rem'}}>S/ {stats.ingresos}</span>
          <span className="stat-sub">Solo completados</span>
        </div>
      </div>

      <div className="filter-bar">
        <button className={`filter-chip ${filtro === 'todos' ? 'active' : ''}`} onClick={() => setFiltro('todos')}>Todos</button>
        {Object.entries(MAPA_ESTADOS).map(([valor, label]) => (
          <button key={valor} className={`filter-chip ${filtro === valor ? 'active' : ''}`} onClick={() => setFiltro(valor)}>
            {label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="loading"><div className="spinner" /><span>Cargando pedidos...</span></div>
      ) : pedidosFiltrados.length === 0 ? (
        <div className="empty-state">
          <div className="icon">📦</div>
          <h3>No hay pedidos</h3>
          <p>Los pedidos aparecerán aquí una vez registrados</p>
        </div>
      ) : (
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>#</th>
                <th>Cliente</th>
                <th>Producto</th>
                <th>Cant.</th>
                <th>Total</th>
                <th>Estado</th>
                <th>Fecha</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {pedidosFiltrados.map(p => {
                const primerItem = p.items && p.items.length > 0 ? p.items[0] : null;
                const nombreProductoMostrar = p.nombreProducto || p.nombre_producto || (primerItem ? `Producto ID: ${primerItem.producto_id || primerItem.productoId}` : 'Sin productos');
                const cantidadMostrar = p.cantidad || (primerItem ? primerItem.cantidad : 0);

                return (
                  <tr key={p.id}>
                    <td data-label="#">{p.id}</td>
                    <td data-label="Cliente">
                      <div style={{fontWeight:'500', color:'var(--text-dark)'}}>{p.cliente}</div>
                      <div style={{fontSize:'0.78rem', color:'var(--text-soft)'}}>{p.correoCliente}</div>
                    </td>
                    <td data-label="Producto">{nombreProductoMostrar}</td>
                    <td data-label="Cant.">{cantidadMostrar}</td>
                    <td data-label="Total" style={{fontWeight:'600', color:'var(--green-dark)'}}>
                      S/ {parseFloat(p.total || 0).toFixed(2)}
                    </td>
                    <td data-label="Estado">
                      <span className={`card-badge ${badgeClass(p.estado)}`}>
                        {traducirEstado(p.estado)} 
                      </span>
                    </td>
                    <td data-label="Fecha">{formatDate(p.fechaPedido || p.created_at)}</td>
                    <td data-label="Acciones">
                      <div style={{display:'flex', gap:'6px'}}>
                        <button className="btn btn-secondary btn-sm" onClick={() => openEdit(p)}>✏️</button>
                        <button className="btn btn-danger btn-sm" onClick={() => openDeleteModal(p.id)}>🗑️</button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {modalOpen && (
        <div className="modal-overlay" onClick={e => e.target === e.currentTarget && setModalOpen(false)}>
          <div className="modal">
            <div className="modal-header">
              <h2>{editId ? 'Cambiar Estado del Pedido' : 'Nuevo pedido'}</h2>
              <button className="modal-close" onClick={() => setModalOpen(false)}>×</button>
            </div>
            <div className="modal-body">
              <div className="form-grid">
                <div className="form-row">
                  <div className="form-group">
                    <label>Cliente *</label>
                    <input 
                      value={form.cliente} 
                      onChange={e => setForm({...form, cliente: e.target.value})} 
                      placeholder="Nombre del cliente" 
                      readOnly={!!editId} 
                      style={editId ? { background: '#f3f4f6', color: '#6b7280' } : {}}
                    />
                  </div>
                  <div className="form-group">
                    <label>Correo *</label>
                    <input 
                      type="email" 
                      value={form.correoCliente} 
                      onChange={e => setForm({...form, correoCliente: e.target.value})} 
                      placeholder="correo@ejemplo.com" 
                      readOnly={!!editId} 
                      style={editId ? { background: '#f3f4f6', color: '#6b7280' } : {}}
                    />
                  </div>
                </div>
                <div className="form-group">
                  <label>Producto *</label>
                  {editId ? (
                    <input 
                      value={form.nombreProducto} 
                      readOnly 
                      style={{ background: '#f3f4f6', color: '#6b7280' }} 
                    />
                  ) : (
                    <select 
                      value={String(form.productoId || '')} 
                      onChange={e => handleProductoChange(e.target.value)}
                    >
                      <option value="">— Selecciona un producto —</option>
                      {productosList.map(p => {
                        const itemOptionId = String(p.id || p.producto_id || '');
                        return (
                          <option key={itemOptionId} value={itemOptionId}>
                            {p.nombre || p.nombreProducto} — S/ {parseFloat(p.precio || p.precio_unitario || 0).toFixed(2)}
                          </option>
                        );
                      })}
                    </select>
                  )}
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>Cantidad *</label>
                    <input 
                      type="number" 
                      min="1" 
                      value={form.cantidad} 
                      onChange={e => handleCantidadChange(e.target.value)} 
                      placeholder="1" 
                      readOnly={!!editId} 
                      style={editId ? { background: '#f3f4f6', color: '#6b7280' } : {}}
                    />
                  </div>
                  <div className="form-group">
                    <label>Total S/</label>
                    <input value={form.total ? `S/ ${parseFloat(form.total).toFixed(2)}` : ''} readOnly style={{background:'var(--green-pale)', fontWeight:'600', color:'var(--green-dark)'}} />
                  </div>
                </div>
                <div className="form-group">
                  <label className="block text-sm font-medium text-gray-700 mb-1">ESTADO DEL PEDIDO</label>
                  <select
                    className="w-full p-2 border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    value={form.estado}
                    onChange={(e) => setForm({ ...form, estado: e.target.value })}
                  >
                    <option value="REGISTRADO">Registrado</option>
                    <option value="PAGADO">Completado (Pagado)</option>
                    <option value="CANCELADO">Cancelado</option>
                    <option value="DEVUELTO">Devuelto</option>
                  </select>
                </div>
              </div>
              <div className="form-actions">
                <button className="btn btn-secondary" onClick={() => setModalOpen(false)}>Cancelar</button>
                <button className="btn btn-primary" onClick={handleSubmit} disabled={saving}>
                  {saving ? 'Guardando...' : editId ? 'Actualizar Estado' : 'Crear pedido'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {deleteModalOpen && (
        <div className="modal-overlay" onClick={e => e.target === e.currentTarget && setDeleteModalOpen(false)}>
          <div className="modal" style={{ maxWidth: '400px', textAlign: 'center' }}>
            <div className="modal-body" style={{ padding: '2rem' }}>
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>⚠️</div>
              <h2 style={{ marginBottom: '1rem' }}>Eliminar pedido</h2>
              <p style={{ marginBottom: '2rem', color: '#6b7280' }}>
                ¿Estás seguro de que deseas eliminar este pedido? Esta acción no se puede deshacer.
              </p>
              <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem' }}>
                <button className="btn btn-secondary" onClick={() => setDeleteModalOpen(false)}>Cancelar</button>
                <button className="btn btn-danger" style={{ backgroundColor: '#ef4444', color: 'white' }} onClick={executeDelete}>Sí, eliminar</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}