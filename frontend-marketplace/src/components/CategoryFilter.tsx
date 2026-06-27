'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { Category } from '@/types/category';

interface Props {
  categories: Category[];
}

export default function CategoryFilter({ categories }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const selected = searchParams.get('categoryId') || '';

  const handleChange = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set('categoryId', value);
    } else {
      params.delete('categoryId');
    }
    router.push(`/?${params.toString()}`);
  };

  return (
    <div className="mb-8">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Filtrar por categoría
      </label>
      <select
        value={selected}
        onChange={(e) => handleChange(e.target.value)}
        className="border border-gray-300 rounded-md px-3 py-2 bg-white min-w-[200px] text-black"
      >
        <option value="">Todas las categorías</option>
        {categories.map((cat) => (
          <option key={cat.id} value={cat.id}>
            {cat.nombre}
          </option>
        ))}
      </select>
    </div>
  );
}
