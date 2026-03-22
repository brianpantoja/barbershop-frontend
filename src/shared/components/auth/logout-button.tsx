'use client';

import { useRouter } from 'next/navigation';
import { useAuthStore } from '../../../storage/auth.store';
import { logoutUseCase } from '../../../core/usecases/logout.usecase';
import { toast } from 'sonner';
import { LogOut } from 'lucide-react';

export function LogoutButton() {
  const router = useRouter();
  const logout = useAuthStore((state) => state.logout);

  const handleLogout = async () => {
    try {
      await logoutUseCase.execute();
      logout(); // Limpiar store
      router.push('/login');
      toast.success('Sesión cerrada correctamente');
    } catch {
      toast.error('Error al cerrar sesión');
    }
  };

  return (
    <button
      onClick={handleLogout}
      className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-green-50 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition"
    >
      <LogOut className="h-4 w-4" />
      Cerrar sesión
    </button>
  );
}
