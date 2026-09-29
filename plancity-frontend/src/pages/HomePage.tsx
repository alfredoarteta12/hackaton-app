
import React, { useEffect, useState } from 'react';
import * as categoryService from '../services/categoryService';
import * as eventService from '../services/eventService';
import type { Category } from '../types/category';
import type { Event } from '../types/event';

const PLACEHOLDER_IMAGE =
  'https://images.unsplash.com/photo-1492684223066-81342ee5ff30';

const HomePage = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] =
    useState<Category | null>(null);

  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [events, setEvents] = useState<Event[]>([]);
  const [loadingEvents, setLoadingEvents] = useState<boolean>(false);
  const [eventsError, setEventsError] = useState<string | null>(null);

  // Cargar categorías
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);

        const data = await categoryService.getAllCategories();

        setCategories(data);

        if (data.length > 0) {
          setSelectedCategory(data[0]);
        }
      } catch (err) {
        setError(
          'No se pudo cargar el catálogo de categorías en este momento.'
        );
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  // Cargar eventos cuando cambia la categoría
  useEffect(() => {
    if (!selectedCategory) {
      setEvents([]);
      return;
    }

    const fetchEvents = async () => {
      try {
        setLoadingEvents(true);
        setEventsError(null);

        const allEvents = await eventService.getAllEvents();

        const filteredEvents = allEvents.filter(
          (event) =>
            event.categoryId === selectedCategory.id ||
            event.category?.id === selectedCategory.id
        );

        setEvents(filteredEvents);
      } catch (err: any) {
        setEventsError(
          err.message ||
            'No se pudieron cargar los eventos de esta categoría.'
        );
      } finally {
        setLoadingEvents(false);
      }
    };

    fetchEvents();
  }, [selectedCategory]);

  // Estado de carga
  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <p className="text-lg font-medium text-gray-600 animate-pulse">
          Cargando panel de control...
        </p>
      </div>
    );
  }

  // Estado de error
  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
        <div className="max-w-md rounded-xl border border-red-100 bg-red-50 p-6 text-center">
          <p className="text-sm font-semibold text-red-600">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-6">

        {/* Encabezado */}
        <div className="border-b border-gray-200 pb-5 text-center md:text-left">
          <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">
            Explorador de Eventos y Categorías
          </h1>

          <p className="mt-2 text-base text-gray-500">
            Selecciona una categoría de la izquierda para filtrar los eventos
            programados en tiempo real.
          </p>
        </div>

        {/* Contenedor principal */}
        <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-3">

          {/* Categorías */}
          <div className="space-y-4 lg:col-span-1">
            <h2 className="px-1 text-xl font-bold text-gray-900">
              Categorías disponibles
            </h2>

            {categories.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-gray-300 bg-white py-8 text-center">
                <p className="text-sm text-gray-500">
                  No hay categorías disponibles.
                </p>
              </div>
            ) : (
              <div className="max-h-[60vh] space-y-3 overflow-y-auto pr-2 lg:max-h-[calc(100vh-250px)]">
                {categories.map((category) => {
                  const isSelected =
                    selectedCategory?.id === category.id;

                  return (
                    <div
                      key={category.id}
                      onClick={() => setSelectedCategory(category)}
                      className={`cursor-pointer rounded-xl border p-4 transition-all duration-200 ${
                        isSelected
                          ? 'transform border-indigo-600 bg-indigo-600 text-white shadow-md -translate-y-0.5'
                          : 'border-gray-100 bg-white text-gray-900 hover:border-indigo-200 hover:shadow-sm'
                      }`}
                    >
                      <h3
                        className={`text-base font-bold ${
                          isSelected
                            ? 'text-white'
                            : 'text-gray-900'
                        }`}
                      >
                        {category.name}
                      </h3>

                      <p
                        className={`mt-1 line-clamp-2 text-xs ${
                          isSelected
                            ? 'text-indigo-100'
                            : 'text-gray-500'
                        }`}
                      >
                        {category.description ||
                          'Sin descripción disponible.'}
                      </p>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Detalles y eventos */}
          <div className="space-y-6 lg:col-span-2">
            {selectedCategory ? (
              <div className="space-y-6 rounded-2xl border border-gray-100 bg-white p-6 shadow-sm sm:p-8">

                {/* Información de categoría */}
                <div className="border-b border-gray-100 pb-4">
                  <span className="rounded-full bg-indigo-50 px-2.5 py-1 text-xs font-bold uppercase tracking-wider text-indigo-600">
                    Categoría Activa
                  </span>

                  <h2 className="mt-2 text-2xl font-bold tracking-tight text-gray-900">
                    {selectedCategory.name}
                  </h2>

                  <p className="mt-2 text-sm leading-relaxed text-gray-600">
                    {selectedCategory.description ||
                      'Esta categoría no cuenta con una descripción detallada.'}
                  </p>
                </div>

                {/* Eventos */}
                <div className="rounded-xl border border-gray-200/60 bg-gray-50 p-6">
                  <h3 className="mb-4 text-lg font-semibold text-gray-900">
                    Eventos programados
                  </h3>

                  {loadingEvents ? (
                    <p className="animate-pulse text-sm text-gray-500">
                      Buscando eventos disponibles en la base de datos...
                    </p>
                  ) : eventsError ? (
                    <div className="rounded-lg border border-red-100 bg-red-50 p-4">
                      <p className="text-xs font-medium text-red-600">
                        {eventsError}
                      </p>
                    </div>
                  ) : events.length === 0 ? (
                    <p className="text-sm text-gray-500">
                      No hay eventos creados para la sección "
                      {selectedCategory.name}" todavía.
                    </p>
                  ) : (
                    <div className="grid gap-4 sm:grid-cols-2">
                      {events.map((event) => {
                        const hasImages =
                          event.images &&
                          event.images.length > 0;

                        const eventImg = hasImages
                          ? event.images![0].url
                          : PLACEHOLDER_IMAGE;

                        return (
                          <div
                            key={event.id}
                            className="flex flex-col justify-between overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition-all hover:shadow-md"
                          >
                            {/* Imagen */}
                            <div className="relative h-36 w-full overflow-hidden bg-gray-100">
                              <img
                                src={eventImg}
                                alt={event.name}
                                className="h-full w-full object-cover"
                                onError={(e) => {
                                  e.currentTarget.src =
                                    PLACEHOLDER_IMAGE;
                                }}
                              />

                              {/* Precio */}
                              <div className="absolute right-2 top-2 rounded-md bg-black/70 px-2 py-1 text-xs font-bold text-white backdrop-blur-sm">
                                $
                                {Number(event.price || 0).toLocaleString(
                                  'es-CO'
                                )}
                              </div>
                            </div>

                            {/* Información */}
                            <div className="flex flex-1 flex-col justify-between space-y-3 p-4">
                              <div>
                                <h4 className="line-clamp-1 text-sm font-bold text-gray-900">
                                  {event.name}
                                </h4>

                                <p className="mt-1 line-clamp-2 text-xs text-gray-500">
                                  {event.description ||
                                    'Sin descripción.'}
                                </p>
                              </div>

                              {/* Fecha */}
                              <div className="text-xs text-gray-500">
                                🗓️{' '}
                                {new Date(
                                  event.date
                                ).toLocaleDateString('es-CO')}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="rounded-2xl border border-gray-200 bg-white p-8 text-center">
                <p className="text-sm text-gray-500">
                  Por favor, selecciona una categoría del panel izquierdo
                  para ver sus eventos relacionados.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;

