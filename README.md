# 🍪 Sistema de Gestión - Panadería Castañeda 🎄
### Proyecto Final — Bootcamp G14 | Desarrollo Fullstack con Java & React
- **Usuario y Contraseña para ingresar al Dashboard: **
- **Usuario:** Admin
- **Contraseña:** Admin-Castañeda
---
 
## 🌐 Demo en vivo
- **Frontend:** [https://proyecto-final-castaneda.vercel.app/](https://proyecto-final-castaneda.vercel.app/)
- **ms-productos API:** [https://ms-productos-pmew.onrender.com](https://ms-productos-pmew.onrender.com)
- **ms-pedidos API:** [https://ms-pedidos-yt91.onrender.com](https://ms-pedidos-yt91.onrender.com)
---
 
## 📄 Resumen del proyecto (MVP)
El proyecto consiste en construir la interfaz de usuario para una aplicación CRUD completa (Create, Read, Update, Delete) utilizando **React 18 + Vite**. La aplicación está enfocada en la gestión comercial de la tienda *Panadería Castañeda*, una tienda artesanal de alfajores y panetones de temporada.
 
Permite interactuar con endpoints asíncronos para listar catálogos de productos, crear registros nuevos mediante formularios controlados, editar información existente en tiempo real y eliminar elementos con confirmación de seguridad.
 
---
 
## ✅ Criterios mínimos (MVP)
 
La aplicación gestiona de forma integral las entidades **Productos** y **Pedidos**, cumpliendo con las especificaciones del MVP:
 
- **Read (Listar):** Renderizado dinámico en cuadrícula de tarjetas (`cards-grid`) con indicadores de carga asíncrona, búsqueda por nombre y filtros por categoría/estado.
- **Create (Crear):** Formulario con inputs controlados y validaciones obligatorias que envía datos mediante `POST`, persistiendo directamente en el servidor.
- **Update (Editar):** Reutilización del formulario que recupera datos del registro seleccionado por `id` y los modifica vía `PUT`.
- **Delete (Eliminar):** Confirmación nativa (`confirm`) antes de eliminar; refresca el estado local de forma inmediata tras la remoción en el backend.
- **UI Mínima:** Interfaz limpia, responsiva y optimizada para escritorio con tema blanco/verde.
---
 
## 🛠️ Stack y recursos
 
### Frontend
| Tecnología | Versión | Uso |
|---|---|---|
| React | 18 | Framework principal |
| Vite | 5+ | Build tool |
| React Router DOM | v6 | Rutas del cliente |
| Axios | latest | Cliente HTTP |
| React Hot Toast | latest | Notificaciones |
 
### Backend (Microservicios)
| Servicio | Tecnología | Base de datos | Deploy |
|---|---|---|---|
| ms-productos | Spring Boot 3 + Java 21 | PostgreSQL (Neon) | Render + Docker |
| ms-pedidos | Spring Boot 3 + Java 21 | PostgreSQL (Neon) | Render + Docker |
 
---
 
## 🏗️ Arquitectura
 
```text
React Frontend (Vercel)
 ├── ms-productos (Docker · Render) → PostgreSQL (Neon Cloud)
 └── ms-pedidos   (Docker · Render) → PostgreSQL (Neon Cloud)
```
 
---
 
## 📁 Estructura del proyecto
 
```
castaneda-frontend/
├── src/
│   ├── api/              # Cliente Axios centralizado
│   ├── components/       # Componentes reutilizables (Navbar)
│   ├── hooks/            # Custom hooks (useProductos, usePedidos)
│   ├── pages/    
│   │   ├── Dashboard.jsx # Dashboard con estadísticas
│   │   ├── Home.jsx      # Vistas principales
│   │   └── Login.jsx     # Pantalla de acceso
│   │   ├── Pedidos.jsx   # CRUD de pedidos
│   │   ├── ProductoFormPAge.jsx # Para crear nuevo producto
│   │   ├── Productos.jsx # CRUD de productos
│   ├── router/           # AppRouter con React Router DOM v6
│   ├── services/         # Llamadas HTTP a los microservicios
│   └── store/            # Estado global (useAuthStore)
├── .env.example
├── package.json
├── vercel.json
└── README.md
```
 
## 🔗 Repositorios relacionados
 
| Repositorio | Descripción |
|---|---|
| [ms-productos](https://github.com/Unghost-LB/exam-ms-productos) | Microservicio de productos con Spring Boot + Docker |
| [ms-pedidos](https://github.com/Unghost-LB/examen-ms-pedidos) | Microservicio de pedidos con Spring Boot + Docker |
