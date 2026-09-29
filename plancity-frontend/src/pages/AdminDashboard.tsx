import { useState } from 'react';

import EventPage from './EventPage';
import { useAuth } from '../context/AuthContext';
import CategoryPage from './category';

export default function AdminDashboard() {
  const { logout, user } = useAuth();
  const [activeTab, setActiveTab] = useState<'events' | 'categories'>('events');

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Barra Lateral (Sidebar) */}
      <aside className="w-64 bg-gray-900 text-white p-6 hidden md:flex flex-col justify-between">
        <div className="space-y-6">
          <div>
            <h2 className="text-xl font-bold tracking-wider text-indigo-400">AdminPanel</h2>
            <p className="text-xs text-gray-400 mt-1">Conectado como: {user?.name || 'Administrador'}</p>
          </div>
          
          <nav className="space-y-2 pt-4">
            <button
              onClick={() => setActiveTab('events')}
              className={`w-full text-left py-2.5 px-4 rounded-lg font-medium transition-colors ${
                activeTab === 'events' ? 'bg-indigo-600 text-white' : 'text-gray-400 hover:bg-gray-800 hover:text-white'
              }`}
            >
              📅 Gestionar Eventos
            </button>
            <button
              onClick={() => setActiveTab('categories')}
              className={`w-full text-left py-2.5 px-4 rounded-lg font-medium transition-colors ${
                activeTab === 'categories' ? 'bg-indigo-600 text-white' : 'text-gray-400 hover:bg-gray-800 hover:text-white'
              }`}
            >
              🗂️ Gestionar Categorías
            </button>
          </nav>
        </div>

        <button
          onClick={logout}
          className="w-full text-center py-2.5 px-4 rounded-lg text-sm font-semibold bg-red-600/10 text-red-400 hover:bg-red-600 hover:text-white transition-all"
        >
          Cerrar Sesión
        </button>
      </aside>

      {/* Contenedor de Contenido Principal */}
      <main className="flex-1 overflow-y-auto">
        {/* Navbar superior para móviles */}
        <header className="bg-white border-b p-4 flex md:hidden justify-between items-center">
          <span className="font-bold text-gray-900">AdminPanel</span>
          <button onClick={logout} className="text-xs text-red-600 font-semibold">Salir</button>
        </header>

        <div className="p-4 md:p-8">
          {activeTab === 'events' ? <EventPage /> : <CategoryPage />}
        </div>
      </main>
    </div>
  );
}
