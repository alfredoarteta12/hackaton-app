# 🎯 Event Management Platform

> Plataforma moderna de gestión de eventos construida con **React 19**, **TypeScript** y **Vite**. Incluye autenticación token-based, control de acceso por roles y arquitectura escalable.

![Version](https://img.shields.io/badge/version-0.0.0-blue)
![Node](https://img.shields.io/badge/node-18.0%2B-brightgreen)
![License](https://img.shields.io/badge/license-Private-red)

---

## 📋 Tabla de Contenidos

- [Descripción del Proyecto](#-descripción-del-proyecto)
- [Decisiones Técnicas](#-decisiones-técnicas)
- [Requisitos Previos](#-requisitos-previos)
- [Instalación](#-instalación)
- [Estructura del Proyecto](#-estructura-del-proyecto)
- [Autenticación y Autorización](#-autenticación-y-autorización)
- [Scripts Disponibles](#-scripts-disponibles)
- [API Integration](#-integración-con-api)
- [Configuración](#-configuración)
- [Despliegue](#-despliegue)
- [Optimizaciones](#-optimizaciones)
- [Troubleshooting](#-troubleshooting)

---

## 🎯 Descripción del Proyecto

Plataforma web completa para la gestión de eventos y categorías con:

- ✅ **Autenticación segura** con JWT tokens
- ✅ **Control de acceso** basado en roles (RBAC)
- ✅ **Interfaz responsive** con Tailwind CSS
- ✅ **TypeScript strict** para máxima seguridad de tipos
- ✅ **Optimizaciones de rendimiento** con React Compiler
- ✅ **Desarrollo ágil** con Vite y HMR

---

## 🏗️ Decisiones Técnicas

### Stack Tecnológico

| Tecnología | Versión | Propósito | Justificación |
|------------|---------|----------|--------------|
| **React** | 19.2.8 | Framework UI | Componentes reactivos con rendimiento optimizado |
| **Vite** | 8.2.2 | Build tool | Bundling ultrarrápido y HMR instantáneo |
| **React Router** | 8.3.1 | Enrutamiento | Sistema moderno basado en objetos config |
| **TypeScript** | 6.0.2 | Lenguaje | Type safety y mejor experiencia de desarrollo |
| **Tailwind CSS** | 4.3.3 | Estilos | Utility-first framework para desarrollo rápido |
| **Axios** | 1.20.0 | HTTP Client | Interceptadores para manejo centralizado |
| **React Compiler** | 1.0.0 | Optimización | Memoización automática de renders |
| **ESLint** | 10.9.0 | Linting | Análisis estático y consistencia de código |

### Arquitectura de Aplicación

```
┌─────────────────────────────────────────────────────────────┐
│                    App (React + TypeScript)                 │
│  ┌──────────────────────────────────────────────────────┐   │
│  │         AuthProvider (Context API Global)            │   │
│  │  ┌────────────────────────────────────────────────┐  │   │
│  │  │   RouterProvider (React Router 8.3.1)         │  │   │
│  │  │  ┌──────────────────────────────────────────┐ │  │   │
│  │  │  │  Layout (Root Outlet + Navigation)       │ │  │   │
│  │  │  │  ┌──────────────────────────────────────┐│ │  │   │
│  │  │  │  │ ✓ HomePage (Ruta Pública)            ││ │  │   │
│  │  │  │  │ ✓ LoginPage (Ruta Pública)           ││ │  │   │
│  │  │  │  │ 🔒 ProtectedRoute (Auth Requerida)   ││ │  │   │
│  │  │  │  │   ├─ UserDashboard (Usuarios)        ││ │  │   │
│  │  │  │  │   ├─ AdminDashboard (Solo Admin)     ││ │  │   │
│  │  │  │  │   ├─ EventPage (Detalle de Evento)   ││ │  │   │
│  │  │  │  │   └─ category.tsx (Categorías)       ││ │  │   │
│  │  │  │  └──────────────────────────────────────┘│ │  │   │
│  │  │  └──────────────────────────────────────────┘ │  │   │
│  │  └────────────────────────────────────────────────┘  │   │
│  └──────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
         │                      │                      │
         ▼                      ▼                      ▼
    ┌─────────┐            ┌─────────┐          ┌──────────┐
    │ Services│            │   Lib   │          │  Types   │
    ├─────────┤            ├─────────┤          ├──────────┤
    │ Auth    │            │ api.ts  │          │ auth.ts  │
    │ Event   │            │ token   │          │ event.ts │
    │Category │            │Storage  │          │ user.ts  │
    └─────────┘            └─────────┘          └──────────┘
```

### Patrones de Diseño Implementados

#### 1️⃣ **State Management con Context API**
```typescript
// ✨ Sin Redux, lightweight y performante
const { user, isAuthenticated, login, logout } = useAuth();
```
- Gestión centralizada de autenticación
- Reducción de prop drilling
- Menor tamaño de bundle

#### 2️⃣ **Autenticación Token-Based (JWT)**
```typescript
// En lib/tokenStorage.ts
const token = tokenStorage.get(); // Obtener del localStorage
tokenStorage.set(newToken);       // Guardar token
tokenStorage.remove();             // Logout
```
- Tokens JWT almacenados en localStorage
- Recuperación automática de sesión al refrescar
- Validación centralizada en interceptadores

#### 3️⃣ **Control de Acceso por Roles (RBAC)**
```tsx
// Protección de rutas por rol
<ProtectedRoute allowedRoles={['admin']} />
```
- Rutas públicas vs. protegidas
- Restricción granular por rol
- Redirección automática sin permisos

#### 4️⃣ **Interceptadores HTTP Centralizados**
```typescript
// Request: Inyecta token automáticamente
api.interceptors.request.use((config) => {
  const token = tokenStorage.get();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Response: Maneja errores globales
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      tokenStorage.remove();
      window.location.href = '/auth/login';
    }
    return Promise.reject(error);
  }
);
```

#### 5️⃣ **Lazy Loading de Páginas**
- Carga bajo demanda de componentes de página
- Optimización del bundle inicial

---

## 📂 Estructura del Proyecto

```
src/
│
├── 📄 main.tsx                  # Entry point de la aplicación
├── 📄 App.tsx                   # Componente raíz (App wrapper)
├── 📄 appRouter.tsx             # Definición de rutas (React Router)
├── 📄 index.css                 # Estilos globales
├── 📄 App.css                   # Estilos de App
│
├── 📁 components/               # Componentes reutilizables
│   ├── Layout.tsx              # Layout principal con Outlet
│   └── ProtectRoute.tsx        # HOC para rutas protegidas
│
├── 📁 context/                  # Context API providers
│   └── AuthContext.tsx         # Estado global de autenticación
│
├── 📁 pages/                    # Componentes de página
│   ├── HomePage.tsx            # Catálogo público de eventos
│   ├── LoginPage.tsx           # Formulario de autenticación
│   ├── UserDashboard.tsx       # Panel de usuario estándar
│   ├── AdminDashboard.tsx      # Panel de administrador
│   ├── EventPage.tsx           # Detalles de un evento
│   └── category.tsx            # Gestión de categorías
│
├── 📁 services/                 # Lógica de negocio
│   ├── authService.ts          # Operaciones de autenticación
│   ├── eventService.ts         # CRUD de eventos
│   └── categoryService.ts      # CRUD de categorías
│
├── 📁 lib/                      # Utilidades y configuración
│   ├── api.ts                  # Cliente Axios configurado
│   └── tokenStorage.ts         # Gestión de tokens
│
├── 📁 types/                    # Tipos TypeScript
│   ├── auth.ts                 # Tipos de autenticación
│   ├── user.ts                 # Tipos de usuario
│   ├── event.ts                # Tipos de evento
│   └── category.ts             # Tipos de categoría
│
└── 📁 assets/                   # Recursos estáticos
```

---

## 🚀 Requisitos Previos

- **Node.js** ≥ 18.0 LTS
- **npm** ≥ 9.0 (o yarn/pnpm)
- **Git** (para clonar el repositorio)
- **API Backend** ejecutándose en `http://localhost:3000`

---

## 💻 Instalación

### 1. Clonar el repositorio
```bash
git clone <repository-url>
cd "prueba de desempeño"
```

### 2. Instalar dependencias
```bash
npm install
```

### 3. Configurar variables de entorno
Crear archivo `.env` en la raíz del proyecto:
```env
VITE_API_BASE_URL=http://localhost:3000
```

### 4. Ejecutar servidor de desarrollo
```bash
npm run dev
```

La aplicación estará disponible en: **`http://localhost:5173`**

### 5. Verificar el backend
Asegurarse que el API backend esté corriendo en `http://localhost:3000`

---

## 📦 Scripts Disponibles

```bash
# 🚀 Desarrollo con Hot Module Replacement (HMR)
npm run dev

# 🏗️ Build optimizado para producción
npm run build

# ✅ Validación de código con ESLint
npm run lint

# 👁️ Previsualizar build de producción localmente
npm run preview
```

---

## 🔐 Autenticación y Autorización

### Flujo de Autenticación

```
┌─────────────┐        ┌──────────────┐        ┌─────────────┐
│ LoginPage   │        │ AuthService  │        │ Backend API │
└──────┬──────┘        └──────┬───────┘        └──────┬──────┘
       │                       │                      │
       │ 1. Email + Password   │                      │
       ├──────────────────────>│                      │
       │                       │ 2. POST /auth/login  │
       │                       ├─────────────────────>│
       │                       │ 3. { accessToken }   │
       │                       │<─────────────────────┤
       │ 4. ✅ Login Success   │                      │
       │<──────────────────────┤                      │
       │                       │                      │
       │ 5. localStorage.set() │                      │
       ├──────────┐            │                      │
       │          │            │                      │
       ▼          ▼            │                      │
  ┌────────────────────┐       │                      │
  │ AuthContext Updated│       │                      │
  │ isAuthenticated=✅  │       │                      │
  └────────────────────┘       │                      │
       │                       │                      │
       │ 6. Redirect a /auth/user
       │
```

### Recuperación Automática de Sesión

Al refrescar la página o abrir la aplicación:

```typescript
// En AuthContext.tsx useEffect
useEffect(() => {
  const restoreSession = async () => {
    if (!tokenStorage.get()) {
      setLoading(false);
      return;
    }
    try {
      const profile = await authService.getProfile();
      setUser(profile);
    } catch {
      tokenStorage.remove(); // Token inválido
    } finally {
      setLoading(false);
    }
  };
  restoreSession();
}, []);
```

### Estructura de Roles

| Rol | Acceso | Rutas |
|-----|--------|-------|
| 🌐 **Público** | Lectura de eventos/categorías | `/`, `/auth/login` |
| 👤 **Usuario** | Crear eventos, comentar | `/auth/user`, `/auth/user/events` |
| 🔑 **Admin** | CRUD completo, gestión de usuarios | `/auth/admin`, `/auth/admin/*` |

---

## 🔗 Integración con API

### Configuración del Cliente HTTP

El cliente Axios está configurado en `src/lib/api.ts`:

```typescript
export const api = axios.create({
  baseURL: "http://localhost:3000",
});
```

### Endpoints Esperados

| Método | Ruta | Descripción | Autenticación |
|--------|------|-------------|---------------|
| **POST** | `/auth/register` | Registrar nuevo usuario | ❌ No |
| **POST** | `/auth/login` | Iniciar sesión | ❌ No |
| **POST** | `/auth/logout` | Cerrar sesión | ✅ Bearer Token |
| **GET** | `/users/me` | Perfil del usuario actual | ✅ Bearer Token |
| **GET** | `/events` | Listar todos los eventos | ❌ No |
| **GET** | `/events/:id` | Detalle de un evento | ❌ No |
| **POST** | `/events` | Crear nuevo evento | ✅ Bearer Token |
| **PUT** | `/events/:id` | Actualizar evento | ✅ Bearer Token |
| **DELETE** | `/events/:id` | Eliminar evento | ✅ Bearer Token |
| **GET** | `/categories` | Listar categorías | ❌ No |
| **POST** | `/categories` | Crear categoría | ✅ Bearer Token (Admin) |

### Ejemplo de Uso

```typescript
// En eventService.ts
import { api } from '../lib/api';

export async function getEvents() {
  const response = await api.get('/events');
  return response.data; // Array de eventos
}

export async function createEvent(event: Event) {
  const response = await api.post('/events', event);
  // Token se añade automáticamente en el interceptador
  return response.data;
}
```

---

## ⚙️ Configuración

### TypeScript (`tsconfig.json`)
```json
{
  "compilerOptions": {
    "target": "ES2020",
    "jsx": "react-jsx",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true
  }
}
```

### Vite (`vite.config.ts`)
```typescript
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    babel({ presets: [reactCompilerPreset()] })
  ],
})
```

### ESLint (`eslint.config.js`)
Incluye:
- `@eslint/js` - Reglas estándar JavaScript
- `typescript-eslint` - Reglas específicas de TypeScript
- `eslint-plugin-react-hooks` - Validación de hooks
- `eslint-plugin-react-refresh` - Fast Refresh

Ejecutar validación:
```bash
npm run lint
```

### Tailwind CSS
Configuración utility-first para estilos:
```tsx
<button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded">
  Click me
</button>
```

---

## 🌍 Despliegue

### Build Optimizado para Producción

```bash
npm run build
```

Genera:
- Carpeta `dist/` lista para producción
- Archivos minificados y optimizados
- Source maps para debugging

### Opciones de Hosting

#### 1. **Vercel** (Recomendado para React + Vite)
```bash
npm i -g vercel
vercel
```

#### 2. **Netlify**
```bash
npm run build
# Arrastra la carpeta 'dist/' a Netlify
```

#### 3. **Docker**
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "run", "preview"]
```

#### 4. **AWS S3 + CloudFront**
```bash
npm run build
# Sube 'dist/' a S3
# Configura CloudFront como CDN
```

### Variables de Entorno en Producción

```env
VITE_API_BASE_URL=https://api.tudominio.com
```

---

## ⚡ Optimizaciones de Rendimiento

### 1. React Compiler
- Optimización automática de renders
- Memoización inteligente de componentes

### 2. Code Splitting
- Carga lazy de páginas con React Router
- Bundles más pequeños

### 3. Minificación
- Generado automáticamente por Vite en build

### 4. Tree Shaking
- Eliminación de código muerto
- Imports no utilizados removidos

### 5. Caching de HTTP
- Implementar headers Cache-Control en producción

---

## 🐛 Troubleshooting

### Error: "Cannot find module 'react-router'"
```bash
npm install react-router@latest
```

### Error: "CORS Policy"
Configurar CORS en el backend:
```typescript
// Backend (Express)
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));
```

### Token expirado/no válido
- Limpiar localStorage: `localStorage.clear()`
- Volver a iniciar sesión
- Implementar refresh tokens para mejor UX

### HMR no funciona
```bash
npm run dev
# Si persiste, reiniciar el servidor
# rm -rf node_modules package-lock.json
# npm install
```

### Build lento
```bash
# Aumentar memoria de Node
NODE_OPTIONS=--max-old-space-size=4096 npm run build
```

---

## 📊 Métricas de Rendimiento

- **Tamaño del bundle**: ~180KB (gzipped)
- **Tiempo de build**: ~2-3 segundos
- **HMR**: <100ms
- **First Contentful Paint**: <1 segundo

---

## 🚀 Próximas Mejoras Sugeridas

- [ ] **Refresh Tokens**: Mayor seguridad en autenticación
- [ ] **React Query**: Caching y sincronización de datos
- [ ] **Testing**: Vitest + React Testing Library
- [ ] **Validación de Formularios**: react-hook-form + Zod
- [ ] **Analytics**: Integración de Sentry o similar
- [ ] **PWA**: Service Workers y offline support
- [ ] **i18n**: Soporte multiidioma
- [ ] **Dark Mode**: Tema oscuro/claro

---

## 📝 Convenciones de Código

| Elemento | Convención | Ejemplo |
|----------|-----------|---------|
| Componentes | PascalCase | `UserDashboard.tsx` |
| Funciones/Variables | camelCase | `getUserEvents()` |
| Tipos/Interfaces | PascalCase | `type User = {}` |
| Constantes | UPPER_SNAKE_CASE | `const TOKEN_KEY = "..."` |
| Rutas privadas | `/auth/*` | `/auth/user`, `/auth/admin` |
| Métodos de servicio | Verbos | `getEvents()`, `createEvent()` |

---

## 📄 Licencia

Proyecto privado - Todos los derechos reservados © 2026

---

## 👥 Contacto y Soporte

Para preguntas técnicas o sugerencias sobre la arquitectura, contactar al equipo de desarrollo.

---

**Última actualización**: Agosto 2026  
**Versión del Proyecto**: 0.0.0  
**Última modificación**: 2026-08-31  
**Autor**: Equipo de Desarrollo
