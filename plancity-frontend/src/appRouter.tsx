import { createBrowserRouter, Navigate } from 'react-router';

import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';


import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectRoute';
import UserDashboard from './pages/UserDashboard';
import AdminDashboard from './pages/AdminDashboard';

export const appRouter = createBrowserRouter([
  {
    path: "/",
    element: <Layout />, 
    children: [
  
      {
        index: true, 
        element: <HomePage />
      },
      {
        path: "auth/login", // Tu ruta de inicio de sesión (/auth/login)
        element: <LoginPage />
      },
     
      /* ================= RUTAS PROTEGIDAS (Auth: Sí) ================= */
      
      // 1. Panel de Usuario Común (Rol: Cualquiera)
      {
        element: <ProtectedRoute />, 
        children: [
          {
            path: "auth/user",
            element: <UserDashboard/>
          }
        ]
      },

      // 2. Panel de Administrador (Rol: admin)
      {
        element: <ProtectedRoute allowedRoles={['admin']} />, 
        children: [
          {
            path: "auth/admin",
            element: <AdminDashboard/>
          }
        ]
      },

      // Comportamiento por defecto para rutas no existentes
      {
        path: "*",
        element: <Navigate to="/" replace />
      }
    ]
  }
]);
