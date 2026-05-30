import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '../store/useAuthStore';
import toast from 'react-hot-toast';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const login = useAuthStore((state) => state.login);
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email && password) {
      // Guardamos la sesión global usando Zustand
      login({ email, name: 'Admin' }, 'Admin-Castañeda');
      toast.success('¡Bienvenido al sistema!');
      // Te redirige directamente al Panel de Control administrativo
      navigate('/dashboard');
    } else {
      toast.error('Por favor, llena todos los campos');
    }
  };

  return (
    // 'page' centra y da espacio lateral, 'flex' con 'justify-center' centra el contenido
    <div className="page" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
      
      {/* Usamos un contenedor que actúe como tarjeta */}
      <div className="card" style={{ width: '100%', maxWidth: '450px', padding: '2rem' }}>
        
        <div className="text-center" style={{ marginBottom: '1.5rem' }}>
          <h2 style={{ color: 'var(--green-dark)', fontFamily: 'Playfair Display' }}>Iniciar Sesión</h2>
          <p style={{ color: 'var(--text-soft)', fontSize: '0.9rem' }}>Ingresa al sistema de gestión de Castañeda</p>
        </div>

        <form onSubmit={handleSubmit} className="form-grid">
          <div className="form-group">
            <label>Usuario o Correo</label>
            <input 
              type="text" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              placeholder="Ej. Admin" 
            />
          </div>

          <div className="form-group">
            <label>Contraseña</label>
            <input 
              type="password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              placeholder="••••••••" 
            />
          </div>

          <div className="form-actions" style={{ marginTop: '1rem' }}>
            <button type="submit" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
              Ingresar al Sistema
            </button>
          </div>
        </form>
        
      </div>
    </div>
  );
}

export default Login;