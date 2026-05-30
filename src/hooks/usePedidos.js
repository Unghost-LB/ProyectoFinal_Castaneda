import { useState } from 'react';
import * as api from '../services/api';

export function usePedidos() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  async function fetchPedidos() {
    setLoading(true);
    try {
      const res = await api.getPedidos();
      setData(res.data);
    } catch (err) { console.error(err); }
    setLoading(false);
  }

  return { 
    data, loading, fetchPedidos, 
    createPedido: api.createPedido, 
    updatePedido: api.updatePedido, 
    removePedido: api.deletePedido 
  };
}