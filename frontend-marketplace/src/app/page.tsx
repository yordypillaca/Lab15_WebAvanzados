import Link from 'next/link';
import { Suspense } from 'react';
import { Product, ApiResponse } from '@/types/product';
import { Category } from '@/types/category';
import { apiFetch } from '@/lib/api.server';
import CategoryFilter from '@/components/CategoryFilter';

async function getProducts(categoryId?: string): Promise<Product[]> {
  try {
    const query = categoryId ? `?categoryId=${categoryId}` : '';
    const res = await apiFetch(`/products${query}`);

    if (!res.ok) return [];

    const data: ApiResponse<Product[]> = await res.json();
    return data.success ? data.data : [];
  } catch (error) {
    console.error('Error fetching products:', error);
    return [];
  }
}

async function getCategories(): Promise<Category[]> {
  try {
    const res = await apiFetch('/categories');
    if (!res.ok) return [];
    const data: ApiResponse<Category[]> = await res.json();
    return data.success ? data.data : [];
  } catch (error) {
    console.error('Error fetching categories:', error);
    return [];
  }
}

export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<{ categoryId?: string }>;
}) {
  const { categoryId } = await searchParams;
  const [products, categories] = await Promise.all([
    getProducts(categoryId),
    getCategories(),
  ]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Productos</h1>

      <Suspense fallback={<div className="mb-8 h-10" />}>
        <CategoryFilter categories={categories} />
      </Suspense>

      {products.length === 0 ? (
        <div className="text-center py-12 bg-white border border-gray-200 rounded-lg">
          <p className="text-gray-500">No hay productos disponibles</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <Link
              key={product.id}
              href={`/products/${product.id}`}
              className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow flex flex-col h-full"
            >
              <div className="w-full h-48 bg-white flex-shrink-0 overflow-hidden flex items-center justify-center">
                {product.imageUrl ? (
                  <img
                    src={product.imageUrl}
                    alt={product.nombre}
                    className="max-w-full max-h-full object-contain"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm">
                    Sin imagen
                  </div>
                )}
              </div>
              <div className="p-6 flex flex-col flex-1">
                {product.category && (
                  <span className="text-xs text-gray-500 uppercase">
                    {product.category.nombre}
                  </span>
                )}
                <h2 className="text-lg font-semibold text-gray-900 mb-2">
                  {product.nombre}
                </h2>
                <p className="text-xl font-bold text-gray-900 mb-2">
                  S/ {product.precio}
                </p>
                {product.descripcion && (
                  <p className="text-gray-600 text-sm line-clamp-2">
                    {product.descripcion}
                  </p>
                )}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
