import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getProductos } from '../services/api';
import { getPedidos } from '../services/api';

export default function Dashboard() {
  console.log("El Dashboard se está renderizando");
  const [stats, setStats] = useState({ productos: 0, activos: 0, pedidos: 0, pendientes: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        console.log("Intentando conectar con servicios...");
        const [prodRes, pedRes] = await Promise.allSettled([getProductos(), getPedidos()]);
        
        console.log("Resultado Productos:", prodRes);
        console.log("Resultado Pedidos:", pedRes);

        const resProductos = prodRes.status === 'fulfilled' ? prodRes.value.data : [];
        const resPedidos   = pedRes.status === 'fulfilled' ? pedRes.value.data : [];

        const productos = Array.isArray(resProductos) ? resProductos : (resProductos?.productos || []);
        const pedidos   = Array.isArray(resPedidos) ? resPedidos : (resPedidos?.pedidos || []);

        setStats({
          productos: productos.length,
          activos: productos.filter(p => p.estado).length,
          pedidos: pedidos.length,
           pendientes: pedidos.filter(p => p.estado?.toLowerCase() === 'pendiente').length,
        });
      } catch (err) {
        console.error("Error crítico en fetchStats:", err);
      } finally {
        setLoading(false);
        console.log("Carga finalizada.");
      }
    };
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <span className="loading loading-spinner loading-lg text-primary"></span>
        <p className="ml-3 text-base-content/70 font-medium">Cargando estadísticas del sistema...</p>
      </div>
    );
  }
  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1>Panel de Control</h1>
          <p>Bienvenido al sistema de gestión de Castañeda</p>
        </div>
      </div>

      {loading ? (
        <div className="loading"><div className="spinner" /></div>
      ) : (
        <div className="stats-row">
          <div className="stat-card">
            <span className="stat-label">Productos</span>
            <span className="stat-value">{stats.productos}</span>
            <span className="stat-sub">{stats.activos} activos</span>
          </div>
          <div className="stat-card">
            <span className="stat-label">Pedidos</span>
            <span className="stat-value">{stats.pedidos}</span>
            <span className="stat-sub">{stats.pendientes} pendientes</span>
          </div>
          <div className="stat-card">
            <span className="stat-label">Microservicios</span>
            <span className="stat-value">2</span>
            <span className="stat-sub">ms-productos · ms-pedidos</span>
          </div>
          <div className="stat-card">
            <span className="stat-label">Infraestructura</span>
            <span className="stat-value" style={{fontSize:'1rem',paddingTop:'6px'}}>🐳 Docker</span>
            <span className="stat-sub">Desplegado en Render</span>
          </div>
        </div>
      )}

      <div className="cards-grid" style={{marginTop: '1rem'}}>
        <div className="card">
          <div className="card-body">
            <div style={{fontSize:'2rem', marginBottom:'0.75rem'}}>🍪</div>
            <h3>Catálogo de Productos</h3>
            <p>Gestiona alfajores, panetones y todos los productos artesanales de Castañeda.</p>
          </div>
          <div className="card-footer">
            <span className="card-meta">Alfajores · Panetones · Temporada</span>
            <Link to="/productos" className="btn btn-primary btn-sm">Ver productos →</Link>
          </div>
        </div>

        <div className="card">
          <div className="card-body">
            <div style={{fontSize:'2rem', marginBottom:'0.75rem'}}>📦</div>
            <h3>Gestión de Pedidos</h3>
            <p>Registra, actualiza y controla todos los pedidos de clientes en tiempo real.</p>
          </div>
          <div className="card-footer">
            <span className="card-meta">Pendientes · Completados · Cancelados</span>
            <Link to="/pedidos" className="btn btn-primary btn-sm">Ver pedidos →</Link>
          </div>
        </div>
      </div>

      {/* Arquitectura */}
      <div style={{marginTop:'2.5rem', background:'white', borderRadius:'var(--radius-lg)', border:'1px solid var(--border)', padding:'1.5rem'}}>
        <h3 style={{color:'var(--green-dark)', marginBottom:'1rem', fontSize:'1.1rem'}}>Arquitectura del Sistema</h3>
        <div style={{display:'flex', gap:'12px', flexWrap:'wrap', alignItems:'center', fontSize:'0.85rem', color:'var(--text-mid)'}}>
          <span style={{background:'var(--green-pale)', padding:'6px 14px', borderRadius:'8px', fontWeight:'500'}}>⚛️ React + Vite</span>
          <span style={{color:'var(--text-soft)'}}>→</span>
          <span style={{background:'var(--green-pale)', padding:'6px 14px', borderRadius:'8px', fontWeight:'500'}}>🐳 ms-productos (Docker)</span>
          <span style={{color:'var(--text-soft)'}}>+</span>
          <span style={{background:'var(--green-pale)', padding:'6px 14px', borderRadius:'8px', fontWeight:'500'}}>🐳 ms-pedidos (Docker)</span>
          <span style={{color:'var(--text-soft)'}}>→</span>
          <span style={{background:'var(--green-pale)', padding:'6px 14px', borderRadius:'8px', fontWeight:'500'}}>🗄️ PostgreSQL (Neon)</span>
        </div>
      </div>
    </div>
  );
}
