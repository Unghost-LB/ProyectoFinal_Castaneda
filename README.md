# Castañeda - Frontend

Frontend desarrollado en **React + Vite** para el sistema de gestión de productos y pedidos de Castañeda, una tienda de alfajores y panetones artesanales.

## Tecnologías
- React 18 + Vite
- React Router DOM v6
- Axios
- React Hot Toast

## Arquitectura
```
React Frontend (Vercel)
    ├── ms-productos (Docker · Render) → PostgreSQL (Neon)
    └── ms-pedidos   (Docker · Render) → PostgreSQL (Neon)
```

## Funcionalidades
- **Productos**: CRUD completo con categorías (alfajor, paneton), stock, estado y filtros
- **Pedidos**: CRUD completo con cálculo automático de total, filtro por estado
- **Dashboard**: Estadísticas en tiempo real de ambos microservicios

## Configuración

1. Clona el repositorio
2. Copia `.env.example` a `.env` y completa las URLs de tus microservicios:
```env
VITE_API_PRODUCTOS=https://ms-productos-pmew.onrender.com
VITE_API_PEDIDOS=https://TU_URL_PEDIDOS.onrender.com
```
3. Instala dependencias e inicia:
```bash
npm install
npm run dev
```

## Despliegue en Vercel
1. Sube el repositorio a GitHub
2. Importa en [vercel.com](https://vercel.com)
3. Agrega las variables de entorno en Vercel Dashboard
4. Deploy automático
