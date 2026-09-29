import { api } from "../lib/api";
import type { Category, CreateCategoryPayload, UpdateCategoryPayload } from "../types/category";

export async function getAllCategories(): Promise<Category[]> {
  try {
    const response = await api.get<Category[]>('/categories');
    return response.data;
  } catch (error) {
    throw new Error('No se pudieron obtener las categorías. Por favor, inténtelo de nuevo más tarde.', { cause: error });
  }
}

export async function createCategory(payload: CreateCategoryPayload): Promise<Category> {
  try {
    const response = await api.post<Category>('/categories', payload);
    return response.data;
  } catch (error) {
    throw new Error('Error al crear la categoría. Verifique los datos e inténtelo de nuevo.', { cause: error });
  }
}

export async function updateCategory(id: string, payload: UpdateCategoryPayload): Promise<Category> {
  try {
    const response = await api.patch<Category>(`/categories/${id}`, payload);
    return response.data;
  } catch (error) {
    throw new Error('No se pudo actualizar la categoría. Es posible que el recurso no exista o los datos sean inválidos.', { cause: error });
  }
}

export async function deleteCategory(id: string): Promise<void> {
  try {
    await api.delete<Category>(`/categories/${id}`);
  } catch (error) {
    throw new Error('Error al eliminar la categoría. Asegúrese de que no tenga productos asociados.', { cause: error });
  }
}
