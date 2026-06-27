'use client';

import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { getUser, removeToken } from '@/lib/auth';
import { User } from '@/types/auth';

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUserState] = useState<User | null>(null);

  useEffect(() => {
    const syncUser = () => setUserState(getUser());
    syncUser();

    window.addEventListener('auth-change', syncUser);
    return () => window.removeEventListener('auth-change', syncUser);
  }, [pathname]);

  const handleLogout = () => {
    removeToken();
    setUserState(null);
    router.push('/login');
    router.refresh();
  };

  return (
    <nav className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <Link href="/" className="text-xl font-semibold text-gray-900">
            ProductStore
          </Link>
          <div className="flex gap-6 items-center">
            <Link href="/" className="text-gray-600 hover:text-gray-900 transition-colors">
              Productos
            </Link>
            {user?.role === 'ADMIN' && (
              <Link
                href="/admin"
                className={`transition-colors ${
                  pathname.startsWith('/admin')
                    ? 'text-gray-900 font-medium'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Admin
              </Link>
            )}
            {user ? (
              <>
                <span className="text-sm text-gray-500">{user.nombre}</span>
                <button
                  onClick={handleLogout}
                  className="text-sm text-red-600 hover:text-red-800"
                >
                  Salir
                </button>
              </>
            ) : (
              <Link href="/login" className="text-gray-600 hover:text-gray-900 transition-colors">
                Ingresar
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
