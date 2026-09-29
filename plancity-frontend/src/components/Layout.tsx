/* eslint-disable @typescript-eslint/no-explicit-any */
import { Outlet, useNavigate, Link } from 'react-router';
import { useAuth } from '../context/AuthContext';

export default function Layout() {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();

  // Firma de tipo explícita para evitar errores de ESLint
  const currentUser = user as { role?: 'admin' | 'user'; name?: string } | null;

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch {
      console.error('Error al cerrar sesión');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans antialiased text-gray-950">
      
      {/* ================= NAVBAR GLOBAL ================= */}
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-40 shadow-sm backdrop-blur-md bg-white/90">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          
          {/* Logo */}
          <div className="flex items-center space-x-8">
            <Link to="/" className="text-xl font-black text-gray-900 tracking-tight flex items-center gap-1.5 hover:opacity-90 transition-opacity">
              <span className="text-indigo-600">⚡</span> PlanCity
            </Link>

            {/* Enlaces según la sesión del usuario */}
            {isAuthenticated && (
              <div className="hidden sm:flex space-x-1">
                {/* SOLUCIÓN: Ajustadas las URLs a los paths reales del Router */}
                {currentUser?.role === 'admin' ? (
                  <Link to="/auth/admin" className="text-sm font-semibold px-3 py-2 rounded-lg text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors">
                    ⚙️ Panel Admin
                  </Link>
                ) : (
                  <Link to="/auth/user" className="text-sm font-semibold px-3 py-2 rounded-lg text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors">
                    👤 Mi Panel
                  </Link>
                )}
              </div>
            )}
          </div>

          {/* Acciones de la derecha */}
          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <div className="flex items-center space-x-4">
                <div className="hidden md:flex flex-col text-right">
                  <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                    {currentUser?.role === 'admin' ? 'Administrador' : 'Usuario'}
                  </span>
                  <span className="text-sm font-bold text-gray-900">{currentUser?.name || 'Mi Cuenta'}</span>
                </div>
                
                <button
                  onClick={handleLogout}
                  className="rounded-lg border border-gray-300 bg-white px-3.5 py-2 text-sm font-semibold text-red-600 shadow-sm hover:bg-red-50 hover:border-red-200 transition-all active:scale-95"
                >
                  Salir
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link
                  to="/auth/login"
                  className="text-sm font-semibold px-4 py-2 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
                >
                  Entrar
                </Link>
              </div>
            )}
          </div>

        </div>
      </nav>

      {/* ================= CONTENEDOR DINÁMICO ================= */}
      <main className="flex-1 w-full">
        {/* Aquí se inyectan las páginas hijas del appRouter */}
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 py-4 text-center text-xs text-gray-400 font-medium">
        &copy; {new Date().getFullYear()} Catálogo App &bull; Be a coder
      </footer>

    </div>
  );
}
