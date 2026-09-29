/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { getAllEvents } from '../services/eventService';
import { getAllCategories } from '../services/categoryService';

import type { Category } from '../types/category';
import type { Event } from '../types/event';

const BG_COLORS = ['bg-blue-50 text-blue-700', 'bg-purple-50 text-purple-700', 'bg-teal-50 text-teal-700', 'bg-amber-50 text-amber-700'];

export default function UserDashboard() {
  const { logout, user } = useAuth();
  const [activeTab, setActiveTab] = useState<'explore' | 'categories'>('explore');

  const [events, setEvents] = useState<Event[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Carga de datos del catálogo (Solo lectura)
  useEffect(() => {
    const loadCatalogData = async () => {
      try {
        const [evs, cats] = await Promise.all([getAllEvents(), getAllCategories()]);
        setEvents(evs);
        setCategories(cats);
        setLoading(false);
      } catch {
        setError('Error al sincronizar el catálogo de eventos.');
        setLoading(false);
      }
    };
    loadCatalogData();
  }, []);

  if (loading) return <p className="text-center py-12 text-gray-500 animate-pulse">Cargando cartelera...</p>;

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Barra Lateral (Sidebar) - Clonada de Admin pero adaptada al Cliente */}
      <aside className="w-64 bg-gray-900 text-white p-6 hidden md:flex flex-col justify-between">
        <div className="space-y-6">
          <div>
            <h2 className="text-xl font-bold tracking-wider text-indigo-400">Portal Clientes</h2>
            <p className="text-xs text-gray-400 mt-1">Bienvenido, {user?.name || 'Usuario'}</p>
          </div>

          <nav className="space-y-2 pt-4">
            <button
              onClick={() => setActiveTab('explore')}
              className={`w-full text-left py-2.5 px-4 rounded-lg font-medium transition-colors ${
                activeTab === 'explore' ? 'bg-indigo-600 text-white' : 'text-gray-400 hover:bg-gray-800 hover:text-white'
              }`}
            >
              🎵 Cartelera de Eventos
            </button>
            <button
              onClick={() => setActiveTab('categories')}
              className={`w-full text-left py-2.5 px-4 rounded-lg font-medium transition-colors ${
                activeTab === 'categories' ? 'bg-indigo-600 text-white' : 'text-gray-400 hover:bg-gray-800 hover:text-white'
              }`}
            >
              🗂️ Ver Categorías
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
          <span className="font-bold text-gray-900">Portal Clientes</span>
          <button onClick={logout} className="text-xs text-red-600 font-semibold">Salir</button>
        </header>

        {/* Contenido Dinámico de las Pestañas (Solo lectura) */}
        <div className="p-4 md:p-8">
          {error && <p className="text-sm text-red-600 bg-red-50 p-3 rounded-lg mb-4">{error}</p>}

          {/* VISTA 1: CARTELERA DE EVENTOS */}
          {activeTab === 'explore' && (
            <section className="space-y-4">
              <div className="border-b pb-2 flex justify-between items-center">
                <h2 className="text-xl font-bold text-gray-900">Eventos Disponibles ({events.length})</h2>
              </div>

              {events.length === 0 ? (
                <p className="text-gray-500 text-center py-8">No hay eventos publicados en cartelera actualmente.</p>
              ) : (
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {events.map((event, i) => {
                    // Corregido: antes tomaba el arreglo completo (event.images) en vez
                    // del primer elemento (event.images[0]).
                    const firstImage = event.images && event.images.length > 0 ? event.images[0] : null;
                    const displayImageUrl = firstImage
                      ? (typeof firstImage === 'string' ? firstImage : (firstImage as any).url)
                      : null;

                    const eventDate = event.date
                      ? new Date(event.date).toLocaleString('es-CO', {
                          day: '2-digit',
                          month: 'short',
                          hour: '2-digit',
                          minute: '2-digit'
                        })
                      : null;

                    return (
                      <article key={event.id} className="bg-white rounded-xl border flex flex-col justify-between shadow-sm relative overflow-hidden">
                        <div className={`absolute top-0 left-0 right-0 h-1 ${BG_COLORS[i % BG_COLORS.length].split(' ')}`} />

                        <div className="p-4 space-y-3 mt-1 flex-1 flex flex-col justify-between">
                          <div>
                            {displayImageUrl && (
                              <img
                                src={displayImageUrl}
                                alt={event.name}
                                className="w-full h-40 object-cover rounded-lg mb-3"
                              />
                            )}
                            <div className="flex justify-between items-center text-xs">
                              <span className="font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded">
                                {event.category?.name || 'Categoría'}
                              </span>
                              <span className="font-bold text-gray-900 text-sm">${event.price}</span>
                            </div>
                            <h3 className="font-bold text-gray-900 text-base mt-2 line-clamp-1">{event.name}</h3>
                            {event.description && <p className="text-xs text-gray-500 line-clamp-2 mt-1">{event.description}</p>}
                            {(eventDate || event.location) && (
                              <p className="text-[11px] text-gray-400 mt-1">
                                {eventDate}{eventDate && event.location ? ' · ' : ''}{event.location}
                              </p>
                            )}
                          </div>

                          <div className="pt-3 border-t flex justify-between items-center mt-4">
                            <p className="text-xs text-gray-400">Cupos: <span className="text-gray-700 font-semibold">{event.capacity} u</span></p>
                            <button
                              disabled={event.capacity === 0}
                              className={`text-xs px-3 py-1.5 rounded-lg font-semibold transition-colors ${
                                event.capacity > 0
                                  ? 'bg-indigo-600 text-white hover:bg-indigo-500'
                                  : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                              }`}
                            >
                              {event.capacity > 0 ? 'Adquirir Entrada' : 'Agotado'}
                            </button>
                          </div>
                        </div>
                      </article>
                    );
                  })}
                </div>
              )}
            </section>
          )}

          {/* VISTA 2: LISTADO DE CATEGORÍAS */}
          {activeTab === 'categories' && (
            <section className="space-y-4">
              <h2 className="text-xl font-bold text-gray-900 border-b pb-2">Categorías de Entretenimiento</h2>

              {categories.length === 0 ? (
                <p className="text-gray-500 text-center py-8">No se encontraron categorías registradas.</p>
              ) : (
                <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                  {categories.map((category) => (
                    <div key={category.id} className="bg-white border rounded-xl p-4 shadow-sm flex items-center justify-between hover:border-indigo-300 transition-colors">
                      <div className="space-y-0.5">
                        <h3 className="font-bold text-gray-900 text-sm">{category.name}</h3>
                        <p className="text-[10px] text-gray-400 uppercase tracking-wider">Música e Infatiles</p>
                      </div>
                      <span className="text-xl">🎭</span>
                    </div>
                  ))}
                </div>
              )}
            </section>
          )}
        </div>
      </main>
    </div>
  );
}
