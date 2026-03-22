'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, Calendar, XCircle } from 'lucide-react';
import { appointmentRepository } from '../../../../core/repositories/appointment.repository';
import type { Appointment } from '../../../../core/types/appointment';
import { toast } from 'sonner';
import { formatDateToSpanish, formatTimeToAMPM } from '@/shared/utils/date-utils';

const statusColors = {
  pending: 'bg-yellow-100 text-yellow-800',
  confirmed: 'bg-green-100 text-green-800',
  cancelled: 'bg-red-100 text-red-800',
  completed: 'bg-gray-100 text-gray-800',
};

const statusText = {
  pending: 'Pendiente',
  confirmed: 'Confirmada',
  cancelled: 'Cancelada',
  completed: 'Completada',
};

export default function ClientAppointmentsPage() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'pending' | 'confirmed' | 'completed' | 'cancelled'>('all');

  useEffect(() => {
    const loadAppointments = async () => {
      try {
        const data = await appointmentRepository.findByClient();
        // Ordenar por fecha (más reciente primero)
        const sorted = data.sort((a, b) => b.date.localeCompare(a.date) || b.startTime.localeCompare(a.startTime));
        setAppointments(sorted);
      } catch {
        toast.error('Error al cargar las citas');
      } finally {
        setLoading(false);
      }
    };

    loadAppointments();
  }, []);

  const handleCancel = async (id: string) => {
    try {
      await appointmentRepository.updateStatus(id, { status: 'cancelled' });
      setAppointments(appointments.map(apt =>
        apt.id === id ? { ...apt, status: 'cancelled' } : apt
      ));
      toast.success('Cita cancelada');
    } catch {
      toast.error('Error al cancelar la cita');
    }
  };

  // Filtrar citas según el filtro seleccionado
  const filteredAppointments = appointments.filter(apt => {
    if (filter === 'all') return true;
    return apt.status === filter;
  });

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header con título y botón de volver */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Mis citas</h1>
        <Link
          href="/dashboard/client"
          className="group flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-900 bg-gray-100 hover:bg-gray-200 rounded-lg transition-all duration-200 cursor-pointer"
          title="Volver al dashboard"
        >
          <ArrowLeft className="h-5 w-5 transition-transform group-hover:-translate-x-1" />
          <span>Volver</span>
        </Link>
      </div>

      {/* Filtros de estado */}
      <div className="flex gap-2 flex-wrap">
        {(['all', 'pending', 'confirmed', 'completed', 'cancelled'] as const).map((status) => (
          <button
            key={status}
            onClick={() => setFilter(status)}
            className={`px-4 py-2 rounded-lg transition ${
              filter === status
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 hover:bg-gray-200'
            }`}
          >
            {status === 'all' ? 'Todas' : 
             status === 'pending' ? 'Pendientes' :
             status === 'confirmed' ? 'Confirmadas' :
             status === 'completed' ? 'Completadas' : 'Canceladas'}
          </button>
        ))}
      </div>

      {/* Lista de citas */}
      {filteredAppointments.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow-sm">
          <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-3" />
          <p className="text-gray-500">
            {filter === 'all' 
              ? 'No tienes citas programadas' 
              : `No tienes citas ${statusText[filter].toLowerCase()}`}
          </p>
          {filter !== 'all' && (
            <button
              onClick={() => setFilter('all')}
              className="mt-4 text-blue-600 hover:text-blue-800"
            >
              Ver todas las citas
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {filteredAppointments.map((appointment) => (
            <div
              key={appointment.id}
              className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:border-blue-200 transition-all"
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">
                    {appointment.serviceName}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {appointment.businessName}
                  </p>
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-sm ${statusColors[appointment.status]}`}
                >
                  {statusText[appointment.status]}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                <div>
                  <p className="text-gray-500">Fecha</p>
                  <p className="font-medium">
                    {formatDateToSpanish(appointment.date)}
                  </p>
                </div>
                <div>
                  <p className="text-gray-500">Hora</p>
                  <p className="font-medium">
                    {formatTimeToAMPM(appointment.startTime)}
                  </p>
                </div>
              </div>

              {appointment.status === "pending" && (
                <button
                  onClick={() => handleCancel(appointment.id)}
                  className="flex items-center gap-2 text-sm text-red-600 hover:text-red-800 transition-colors"
                >
                  <XCircle className="h-4 w-4" />
                  Cancelar cita
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
