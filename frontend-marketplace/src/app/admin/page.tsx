'use client';

import { useState, useEffect } from 'react';
import { Product, ApiResponse } from '@/types/product';
import { Category } from '@/types/category';
import { clientApiFetch } from '@/lib/api.client';

export default function AdminPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    nombre: '',
    precio: '',
    descripcion: '',
    categoryId: '',
    imageUrl: '',
  });
  const [editingId, setEditingId] = useState<number | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [productsRes, categoriesRes] = await Promise.all([
        clientApiFetch('/products'),
        clientApiFetch('/categories'),
      ]);

      const productsData: ApiResponse<Product[]> = await productsRes.json();
      const categoriesData: ApiResponse<Category[]> = await categoriesRes.json();

      if (productsData.success) setProducts(productsData.data);
      if (categoriesData.success) setCategories(categoriesData.data);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const url = editingId
      ? `/products/${editingId}`
      : '/products';
    const method = editingId ? 'PUT' : 'POST';

    try {
      const res = await clientApiFetch(url, {
        method,
        body: JSON.stringify({
          nombre: formData.nombre,
          precio: parseFloat(formData.precio),
          descripcion: formData.descripcion || undefined,
          categoryId: formData.categoryId ? parseInt(formData.categoryId) : null,
          imageUrl: formData.imageUrl || undefined,
        }),
      });

      if (res.ok) {
        setFormData({ nombre: '', precio: '', descripcion: '', categoryId: '', imageUrl: '' });
        setEditingId(null);
        fetchData();
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleEdit = (product: Product) => {
    setFormData({
      nombre: product.nombre,
      precio: product.precio.toString(),
      descripcion: product.descripcion || '',
      categoryId: product.categoryId?.toString() || '',
      imageUrl: product.imageUrl || '',
    });
    setEditingId(product.id);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('¿Estás seguro?')) return;

    try {
      const res = await clientApiFetch(`/products/${id}`, { method: 'DELETE' });
      if (res.ok) fetchData();
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleCancel = () => {
    setFormData({ nombre: '', precio: '', descripcion: '', categoryId: '', imageUrl: '' });
    setEditingId(null);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <p className="text-gray-500">Cargando...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">
        Administración de Productos
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            {editingId ? 'Editar Producto' : 'Crear Producto'}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
              <input
                type="text"
                required
                value={formData.nombre}
                onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-black bg-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Precio</label>
              <input
                type="number"
                step="0.01"
                required
                value={formData.precio}
                onChange={(e) => setFormData({ ...formData, precio: e.target.value })}
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-black bg-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Categoría</label>
              <select
                value={formData.categoryId}
                onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-black bg-white"
              >
                <option value="">Sin categoría</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>{cat.nombre}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">URL de imagen</label>
              <input
                type="url"
                value={formData.imageUrl}
                onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                placeholder="https://..."
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-black bg-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
              <textarea
                rows={3}
                value={formData.descripcion}
                onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-black bg-white"
              />
            </div>
            <div className="flex gap-2">
              <button
                type="submit"
                className="bg-gray-900 text-white px-4 py-2 rounded-md hover:bg-gray-800"
              >
                {editingId ? 'Actualizar' : 'Crear'}
              </button>
              {editingId && (
                <button
                  type="button"
                  onClick={handleCancel}
                  className="border border-gray-300 px-4 py-2 rounded-md hover:bg-gray-50"
                >
                  Cancelar
                </button>
              )}
            </div>
          </form>
        </div>

        <div className="lg:col-span-2 bg-white border border-gray-200 rounded-lg overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nombre</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Categoría</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Precio</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {products.map((product) => (
                <tr key={product.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm text-gray-900">{product.nombre}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {product.category?.nombre || '-'}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">S/ {product.precio}</td>
                  <td className="px-6 py-4 text-sm space-x-2">
                    <button onClick={() => handleEdit(product)} className="text-gray-600 hover:text-gray-900">
                      Editar
                    </button>
                    <button onClick={() => handleDelete(product.id)} className="text-red-600 hover:text-red-800">
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
