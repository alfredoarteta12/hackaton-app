/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from 'react';
import {
  getAllCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} from '../services/categoryService'; // Apunta directo a tu archivo de servicios
import type { Category } from '../types/category';

// Paleta cíclica para el color temático de cada tarjeta
const BG_COLORS = [
  'bg-teal-50 border-teal-200 text-teal-700',
  'bg-amber-50 border-amber-200 text-amber-700',
  'bg-purple-50 border-purple-200 text-purple-700',
  'bg-blue-50 border-blue-200 text-blue-700',
  'bg-rose-50 border-rose-200 text-rose-700'
];

function CategoryPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);

  // Carga las categorías aislando la lógica para evitar llamados en cascada en el Effect
  const loadCategories = async () => {
    try {
      const data = await getAllCategories();
      setCategories(data);
      setLoading(false);
    } catch {
      setError('No se pudieron cargar las categorías. Intente de nuevo más tarde.');
      setLoading(false);
    }
  };

  useEffect(() => {
    const init = async () => {
      await loadCategories();
    };
    init();
  }, []);

  const resetForm = () => {
    setName('');
    setDescription('');
    setEditingId(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (editingId) {
        await updateCategory(editingId, { name, description });
      } else {
        await createCategory({ name, description });
      }
      resetForm();
      await loadCategories();
    } catch {
      setError(
        editingId
          ? 'No se pudo actualizar la categoría. Verifique los datos.'
          : 'No se pudo crear la categoría. Verifique los datos.',
      );
      setLoading(false);
    }
  };

  const handleEditClick = (category: Category) => {
    setEditingId(category.id);
    setName(category.name);
    setDescription(category.description ?? '');
  };

  const handleCancelEdit = () => {
    resetForm();
  };

  const handleDelete = async (id: string) => {
    const confirmado = window.confirm(
      '¿Seguro que quieres eliminar esta categoría?',
    );
    if (!confirmado) return;

    setError(null);
    setLoading(true);
    try {
      await deleteCategory(id);
      await loadCategories();
    } catch {
      setError('Error al eliminar la categoría. Asegúrese de que no tenga productos asociados.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      {/* Encabezado */}
      <header className="max-w-6xl mx-auto mb-8 border-b border-gray-200 pb-5">
        <span className="text-sm font-semibold uppercase tracking-wider text-indigo-600">Catálogo</span>
        <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 mt-1">Categorías</h1>
      </header>

      {/* Distribución del Formulario y Listado */}
      <div className="max-w-6xl mx-auto grid gap-8 lg:grid-cols-3">
        
        {/* Formulario Lateral Sticky */}
        <div className="lg:col-span-1">
          <form className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 space-y-4 sticky top-6" onSubmit={handleSubmit}>
            <h2 className="text-xl font-bold text-gray-900 mb-2">
              {editingId ? 'Editar categoría' : 'Nueva categoría'}
            </h2>

            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700" htmlFor="name">Nombre</label>
              <input
                id="name"
                className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-950 placeholder-gray-400 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 sm:text-sm"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                minLength={2}
                maxLength={100}
                placeholder="Ej. Deportes, Conciertos"
              />
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700" htmlFor="description">Descripción</label>
              <textarea
                id="description"
                className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-950 placeholder-gray-400 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 sm:text-sm"
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                maxLength={255}
                placeholder="Breve descripción de la categoría..."
              />
            </div>

            <div className="flex gap-3 pt-2">
              <button type="submit" className="flex-1 justify-center rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 transition-colors">
                {editingId ? 'Guardar cambios' : 'Crear categoría'}
              </button>
              {editingId && (
                <button type="button" className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-700 shadow-sm hover:bg-gray-50" onClick={handleCancelEdit}>
                  Cancelar
                </button>
              )}
            </div>

            {error && (
              <p className="rounded-lg bg-red-50 p-3 text-sm font-medium text-red-600 border border-red-100 mt-4">
                {error}
              </p>
            )}
          </form>
        </div>

        {/* Listado Principal de Ficheros */}
        <section className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between border-b border-gray-100 pb-3">
            <h2 className="text-xl font-bold text-gray-900">Fichero</h2>
            <span className="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-800">
              {categories.length} categorías
            </span>
          </div>

          {loading ? (
            <p className="text-center py-12 text-gray-500 font-medium animate-pulse">Cargando categorías…</p>
          ) : categories.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-2xl border border-dashed border-gray-300 text-gray-500">
              Todavía no hay categorías. Crea la primera desde el formulario.
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2">
              {categories.map((category, i) => {
                const colorClass = BG_COLORS[i % BG_COLORS.length];
                return (
                  <article
                    key={category.id}
                    className="flex flex-col justify-between p-5 bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden"
                  >
                    {/* Indicador superior de paleta dinámica */}
                    <div className={`absolute top-0 left-0 right-0 h-1 ${colorClass.split(' ')[0]}`} />
                    
                    <div className="space-y-2 mt-1">
                      <h3 className="text-lg font-bold text-gray-900">{category.name}</h3>
                      {category.description && (
                        <p className="text-sm text-gray-500 line-clamp-2 leading-relaxed">
                          {category.description}
                        </p>
                      )}
                    </div>
                    
                    <div className="flex gap-4 mt-5 pt-3 border-t border-gray-50 text-sm font-medium">
                      <button 
                        className="text-indigo-600 hover:text-indigo-500 transition-colors" 
                        onClick={() => handleEditClick(category)}
                      >
                        Editar
                      </button>
                      <button 
                        className="text-red-600 hover:text-red-500 transition-colors" 
                        onClick={() => handleDelete(category.id)}
                      >
                        Eliminar
                      </button>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

export default CategoryPage;
