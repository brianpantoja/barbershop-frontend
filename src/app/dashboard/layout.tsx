'use client';

import { useAuthStore } from '../../storage/auth.store';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { LogoutButton } from '../../shared/components/auth/logout-button';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { user, isLoading, checkAuth } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/login');
    }
  }, [isLoading, user, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-linear-to-r from-teal-700 to-teal-700 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-bold text-white">Barbershop</h1>
              <span className="ml-4 px-3 py-1 bg-white/20 text-white text-sm rounded-full backdrop-blur-sm">
                {user.role === 'business' ? 'Negocio' : 'Cliente'}
              </span>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-white/90">
                {user?.businessName || user?.name}
              </span>
              <LogoutButton />
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  );
}
