"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation"; 
import Link from "next/link";
import { appointmentRepository } from "../../../../../core/repositories/appointment.repository";
import { updateAppointmentStatusUseCase } from "../../../../../core/usecases/update-appointment-status.usecase";
import type {
  Appointment,
  AppointmentStatus,
} from "../../../../../core/types/appointment";
import {
  formatDateToSpanish,
  formatTimeToAMPM,
} from "../../../../../shared/utils/date-utils";
import {
  ArrowLeft,
  Calendar,
  Clock,
  User,
  Phone,
  Tag,
  DollarSign,
} from "lucide-react";
import { toast } from "sonner";

export default function BusinessAppointmentDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const [appointment, setAppointment] = useState<Appointment | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadAppointment = async () => {
      try {
        setLoading(true);
        const data = await appointmentRepository.findById(id);
        setAppointment(data);
      } catch (err) {
        setError("Error al cargar la cita");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      loadAppointment();
    }
  }, [id]);

  const handleStatusUpdate = async (
    newStatus: AppointmentStatus,
    businessNotes?: string,
  ) => {
    if (!appointment) return;

    setUpdating(true);
    try {
      const updated = await updateAppointmentStatusUseCase.execute(
        appointment.id,
        newStatus,
        businessNotes,
      );
      setAppointment(updated);
      toast.success(
        `Cita ${
          newStatus === "confirmed"
            ? "confirmada"
            : newStatus === "cancelled"
              ? "cancelada"
              : "completada"
        } correctamente`,
      );
    } catch (error) {
      toast.error("Error al actualizar la cita");
      console.error(error);
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-100">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
      </div>
    );
  }

  if (error || !appointment) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600">{error || "Cita no encontrada"}</p>
        <Link
          href="/dashboard/business/appointments"
          className="text-blue-600 hover:underline mt-4 block"
        >
          Volver a citas
        </Link>
      </div>
    );
  }

  const statusColors = {
    pending: "bg-yellow-100 text-yellow-800 border-yellow-200",
    confirmed: "bg-green-100 text-green-800 border-green-200",
    cancelled: "bg-red-100 text-red-800 border-red-200",
    completed: "bg-blue-100 text-blue-800 border-blue-200",
  };

  const statusText = {
    pending: "Pendiente",
    confirmed: "Confirmada",
    cancelled: "Cancelada",
    completed: "Completada",
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-6 flex items-center justify-between">
        <Link
          href="/dashboard/business/appointments"
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft className="h-4 w-4" />
          Volver a citas
        </Link>
        <span
          className={`px-4 py-2 rounded-full text-sm font-medium border ${statusColors[appointment.status]}`}
        >
          {statusText[appointment.status]}
        </span>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="bg-linear-to-r from-blue-50 to-indigo-50 px-6 py-4 border-b border-gray-100">
          <h1 className="text-2xl font-bold text-gray-900">
            Cita de {appointment.clientName}
          </h1>
        </div>

        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <Calendar className="h-5 w-5 text-gray-400 mt-0.5" />
              <div>
                <p className="text-sm text-gray-500">Fecha</p>
                <p className="font-medium text-gray-900">
                  {formatDateToSpanish(appointment.date)}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Clock className="h-5 w-5 text-gray-400 mt-0.5" />
              <div>
                <p className="text-sm text-gray-500">Hora</p>
                <p className="font-medium text-gray-900">
                  {formatTimeToAMPM(appointment.startTime)}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <User className="h-5 w-5 text-gray-400 mt-0.5" />
              <div>
                <p className="text-sm text-gray-500">Cliente</p>
                <p className="font-medium text-gray-900">
                  {appointment.clientName}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Phone className="h-5 w-5 text-gray-400 mt-0.5" />
              <div>
                <p className="text-sm text-gray-500">Teléfono</p>
                <p className="font-medium text-gray-900">
                  {appointment.clientPhone || "No registrado"}
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <Tag className="h-5 w-5 text-gray-400 mt-0.5" />
              <div>
                <p className="text-sm text-gray-500">Servicio</p>
                <p className="font-medium text-gray-900">
                  {appointment.serviceName}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Clock className="h-5 w-5 text-gray-400 mt-0.5" />
              <div>
                <p className="text-sm text-gray-500">Duración</p>
                <p className="font-medium text-gray-900">
                  {appointment.serviceDuration} minutos
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <DollarSign className="h-5 w-5 text-gray-400 mt-0.5" />
              <div>
                <p className="text-sm text-gray-500">Precio</p>
                <p className="font-medium text-gray-900">
                  ${appointment.servicePrice.toLocaleString()}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Acciones */}
        <div className="border-t border-gray-100 px-6 py-4 flex gap-3">
          {appointment.status === "pending" && (
            <>
              <button
                onClick={() => handleStatusUpdate("confirmed")}
                disabled={updating}
                className="flex-1 bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition font-medium disabled:opacity-50"
              >
                {updating ? "Actualizando..." : "Confirmar cita"}
              </button>
              <button
                onClick={() => handleStatusUpdate("cancelled")}
                disabled={updating}
                className="flex-1 bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition font-medium disabled:opacity-50"
              >
                {updating ? "Actualizando..." : "Cancelar cita"}
              </button>
            </>
          )}
          {appointment.status === "confirmed" && (
            <>
              <button
                onClick={() => handleStatusUpdate("completed")}
                disabled={updating}
                className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition font-medium disabled:opacity-50"
              >
                {updating ? "Actualizando..." : "Marcar como completada"}
              </button>
              <button
                onClick={() => handleStatusUpdate("cancelled")}
                disabled={updating}
                className="flex-1 bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition font-medium disabled:opacity-50"
              >
                {updating ? "Actualizando..." : "Cancelar cita"}
              </button>
            </>
          )}
          {appointment.status === "completed" && (
            <div className="w-full text-center text-gray-500 py-2">
              Cita completada
            </div>
          )}
          {appointment.status === "cancelled" && (
            <div className="w-full text-center text-gray-500 py-2">
              Cita cancelada
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
