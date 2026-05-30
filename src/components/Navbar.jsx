// components/Navbar.jsx
import { Link, useNavigate } from 'react-router-dom';
import useAuthStore from '../store/useAuthStore';

function Navbar() {
  // Obtenemos el usuario del store. Si es null, no hay sesión.
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/'); // Al cerrar sesión, volvemos al Home público
  };

  return (
    <nav className="navbar">
      <Link to="/" className="navbar-brand">
        <img 
          src="/imagenes/Castañeda_logo.png" 
          alt="Logo Castañeda" 
          className="logo-circular" 
          style={{ width: '40px', height: '40px', objectFit: 'contain' }} 
        />
        <span>Castañeda</span>
      </Link>

      <ul className="navbar-links">
        <li><Link to="/">Inicio</Link></li>
        {user && (
          <>
            <li><Link to="/dashboard">Panel de Control</Link></li>
            <li><Link to="/productos">Productos</Link></li>
            <li><Link to="/pedidos">Pedidos</Link></li>
          </>
        )}
      </ul>

      <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
        {user ? (
          <>
            <span style={{ color: 'white', fontSize: '0.9rem' }}>Hola, {user.name}</span>
            <button onClick={handleLogout} className="btn btn-sm btn-secondary">Cerrar sesión</button>
          </>
        ) : (
          <Link to="/login" className="btn btn-sm btn-primary">Iniciar sesión</Link>
        )}
      </div>
    </nav>
  );
}
export default Navbar;