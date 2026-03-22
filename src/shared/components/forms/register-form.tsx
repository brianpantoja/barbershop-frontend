'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { authService } from '../../../core/services/auth.service';
import { toast } from 'sonner';

// Definir tipo para el error de Axios
interface ApiError {
  response?: {
    data?: {
      message?: string;
    };
  };
  message?: string;
}

// Validaciones mejoradas
const registerSchema = z.object({
  name: z.string()
    .min(2, 'Nombre requerido')
    .regex(/^[a-zA-ZáéíóúñÑ\s]+$/, 'Solo letras y espacios'),

  email: z.string()
    .email('Email inválido'),

  phone: z.string()
    .optional()
    .refine(val => !val || /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/.test(val), {
      message: 'Teléfono inválido'
    }),

  password: z.string()
    .min(6, 'Mínimo 6 caracteres')
    .regex(/[A-Za-z]/, 'Debe contener una letra')
    .regex(/[0-9]/, 'Debe contener un número')
    .regex(/^[A-Za-z0-9!@#$%^&*]+$/, 'Solo letras, números y !@#$%^&*'),

  role: z.enum(['client', 'business']),

  businessName: z.string().optional(),
  businessAddress: z.string().optional(),
}).refine((data) => {
  if (data.role === 'business' && !data.businessName) {
    return false;
  }
  return true;
}, {
  message: 'Nombre del negocio requerido',
  path: ['businessName'],
});

type RegisterFormValues = z.infer<typeof registerSchema>;

interface RegisterFormProps {
  onSuccess?: () => void;
}

export function RegisterForm({ onSuccess }: RegisterFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, watch, formState: { errors } } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      role: 'client',
    },
  });

  const role = watch('role');

  const onSubmit = async (data: RegisterFormValues) => {
    setLoading(true);
    try {
      await authService.register(data);
      toast.success('Cuenta creada exitosamente');
      if (onSuccess) {
        onSuccess();
      } else {
        router.push('/login');
      }
    } catch (err) {
      const error = err as ApiError;
      const message = error?.response?.data?.message || 'Error al crear cuenta';
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
      <div>
        <label className="block text-sm font-medium mb-1">Nombre completo</label>
        <input
          {...register('name')}
          type="text"
          className="w-full px-3 py-1.5 border rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition text-sm"
          placeholder="Juan Pérez"
        />
        {errors.name && (
          <p className="text-xs text-red-500 mt-0.5">{errors.name.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Correo electrónico</label>
        <input
          {...register('email')}
          type="email"
          className="w-full px-3 py-1.5 border rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition text-sm"
          placeholder="tu@email.com"
        />
        {errors.email && (
          <p className="text-xs text-red-500 mt-0.5">{errors.email.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Teléfono (opcional)</label>
        <input
          {...register('phone')}
          type="tel"
          className="w-full px-3 py-1.5 border rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition text-sm"
          placeholder="+57 300 123 4567"
        />
        {errors.phone && (
          <p className="text-xs text-red-500 mt-0.5">{errors.phone.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Contraseña</label>
        <input
          {...register('password')}
          type="password"
          className="w-full px-3 py-1.5 border rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition text-sm"
          placeholder="********"
        />
        {errors.password && (
          <p className="text-xs text-red-500 mt-0.5">{errors.password.message}</p>
        )}
        <p className="text-xs text-gray-400 mt-0.5">
          Mínimo 6 caracteres, una letra y un número
        </p>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Tipo de cuenta</label>
        <select
          {...register('role')}
          className="w-full px-3 py-1.5 border rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition text-sm"
        >
          <option value="client">Cliente - Reservar citas</option>
          <option value="business">Negocio - Gestionar barbería</option>
        </select>
      </div>

      {role === 'business' && (
        <>
          <div>
            <label className="block text-sm font-medium mb-1">Nombre del negocio</label>
            <input
              {...register('businessName')}
              type="text"
              className="w-full px-3 py-1.5 border rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition text-sm"
              placeholder="Mi Barbería"
            />
            {errors.businessName && (
              <p className="text-xs text-red-500 mt-0.5">{errors.businessName.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Dirección (opcional)</label>
            <input
              {...register('businessAddress')}
              type="text"
              className="w-full px-3 py-1.5 border rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition text-sm"
              placeholder="Calle 123, Ciudad"
            />
          </div>
        </>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-linear-to-r from-teal-600 to-blue-600 text-white py-2 rounded-lg hover:shadow-md transition disabled:opacity-50 text-sm font-medium mt-2"
      >
        {loading ? 'Creando cuenta...' : 'Registrarse'}
      </button>
    </form>
  );
}
