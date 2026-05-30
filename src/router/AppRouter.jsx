import { Routes, Route, Navigate } from 'react-router-dom';
import Home from '../pages/Home';
import Dashboard from '../pages/Dashboard';
import Productos from '../pages/Productos';
import Pedidos from '../pages/Pedidos';
import Login from '../pages/Login';
import ProductoFormPage from '../pages/ProductoFormPage';
import useAuthStore from '../store/useAuthStore';

export default function AppRouter() {
  const { token } = useAuthStore();
  const isAuth = !!token; 

  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={!isAuth ? <Login /> : <Navigate to="/dashboard" />} />

      <Route path="/dashboard" element={isAuth ? <Dashboard /> : <Navigate to="/login" />} />
      <Route path="/productos" element={isAuth ? <Productos /> : <Navigate to="/login" />} />
      <Route path="/productos/nuevo" element={isAuth ? <ProductoFormPage /> : <Navigate to="/login" />} />
      <Route path="/productos/editar/:id" element={isAuth ? <ProductoFormPage /> : <Navigate to="/login" />} />
      <Route path="/pedidos" element={isAuth ? <Pedidos /> : <Navigate to="/login" />} />

      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}