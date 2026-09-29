import React from 'react';
import { Navigate, Outlet } from 'react-router';
import { useAuth } from '../context/AuthContext';
import type { User } from '../types/user';


interface ProtectedRouteProps {
  allowedRoles?: ('admin' | 'user')[];
}

export default function ProtectedRoute({ allowedRoles }: ProtectedRouteProps) {
  const { isAuthenticated, user, loading } = useAuth();

  if (loading) {
    return <p className="text-center py-12 text-gray-500 animate-pulse">Verificando credenciales...</p>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Casteamos de forma segura al tipo real 'User' que me acabas de pasar
  const currentUser = user as User| null;

  if (allowedRoles && currentUser?.role && !allowedRoles.includes(currentUser.role)) {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
}
