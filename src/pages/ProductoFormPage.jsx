import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import { createProducto, updateProducto, getProductos } from '../services/api';

const EMPTY_FORM = { nombre: '', descripcion: '', precio: '', stock: '', estado: true, categoria: 'otro', imagenUrl: '' };
const CATEGORIAS = ['alfajor', 'paneton', 'otro'];

export default function ProductoFormPage() {
  const [form, setForm]         = useState(EMPTY_FORM);
  const [saving, setSaving]       = useState(false);
  const [loading, setLoading]     = useState(false);
  
  const navigate = useNavigate();
  const { id } = useParams(); 

  useEffect(() => {
    if (id) {
      const loadProducto = async () => {
        setLoading(true);
        try {
          const res = await getProductos();
          const productoAEditar = res.data.find(p => String(p.id) === String(id));
          if (productoAEditar) {
            setForm({
              nombre: productoAEditar.nombre,
              descripcion: productoAEditar.descripcion || '',
              precio: productoAEditar.precio,
              stock: productoAEditar.stock,
              estado: productoAEditar.estado,
              categoria: productoAEditar.categoria || 'otro',
              imagenUrl: productoAEditar.imagenUrl || ''
            });
          } else {
            toast.error('Producto no encontrado');
            navigate('/productos');
          }
        } catch {
          toast.error('Error al cargar los datos del producto');
        }
        setLoading(false);
      };
      loadProducto();
    } else {
      setForm(EMPTY_FORM);
    }
  }, [id, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault(); 
    if (!form.nombre || !form.precio || form.stock === '') return toast.error('Completa los campos obligatorios');
    
    setSaving(true);
    try {
      const payload = { 
        nombre: form.nombre,
        descripcion: form.descripcion,
        precio: parseFloat(form.precio), 
        stock: parseInt(form.stock),
        estado: form.estado,
        categoria: form.categoria,
        imagenUrl: form.imagenUrl 
      };
      if (id) {
        await updateProducto(id, payload);
        toast.success('Producto actualizado con éxito');
      } else {
        await createProducto(payload);
        toast.success('Producto creado con éxito');
      }
      navigate('/productos'); 
    } catch {
      toast.error('Error al guardar el producto');
    }
    setSaving(false);
  };

  if (loading) {
    return <div className="loading"><div className="spinner" /><span>Cargando datos del producto...</span></div>;
  }

  const inputStyle = {
    width: '100%',
    padding: '0.65rem 1rem',
    borderRadius: '8px',
    border: '1px solid #cbd5e1',
    backgroundColor: '#f8fafc',
    fontSize: '1rem',
    color: '#334155',
    boxSizing: 'border-box',
    marginTop: '0.25rem',
    outline: 'none'
  };

  const labelStyle = {
    display: 'block',
    fontSize: '0.875rem',
    fontWeight: '600',
    color: '#475569'
  };

return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh', width: '100%', padding: '1rem' }}>
      
      <div 
        className="bg-base-100 shadow-xl rounded-2xl border border-base-300 p-6 sm:p-8"
        style={{ width: '100%', maxWidth: '600px', backgroundColor: '#ffffff', borderRadius: '12px', padding: '2rem', boxShadow: '0 10px 25px rgba(0,0,0,0.05)' }}
      >
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 'bold', margin: '0 0 0.5rem 0', color: '#111827' }}>
            {id ? '✏️ Editar Producto' : '✨ Nuevo Producto'}
          </h2>
          <p style={{ color: '#6b7280', fontSize: '0.9rem', margin: 0 }}>
            {id ? 'Modifica los datos del producto seleccionado.' : 'Inserta un nuevo producto al catálogo general.'}
          </p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          
          <div>
            <label style={labelStyle}>Nombre *</label>
            <input style={inputStyle} value={form.nombre} onChange={e => setForm({...form, nombre: e.target.value})} placeholder="Ej: Alfajor de manjar" />
          </div>
          
          <div>
            <label style={labelStyle}>Descripción</label>
            <input style={inputStyle} value={form.descripcion} onChange={e => setForm({...form, descripcion: e.target.value})} placeholder="Descripción breve del producto" />
          </div>
          
          <div style={{ display: 'flex', gap: '1rem' }}>
            <div style={{ flex: 1 }}>
              <label style={labelStyle}>Precio S/ *</label>
              <input style={inputStyle} type="number" min="0" step="0.10" value={form.precio} onChange={e => setForm({...form, precio: e.target.value})} placeholder="0.00" />
            </div>
            <div style={{ flex: 1 }}>
              <label style={labelStyle}>Stock *</label>
              <input style={inputStyle} type="number" min="0" value={form.stock} onChange={e => setForm({...form, stock: e.target.value})} placeholder="0" />
            </div>
          </div>
          
          <div style={{ display: 'flex', gap: '1rem' }}>
            <div style={{ flex: 1 }}>
              <label style={labelStyle}>Categoría</label>
              <select style={inputStyle} value={form.categoria} onChange={e => setForm({...form, categoria: e.target.value})}>
                {CATEGORIAS.map(c => <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>)}
              </select>
            </div>
            <div style={{ flex: 1 }}>
              <label style={labelStyle}>Estado</label>
              <select style={inputStyle} value={form.estado} onChange={e => setForm({...form, estado: e.target.value === 'true'})}>
                <option value="true">Activo</option>
                <option value="false">Inactivo</option>
              </select>
            </div>
          </div>
          
          <div>
            <label style={labelStyle}>URL de Imagen (opcional)</label>
            <input style={inputStyle} value={form.imagenUrl} onChange={e => setForm({...form, imagenUrl: e.target.value})} placeholder="https://..." />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1rem', paddingTop: '1.5rem', borderTop: '1px solid #e5e7eb' }}>
            <button type="button" className="btn btn-secondary" onClick={() => navigate('/productos')}>
              Cancelar
            </button>
            <button type="submit" className="btn btn-primary" disabled={saving}>
              {saving ? 'Guardando...' : id ? 'Actualizar Producto' : 'Crear Producto'}
            </button>
          </div>
        </form>
      </div>
      
    </div>
  );
}