'use client';

import Link from 'next/link';
import Image from 'next/image';
import { LoginForm } from '../../../shared/components/forms/login-form';
import { ArrowLeft, Scissors } from 'lucide-react';

export default function LoginPage() {
  return (
    <div className="min-h-screen flex">
      {/* Columna izquierda - Imagen */}
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
          {/* Overlay más oscuro para mejor contraste */}
          <div className="absolute inset-0 bg-black/50 z-10" />
          {/* Gradiente adicional para mejorar legibilidad */}
          <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/20 to-black/30 z-10" />
        </div>
        <div className="relative z-20 flex flex-col justify-center items-center text-white p-12 text-center w-full h-full">
          <div className="mb-8">
            <div className="bg-white/20 backdrop-blur-sm rounded-full p-4 inline-block">
              <Scissors className="h-12 w-12 text-white" />
            </div>
          </div>
          <h2 className="text-4xl font-bold mb-4 drop-shadow-lg">
            ¡Bienvenido de vuelta!
          </h2>
          <p className="text-lg text-white/90 max-w-md mb-8 drop-shadow">
            Inicia sesión para gestionar tus citas, reservar servicios y mantenerte al día con tu barbería favorita.
          </p>
          <div className="mt-6 space-y-3 w-full max-w-sm">
            <div className="flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-lg p-3">
              <div className="w-2 h-2 bg-teal-300 rounded-full" />
              <span className="text-white/90">Reserva rápida y sencilla</span>
            </div>
            <div className="flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-lg p-3">
              <div className="w-2 h-2 bg-teal-300 rounded-full" />
              <span className="text-white/90">Gestiona tus citas fácilmente</span>
            </div>
            <div className="flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-lg p-3">
              <div className="w-2 h-2 bg-teal-300 rounded-full" />
              <span className="text-white/90">Recibe recordatorios</span>
            </div>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-linear-to-t from-black/50 to-transparent z-10" />
      </div>

      {/* Columna derecha - Formulario */}
      <div className="flex-1 flex items-center justify-center bg-linear-to-br from-teal-50 to-blue-50 p-8">
        <div className="w-full max-w-md">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-gray-500 hover:text-gray-700 mb-8 transition group"
          >
            <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
            Volver al inicio
          </Link>

          <div className="bg-white rounded-2xl shadow-xl p-8">
            <div className="text-center mb-8">
              <h1 className="text-2xl font-bold text-gray-900">Iniciar sesión</h1>
              <p className="text-gray-500 mt-2">
                Ingresa tus credenciales para acceder a tu cuenta
              </p>
            </div>

            <LoginForm />

            <p className="text-center text-sm text-gray-600 mt-6">
              ¿No tienes una cuenta?{' '}
              <Link href="/register" className="text-teal-600 hover:text-teal-700 font-medium hover:underline">
                Regístrate aquí
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
