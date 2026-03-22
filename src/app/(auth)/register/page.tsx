'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { RegisterForm } from '../../../shared/components/forms/register-form';
import { ArrowLeft, Scissors, Users, Calendar, Clock, Sparkles } from 'lucide-react';

export default function RegisterPage() {
  const router = useRouter();

  useEffect(() => {
    const pending = localStorage.getItem('pendingBooking');
    if (pending) {
      console.log('📝 Reserva pendiente:', JSON.parse(pending));
    }
  }, []);

  const handleSuccess = () => {
    const pending = localStorage.getItem('pendingBooking');
    if (pending) {
      const booking = JSON.parse(pending);
      localStorage.removeItem('pendingBooking');
      router.push(`/dashboard/client/book?serviceId=${booking.serviceId}`);
    } else {
      router.push('/dashboard/client');
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Columna izquierda - Sticky */}
      <div className="hidden lg:flex lg:w-1/2 sticky top-0 h-screen bg-linear-to-br from-teal-600 to-blue-700">
        <div className="absolute inset-0">
          <Image
            src="/images/fondo.jpg"
            alt="Barbería"
            fill
            sizes="50vw"
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-black/50 z-10" />
          <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/20 to-black/30 z-10" />
        </div>
        <div className="relative z-20 flex flex-col justify-center items-center text-white p-8 text-center w-full h-full">
          <div className="mb-6">
            <div className="bg-white/20 backdrop-blur-sm rounded-full p-3 inline-block">
              <Scissors className="h-10 w-10 text-white" />
            </div>
          </div>
          <h2 className="text-3xl font-bold mb-2 drop-shadow-lg">
            Únete a <span className="text-teal-200">miTurno</span>
          </h2>
          <p className="text-md text-white/90 max-w-md mb-6 drop-shadow">
            Crea tu cuenta y comienza a disfrutar de la mejor experiencia en reserva de citas.
          </p>

          <div className="grid grid-cols-1 gap-2 w-full max-w-sm">
            <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-lg p-2 transition hover:bg-white/20">
              <div className="bg-teal-400/30 p-1 rounded-full">
                <Calendar className="h-3 w-3 text-teal-200" />
              </div>
              <span className="text-sm text-white/90">Reserva en segundos</span>
              <Sparkles className="h-2 w-2 text-teal-300 ml-auto" />
            </div>
            <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-lg p-2 transition hover:bg-white/20">
              <div className="bg-teal-400/30 p-1 rounded-full">
                <Users className="h-3 w-3 text-teal-200" />
              </div>
              <span className="text-sm text-white/90">Gestiona tu negocio</span>
            </div>
            <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-lg p-2 transition hover:bg-white/20">
              <div className="bg-teal-400/30 p-1 rounded-full">
                <Clock className="h-3 w-3 text-teal-200" />
              </div>
              <span className="text-sm text-white/90">Recordatorios automáticos</span>
            </div>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-linear-to-t from-black/50 to-transparent z-10" />
      </div>

      {/* Columna derecha - Formulario centrado */}
      <div className="flex-1 flex items-center justify-center bg-linear-to-br from-teal-50 to-blue-50 p-6">
        <div className="w-full max-w-md">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-gray-500 hover:text-gray-700 mb-4 transition group"
          >
            <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
            Volver al inicio
          </Link>

          <div className="bg-white rounded-2xl shadow-xl p-6">
            <div className="text-center mb-4">
              <h1 className="text-xl font-bold text-gray-900">
                Crear cuenta en <span className="text-teal-600">miTurno</span>
              </h1>
              <p className="text-sm text-gray-500 mt-1">
                Comienza a reservar tus citas hoy
              </p>
            </div>

            <RegisterForm onSuccess={handleSuccess} />

            <p className="text-center text-sm text-gray-600 mt-4">
              ¿Ya tienes una cuenta?{' '}
              <Link href="/login" className="text-teal-600 hover:text-teal-700 font-medium hover:underline">
                Inicia sesión
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
