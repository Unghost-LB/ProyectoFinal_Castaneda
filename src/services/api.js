import { clientProductos, clientPedidos } from '../api/cliente';

// --- PRODUCTOS (Usan el cliente de productos) ---
export const getProductos = () => clientProductos.get('/api/productos');
export const getProductoById = (id) => clientProductos.get(`/api/productos/${id}`);
export const createProducto = (data) => clientProductos.post('/api/productos', data);
export const updateProducto = (id, data) => clientProductos.put(`/api/productos/${id}`, data);
export const deleteProducto = (id) => clientProductos.delete(`/api/productos/${id}`);

// --- PEDIDOS (Usan el cliente de pedidos) ---
export const getPedidos = () => clientPedidos.get('/api/pedidos');
export const getPedidoById = (id) => clientPedidos.get(`/api/pedidos/${id}`);
export const createPedido = (data) => clientPedidos.post('/api/pedidos', data);
export const updatePedido = (id, data) => clientPedidos.put(`/api/pedidos/${id}/estado`, data);
export const deletePedido = (id) => clientPedidos.delete(`/api/pedidos/${id}`);
