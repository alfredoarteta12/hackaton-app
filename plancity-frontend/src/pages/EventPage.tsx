/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from 'react';
import type { ChangeEvent, FormEvent } from 'react';
import { getAllEvents, createEvent, updateEvent, deleteEvent } from '../services/eventService';
import { getAllCategories } from '../services/categoryService';
import type { Event, CreateEventPayload, UpdateEventPayload } from '../types/event';
import type { Category } from '../types/category';

const BG_COLORS = ['bg-blue-50 text-blue-700', 'bg-purple-50 text-purple-700', 'bg-teal-50 text-teal-700', 'bg-amber-50 text-amber-700'];

// OJO: estos campos deben existir en CreateEventPayload / UpdateEventPayload
// en types/event.ts. Si "date", "location" o "capacity" no están ahí,
// TypeScript se va a quejar y hay que agregarlos al tipo.
const EMPTY_FORM = {
  name: '',
  description: '',
  price: 0,
  capacity: 0,
  date: '',
  location: '',
  categoryId: '',
  imageUrl: ''
};

function EventPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState(EMPTY_FORM);
  const [editingId, setEditingId] = useState<string | null>(null);

  const loadData = async () => {
    try {
      const [evs, cats] = await Promise.all([getAllEvents(), getAllCategories()]);
      setEvents(evs);
      setCategories(cats);
      setLoading(false);
    } catch {
      setError('Error al sincronizar datos.');
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      loadData();
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  const resetForm = () => {
    setEditingId(null);
    setFormData(EMPTY_FORM);
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [id]: id === 'price' || id === 'capacity' ? Number(value) : value
    }));
  };

  // El <input type="datetime-local"> devuelve algo como "2026-09-01T15:30",
  // que NO es ISO 8601 válido (le falta la parte de segundos/zona horaria).
  // Lo convertimos antes de enviarlo.
  const toIsoString = (localDateTime: string) => {
    if (!localDateTime) return '';
    return new Date(localDateTime).toISOString();
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const eventPrice = Number(formData.price) || 0;
    const eventCapacity = Number(formData.capacity) || 0;
    const isoDate = toIsoString(formData.date);

    try {
      const currentEditingId = editingId;

      if (currentEditingId) {
        const updatePayload: UpdateEventPayload = {
          name: formData.name,
          description: formData.description.trim() ? formData.description : null,
          price: eventPrice,
          capacity: eventCapacity,
          date: isoDate,
          location: formData.location,
          categoryId: formData.categoryId,
        };
        await updateEvent(currentEditingId, updatePayload);
      } else {
        const createPayload: CreateEventPayload = {
          name: formData.name,
          description: formData.description.trim() ? formData.description : null,
          price: eventPrice,
          capacity: eventCapacity,
          date: isoDate,
          location: formData.location,
          categoryId: formData.categoryId,
          images: formData.imageUrl.trim() ? [formData.imageUrl.trim()] : []
        };
        await createEvent(createPayload);
      }

      resetForm();
      await loadData();
    } catch (err: any) {
      // El backend manda un array en "message" cuando es un error de validación
      // (class-validator). Lo unimos para mostrarlo completo en vez de "[object Object]".
      const rawMessage =
        err?.cause?.response?.data?.message ||
        err?.response?.data?.message ||
        err?.message;

      const backendMessage = Array.isArray(rawMessage) ? rawMessage.join(' | ') : rawMessage;

      setError(editingId
        ? `No se pudo actualizar: ${backendMessage || 'Datos inválidos'}`
        : `No se pudo crear: ${backendMessage || 'Datos inválidos'}`
      );
      setLoading(false);
    }
  };

  const handleEdit = (event: Event) => {
    setEditingId(event.id);

    let imgUrl = '';
    if (event.images && event.images.length > 0) {
      const firstImage = event.images[0];
      if (firstImage) {
        imgUrl = typeof firstImage === 'string' ? firstImage : (firstImage.url || '');
      }
    }

    setFormData({
      name: event.name,
      description: event.description ?? '',
      price: event.price,
      capacity: (event as any).capacity ?? 0,
      date: (event as any).date ? (event as any).date.slice(0, 16) : '', // recorta a formato datetime-local
      location: (event as any).location ?? '',
      categoryId: event.categoryId,
      imageUrl: imgUrl
    });
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('¿Eliminar evento?')) return;
    setError(null);
    setLoading(true);
    try {
      await deleteEvent(id);
      if (editingId === id) resetForm();
      await loadData();
    } catch {
      setError('No se pudo eliminar.');
      setLoading(false);
    }
  };

  if (loading) return <p className="text-center py-12 text-gray-500 animate-pulse">Cargando...</p>;

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-8 grid gap-8 lg:grid-cols-3">
      {/* Formulario */}
      <form className="bg-white p-6 rounded-2xl border space-y-4 h-fit sticky top-6" onSubmit={handleSubmit}>
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-bold text-gray-900">{editingId ? 'Editar evento' : 'Nuevo evento'}</h2>
          {editingId && (
            <button type="button" className="text-xs text-indigo-600 font-semibold" onClick={resetForm}>
              + Nuevo evento
            </button>
          )}
        </div>
        {error && <p className="text-sm text-red-600 bg-red-50 p-2 rounded whitespace-pre-line">{error}</p>}

        <input id="name" required placeholder="Nombre" className="w-full border p-2 rounded-lg text-sm text-gray-950" value={formData.name} onChange={handleChange} />

        <div className="grid grid-cols-2 gap-2">
          <input id="price" type="number" required placeholder="Precio" className="w-full border p-2 rounded-lg text-sm text-gray-950" value={formData.price || ''} onChange={handleChange} />
          <input id="capacity" type="number" required min={1} placeholder="Capacidad" className="w-full border p-2 rounded-lg text-sm text-gray-950" value={formData.capacity || ''} onChange={handleChange} />
        </div>

        <input id="date" type="datetime-local" required className="w-full border p-2 rounded-lg text-sm text-gray-950" value={formData.date} onChange={handleChange} />

        <input id="location" required minLength={2} placeholder="Ubicación" className="w-full border p-2 rounded-lg text-sm text-gray-950" value={formData.location} onChange={handleChange} />

        <select id="categoryId" required className="w-full border p-2 rounded-lg text-sm text-gray-950" value={formData.categoryId} onChange={handleChange}>
          <option value="" disabled>Selecciona Categoría</option>
          {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>

        <input id="imageUrl" placeholder="URL de la Imagen" className="w-full border p-2 rounded-lg text-sm text-gray-950" value={formData.imageUrl} onChange={handleChange} />
        <textarea id="description" placeholder="Descripción" rows={2} className="w-full border p-2 rounded-lg text-sm text-gray-950" value={formData.description} onChange={handleChange} />

        <div className="flex gap-2">
          <button type="submit" className="flex-1 bg-indigo-600 text-white py-2 rounded-lg text-sm font-semibold hover:bg-indigo-500">Guardar</button>
          {editingId && (
            <button type="button" className="border p-2 rounded-lg text-sm text-gray-700" onClick={resetForm}>
              Cancelar
            </button>
          )}
        </div>
      </form>

      {/* Listado */}
      <section className="lg:col-span-2 space-y-4">
        <h2 className="text-xl font-bold text-gray-900 border-b pb-2">Fichero ({events.length})</h2>
        {events.length === 0 ? <p className="text-gray-500 text-center py-8">No hay eventos.</p> : (
          <div className="grid gap-4 sm:grid-cols-2">
            {events.map((event, i) => {
              const firstImageObj = event.images && event.images.length > 0 ? event.images[0] : null;

              let displayImageUrl = '';
              if (firstImageObj) {
                displayImageUrl = typeof firstImageObj === 'string' ? firstImageObj : (firstImageObj as any).url;
              }

              return (
                <article key={event.id} className="bg-white rounded-xl border p-4 flex flex-col justify-between shadow-sm relative overflow-hidden">
                  <div className={`absolute top-0 left-0 right-0 h-1 ${BG_COLORS[i % BG_COLORS.length].split(' ')}`} />
                  <div className="space-y-2 mt-1">
                    {displayImageUrl && (
                      <img
                        src={displayImageUrl}
                        alt={event.name}
                        className="w-full h-32 object-cover rounded-lg"
                      />
                    )}

                    <div className="flex justify-between items-center text-xs">
                      <span className="font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded">{event.category?.name || 'Categoría'}</span>
                      <span className="font-bold text-gray-900">${event.price}</span>
                    </div>
                    <h3 className="font-bold text-gray-900 line-clamp-1">{event.name}</h3>
                    {event.description && <p className="text-xs text-gray-500 line-clamp-2">{event.description}</p>}
                    {(event as any).location && <p className="text-xs text-gray-400">📍 {(event as any).location}</p>}
                    {(event as any).capacity != null && (
                      <p className="text-xs text-gray-400">Capacidad: <span className="text-gray-700 font-semibold">{(event as any).capacity}</span></p>
                    )}
                  </div>
                  <div className="flex gap-4 mt-4 pt-2 border-t text-xs font-semibold">
                    <button className="text-indigo-600" onClick={() => handleEdit(event)}>Editar</button>
                    <button className="text-red-600" onClick={() => handleDelete(event.id)}>Eliminar</button>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}

export default EventPage;
