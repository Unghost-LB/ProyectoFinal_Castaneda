import axios from 'axios';
import useAuthStore from '../store/useAuthStore';

export const clientProductos = axios.create({
  baseURL: import.meta.env.VITE_API_PRODUCTOS,
});

export const clientPedidos = axios.create({
  baseURL: import.meta.env.VITE_API_PEDIDOS,
});

// Permisos de circulación (Token)
const addTokenInterceptor = (config) => {
  const token = useAuthStore.getState().token;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
};

clientProductos.interceptors.request.use(addTokenInterceptor);
clientPedidos.interceptors.request.use(addTokenInterceptor);