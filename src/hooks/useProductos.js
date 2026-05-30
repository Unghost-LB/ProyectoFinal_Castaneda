import { useState } from 'react';
import * as api from '../services/api';

export function useProductos() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  async function fetchProductos() {
    setLoading(true);
    try {
      const res = await api.getProductos();
      setData(res.data);
    } catch (err) { console.error(err); }
    setLoading(false);
  }

  return { 
    data, loading, fetchProductos, 
    createProducto: api.createProducto, 
    updateProducto: api.updateProducto, 
    removeProducto: api.deleteProducto 
  };
}