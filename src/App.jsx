import { BrowserRouter } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Navbar from './components/Navbar'; // Asegúrate de que la ruta sea correcta
import AppRouter from './router/AppRouter';
import './index.css'; // Esto es clave: aquí viven tus estilos profesionales

export default function App() {
  return (
    <BrowserRouter>
      <Toaster position="top-right" />
      <Navbar /> {/* El navbar ahora ocupará el lugar correcto arriba */}
      <main>
        <AppRouter /> 
      </main>
    </BrowserRouter>
  );
}
