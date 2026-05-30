import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProductos } from '../hooks/useProductos';

function getBadge(cat) {
  const map = { alfajor: 'badge-alfajor', paneton: 'badge-paneton', otro: 'badge-otro' };
  return map[cat] || 'badge-otro';
}

function getCatEmoji(cat) {
  const map = { alfajor: '🍪', paneton: '🎄', otro: '🛍️' };
  return map[cat] || '🛍️';
}

export default function Productos() {
  const { data: productosList, loading, removeProducto, fetchProductos } = useProductos();
  const [filtro, setFiltro] = useState('todos');
  const [search, setSearch] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchProductos();
  }, []);

  const productosValidados = Array.isArray(productosList) ? productosList : [];

  const handleDelete = async (id, nombre) => {
    if (!confirm(`¿Eliminar "${nombre}"?`)) return;
    await removeProducto(id);
    fetchProductos();
  };

  // 3. Aplica los filtros usando la variable validada (¡Recuerda cambiarlo en tu .filter!)
  const filtered = productosValidados
    .filter(p => {
      if (filtro === 'todos') return true;
      // Blindaje por si p.categoria llega nulo de la base de datos
      const catProducto = p.categoria ? String(p.categoria).toLowerCase() : 'otro';
      return catProducto === filtro.toLowerCase();
    })
    .filter(p => {
      // Blindaje por si p.nombre llega nulo
      const nombreProducto = p.nombre ? String(p.nombre).toLowerCase() : "";
      return nombreProducto.includes(search.toLowerCase());
    });

  const stats = {
    total: productosValidados.length,
    activos: productosValidados.filter(p => p.estado === true || p.estado === 'true').length,
    alfajores: productosValidados.filter(p => p.categoria?.toLowerCase() === 'alfajor').length,
    panetones: productosValidados.filter(p => p.categoria?.toLowerCase() === 'panetón').length,
  };

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1>Productos</h1>
          <p>Catálogo de productos artesanales Castañeda</p>
        </div>
        <button className="btn btn-primary" onClick={() => navigate('/productos/nuevo')}>
          + Nuevo producto
        </button>
      </div>

      <div className="stats-row">
        <div className="stat-card">
          <span className="stat-label">Total</span>
          <span className="stat-value">{stats.total}</span>
          <span className="stat-sub">{stats.activos} activos</span>
        </div>
        <div className="stat-card">
          <span className="stat-label">Alfajores </span>
          <span className="stat-value">{stats.alfajores}</span>
        </div>
        <div className="stat-card">
          <span className="stat-label">Panetones </span>
          <span className="stat-value">{stats.panetones}</span>
          <span className="stat-sub">Temporada</span>
        </div>
      </div>

      <div className="filter-bar">
        <div className="search-bar">
          <span className="search-icon">🔍</span>
          <input placeholder="Buscar producto..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        {['todos', 'alfajor', 'panetón', 'otro'].map(f => (
          <button key={f} className={`filter-chip ${filtro === f ? 'active' : ''}`} onClick={() => setFiltro(f)}>
            {f === 'todos' ? 'Todos' : f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="loading"><div className="spinner" /><span>Cargando productos...</span></div>
      ) : filtered.length === 0 ? (
        <div className="empty-state">
          <div className="icon">🍪</div>
          <h3>No hay productos</h3>
          <p>Agrega el primer producto al catálogo</p>
        </div>
      ) : (
        <div className="cards-grid">
          {filtered.map(p => (
            <div className="card" key={p.id}>
              <div className="card-body">
                <div style={{display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:'8px'}}>
                  <span className={`card-badge ${getBadge(p.categoria || 'otro')}`}>
                    {getCatEmoji(p.categoria)} {p.categoria || 'otro'}
                  </span>
                  <span className={`card-badge ${p.estado ? 'badge-activo' : 'badge-inactivo'}`}>
                    {p.estado ? 'Activo' : 'Inactivo'}
                  </span>
                </div>
                <h3>{p.nombre}</h3>
                <p>{p.descripcion || 'Sin descripción'}</p>
                <div className="card-price">S/ {parseFloat(p.precio || 0).toFixed(2)}</div>
              </div>
              <div className="card-footer">
                <span className="card-meta">Stock: {p.stock} unid.</span>
                <div style={{display:'flex', gap:'6px'}}>
                  <button className="btn btn-secondary btn-sm" onClick={() => navigate(`/productos/editar/${p.id}`)}>
                    ✏️ Editar
                  </button>
                  <button className="btn btn-danger btn-sm" onClick={() => handleDelete(p.id, p.nombre)}>🗑️</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}