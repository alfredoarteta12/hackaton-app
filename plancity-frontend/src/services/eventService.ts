import { api } from "../lib/api";
import type { CreateEventPayload, UpdateEventPayload } from "../types/event";


export async function getAllEvents(): Promise<Event[]> {
  try {
    const response = await api.get<Event[]>('/events');
    return response.data;
  } catch (error) {
    throw new Error('No se pudieron obtener los eventos. Por favor, inténtelo de nuevo más tarde.', { cause: error });
  }
}

export async function createEvent(payload: CreateEventPayload): Promise<Event> {
  try {
    const response = await api.post<Event>('/events', payload);
    return response.data;
  } catch (error) {
    throw new Error('Error al crear el evento. Verifique los datos e inténtelo de nuevo.', { cause: error });
  }
}

export async function updateEvent(id: string, payload: UpdateEventPayload): Promise<Event> {
  try {
    const response = await api.patch<Event>(`/events/${id}`, payload);
    return response.data;
  } catch (error) {
    throw new Error('No se pudo actualizar el evento. Es posible que el recurso no exista o los datos sean inválidos.', { cause: error });
  }
}

export async function deleteEvent(id: string): Promise<void> {
  try {
    await api.delete(`/events/${id}`);
  } catch (error) {
    throw new Error('Error al eliminar el evento. Asegúrese de que no tenga dependencias asociadas.', { cause: error });
  }
}
