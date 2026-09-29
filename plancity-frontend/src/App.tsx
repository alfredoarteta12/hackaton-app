import React from 'react';
import { RouterProvider } from 'react-router'; // O 'react-router-dom' según tu alias
import { appRouter } from './appRouter'; // Ajusta la ruta a tu archivo appRouter
import { AuthProvider } from './context/AuthContext';

export default function App() {
  return (
    
    <AuthProvider>
      
      <RouterProvider router={appRouter} />
    </AuthProvider>
  );
}
