import { useEffect } from 'react';
import { useProductos } from '../hooks/useProductos';


const PRODUCTOS_RESPALDO = [
  { id: 'r1', nombre: 'Alfajor Tradicional de Manjar', descripcion: 'Delicada masa artesanal espolvoreada con azúcar impalpable y abundante manjar blanco.', precio: 4.50, estado: true },
  { id: 'r2', nombre: 'Alfajor de Miel Castañeda', descripcion: 'Preparado con miel de abeja seleccionada de la región y un toque secreto de la casa.', precio: 5.00, estado: true },
  { id: 'r3', nombre: 'Panetón Artesanal Especial', descripcion: 'Horneado lentamente con masa madre, pasas tiernas y frutas confitadas de temporada.', precio: 28.00, estado: true }
];

export default function Home() {
const { data: productos, loading,  fetchProductos } = useProductos();
  
  useEffect(() => {
    if (fetchProductos) {
      fetchProductos();
    }
  }, []);

  useEffect(() => {
    if (productos) {
      console.log("👉 CONTENIDO REAL DE TU API DE PRODUCTOS:", productos);
    }
  }, [productos]);

  // 1. Normalizar de forma ultra segura la respuesta del Hook
  let apiList = [];
  if (productos) {
    if (Array.isArray(productos)) {
      apiList = productos;
    } else if (Array.isArray(productos.productos)) {
      apiList = productos.productos;
    } else if (typeof productos === 'object') {
      // Por si la API devuelve un objeto directo con los registros
      apiList = Object.values(productos).filter(item => typeof item === 'object' && item !== null);
    }
  }

  const productosList = apiList.length > 0 ? apiList : PRODUCTOS_RESPALDO;

  // 2. Si la API trajo datos de Neon, los usamos. Si no, usamos el respaldo para que NUNCA se vea vacío.
  if (loading && apiList.length === 0) {
  return <div style={{ textAlign: 'center', padding: '50px' }}>Cargando catálogo Castañeda... 🍪</div>;
}

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '40px 24px', fontFamily: 'sans-serif' }}>
      
      {/* Encabezado Principal */}
      <div style={{ textAlign: 'center', marginBottom: '56px' }}>
        <h1 style={{ fontSize: '2.8rem', fontWeight: '800', color: '#064e3b', margin: '0 0 12px 0' }}>Castañeda</h1>
        <p style={{ color: '#4b5563', fontSize: '1.2rem', margin: '0' }}>Tradición artesanal en alfajores y dulces de temporada</p>
      </div>

      {/* Grilla de Productos */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', 
        gap: '32px'
      }}>
        {productosList
          .filter(p => p.estado === true || p.estado === 'TRUE' || p.estado === undefined || String(p.estado).toLowerCase() === 'true')
          .map((prod, index) => {
            // Aseguramos un ID único para el map sin importar cómo se llame en tu BD
            const itemKey = prod.id || prod.id_producto || `prod-${index}`;
            
            return (
              <div 
                key={itemKey} 
                style={{ 
                  backgroundColor: '#ffffff', 
                  borderRadius: '16px', 
                  boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.05)',
                  border: '1px solid #e5e7eb',
                  overflow: 'hidden',
                  display: 'flex',
                  flexDirection: 'column'
                }}
              >
                
                {/* Contenedor del Icono/Imagen */}
                
                <div style={{ 
                    backgroundColor: '#f3f4f6', 
                    height: '200px', 
                    overflow: 'hidden',
                    display: 'flex', // Asegura que el contenido sea estable
                    alignItems: 'center',
                    justifyContent: 'center'
                    }}>
                    <img 
                        src={prod.imagenUrl} 
                        alt={prod.nombre} 
                        style={{ 
                        width: '100%', 
                        height: '100%', 
                        objectFit: 'cover',
                        display: 'block' // Evita espacios extra debajo de la imagen
                        }} 
                        // Comenta el onError por ahora para probar si es la causa
                    />
                </div>
                
                {/* Cuerpo de la tarjeta */}
                <div style={{ padding: '24px', flexGrow: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <div style={{ marginBottom: '24px' }}>
                    <h3 style={{ margin: '0 0 8px 0', fontSize: '1.3rem', fontWeight: '700', color: '#111827' }}>
                      {prod.nombre || 'Producto sin nombre'}
                    </h3>
                    <p style={{ color: '#6b7280', fontSize: '0.95rem', lineHeight: '1.5', margin: '0' }}>
                      {prod.descripcion || 'Sin descripción disponible.'}
                    </p>
                  </div>
                  
                  <div style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center', 
                    marginTop: 'auto', 
                    paddingTop: '16px', 
                    borderTop: '1px solid #f3f4f6' 
                  }}>
                    <span style={{ fontSize: '1.4rem', fontWeight: '700', color: '#047857' }}>
                      S/ {parseFloat(prod.precio || 0).toFixed(2)}
                    </span>
                    <span style={{ fontSize: '0.75rem', backgroundColor: '#d1fae5', color: '#065f46', padding: '6px 12px', borderRadius: '9999px', fontWeight: '600' }}>
                      Disponible
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
      </div>
    </div>
  );
}