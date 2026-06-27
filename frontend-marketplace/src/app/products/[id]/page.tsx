import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Product, ApiResponse } from '@/types/product';
import { apiFetch } from '@/lib/api.server';

async function getProduct(id: string): Promise<Product | null> {
  try {
    const res = await apiFetch(`/products/${id}`);

    if (!res.ok) return null;

    const data: ApiResponse<Product> = await res.json();
    return data.success ? data.data : null;
  } catch (error) {
    console.error('Error fetching product:', error);
    return null;
  }
}

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const product = await getProduct(id);

  if (!product) {
    notFound();
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <Link
        href="/"
        className="text-gray-600 hover:text-gray-900 mb-6 inline-block"
      >
        ← Volver a productos
      </Link>

      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        <div className="w-full h-64 bg-white flex items-center justify-center">
          {product.imageUrl ? (
            <img
              src={product.imageUrl}
              alt={product.nombre}
              className="max-w-full max-h-full object-contain"
            />
          ) : (
            <span className="text-gray-400 text-sm">Sin imagen</span>
          )}
        </div>
        <div className="p-8">
          {product.category && (
            <span className="text-sm text-gray-500 uppercase">
              {product.category.nombre}
            </span>
          )}
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            {product.nombre}
          </h1>

          <div className="text-2xl font-bold text-gray-900 mb-6">
            S/ {product.precio}
          </div>

          {product.descripcion && (
            <div className="mb-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-2">
                Descripción
              </h2>
              <p className="text-gray-600">{product.descripcion}</p>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
