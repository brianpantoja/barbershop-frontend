'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Calendar, Clock, User, Phone, Tag, DollarSign, XCircle } from 'lucide-react';
import { appointmentRepository } from '../../../../../core/repositories/appointment.repository';
import { updateAppointmentStatusUseCase } from '../../../../../core/usecases/update-appointment-status.usecase';
import type { Appointment } from '../../../../../core/types/appointment';
import { formatDateToSpanish, formatTimeToAMPM } from '../../../../../shared/utils/date-utils';
import { toast } from 'sonner';

export default function ClientAppointmentDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const [appointment, setAppointment] = useState<Appointment | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    const loadAppointment = async () => {
      try {
        const data = await appointmentRepository.findById(id);
        setAppointment(data);
      } catch {
        toast.error('Error al cargar la cita');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      loadAppointment();
    }
  }, [id]);

  const handleCancel = async () => {
    if (!appointment) return;
    
    setUpdating(true);
    try {
      const updated = await updateAppointmentStatusUseCase.execute(
        appointment.id,
        'cancelled'
      );
      setAppointment(updated);
      toast.success('Cita cancelada correctamente');
    } catch {
      toast.error('Error al cancelar la cita');
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
      </div>
    );
  }

  if (!appointment) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600">Cita no encontrada</p>
        <Link href="/dashboard/client/appointments" className="text-blue-600 hover:underline mt-4 block">
          Volver a mis citas
        </Link>
      </div>
    );
  }

  const statusColors = {
    pending: 'bg-yellow-100 text-yellow-800',
    confirmed: 'bg-green-100 text-green-800',
    cancelled: 'bg-red-100 text-red-800',
    completed: 'bg-blue-100 text-blue-800',
  };

  const statusText = {
    pending: 'Pendiente',
    confirmed: 'Confirmada',
    cancelled: 'Cancelada',
    completed: 'Completada',
  };

  return (
    <div className="max-w-3xl mx-auto">
      {/* Header con navegación */}
      <div className="mb-6 flex items-center justify-between">
        <Link
          href="/dashboard/client/appointments"
          className="group flex items-center gap-2 text-gray-600 hover:text-gray-900 transition"
        >
          <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
          Volver a mis citas
        </Link>
        <span className={`px-4 py-2 rounded-full text-sm font-medium ${statusColors[appointment.status]}`}>
          {statusText[appointment.status]}
        </span>
      </div>

      {/* Tarjeta principal */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {/* Header con nombre del negocio */}
        <div className="bg-teal-50 to-blue-50 px-6 py-4 border-b border-gray-100">
          <h1 className="text-2xl font-bold text-gray-900">{appointment.businessName}</h1>
          <p className="text-sm text-gray-600 mt-1">Detalle de tu cita</p>
        </div>

        {/* Grid de información */}
        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Columna izquierda */}
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <Calendar className="h-5 w-5 text-gray-400 mt-0.5" />
              <div>
                <p className="text-sm text-gray-500">Fecha</p>
                <p className="font-medium text-gray-900">{formatDateToSpanish(appointment.date)}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Clock className="h-5 w-5 text-gray-400 mt-0.5" />
              <div>
                <p className="text-sm text-gray-500">Hora</p>
                <p className="font-medium text-gray-900">{formatTimeToAMPM(appointment.startTime)}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <User className="h-5 w-5 text-gray-400 mt-0.5" />
              <div>
                <p className="text-sm text-gray-500">Tu nombre</p>
                <p className="font-medium text-gray-900">{appointment.clientName}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Phone className="h-5 w-5 text-gray-400 mt-0.5" />
              <div>
                <p className="text-sm text-gray-500">Teléfono</p>
                <p className="font-medium text-gray-900">{appointment.clientPhone || 'No registrado'}</p>
              </div>
            </div>
          </div>

          {/* Columna derecha */}
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <Tag className="h-5 w-5 text-gray-400 mt-0.5" />
              <div>
                <p className="text-sm text-gray-500">Servicio</p>
                <p className="font-medium text-gray-900">{appointment.serviceName}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Clock className="h-5 w-5 text-gray-400 mt-0.5" />
              <div>
                <p className="text-sm text-gray-500">Duración</p>
                <p className="font-medium text-gray-900">{appointment.serviceDuration} minutos</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <DollarSign className="h-5 w-5 text-gray-400 mt-0.5" />
              <div>
                <p className="text-sm text-gray-500">Precio</p>
                <p className="font-medium text-gray-900">${appointment.servicePrice.toLocaleString()}</p>
              </div>
            </div>

            {appointment.notes && (
              <div className="flex items-start gap-3">
                <div className="h-5 w-5 text-gray-400 mt-0.5">📝</div>
                <div>
                  <p className="text-sm text-gray-500">Notas</p>
                  <p className="font-medium text-gray-900">{appointment.notes}</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Línea de tiempo */}
        <div className="border-t border-gray-100 bg-gray-50 px-6 py-4">
          <h3 className="text-sm font-medium text-gray-700 mb-2">Información de la cita</h3>
          <div className="space-y-1 text-xs text-gray-500">
            <p>Creada el {formatDateToSpanish(appointment.createdAt.split('T')[0])} a las {formatTimeToAMPM(appointment.createdAt.split('T')[1].substring(0,5))}</p>
            {appointment.status === 'cancelled' && (
              <p className="text-red-600">Cancelada</p>
            )}
            {appointment.status === 'completed' && (
              <p className="text-green-600">Completada</p>
            )}
          </div>
        </div>

        {/* Acciones */}
        {appointment.status === 'pending' && (
          <div className="border-t border-gray-100 px-6 py-4">
            <button
              onClick={handleCancel}
              disabled={updating}
              className="flex items-center justify-center gap-2 w-full bg-red-600 text-white py-3 px-4 rounded-lg hover:bg-red-700 transition font-medium disabled:opacity-50"
            >
              <XCircle className="h-5 w-5" />
              {updating ? 'Cancelando...' : 'Cancelar cita'}
            </button>
            <p className="text-xs text-gray-500 text-center mt-2">
              Puedes cancelar hasta 2 horas antes de la cita
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
