import { Category } from './category';

export interface Product {
  id: number;
  nombre: string;
  precio: number;
  descripcion?: string;
  imageUrl?: string;
  categoryId?: number;
  category?: Category;
  createdAt?: string;
  updatedAt?: string;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}
