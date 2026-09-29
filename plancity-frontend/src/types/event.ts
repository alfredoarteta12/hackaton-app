import type { Category } from "./category";

export interface EventImage {
  url: string;
}

// Objeto principal que retorna la API
export interface Event {
  id: string;
  name: string;
  description: string | null;
  price: number;
  capacity: number;
  date: string;      
  location: string;
  categoryId: string;
  category: Category;
  createdAt: string;
  updatedAt: string;
  
  images?: EventImage[];
}

export interface CreateEventPayload {
  name: string;
  description: string | null;
  price: number;
  capacity: number;
  date: string;       
  location: string;    
  categoryId: string;
  images: string[];    
}

export type UpdateEventPayload = Partial<CreateEventPayload>;
