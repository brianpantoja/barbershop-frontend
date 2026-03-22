"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useAuthStore } from "../../../storage/auth.store";
import { appointmentRepository } from "../../../core/repositories/appointment.repository";
import type { Appointment } from "../../../core/types/appointment";
import { format } from "date-fns";
import { es } from "date-fns/locale"; // 👈 IMPORTANTE: agregar esta importación
import {
  formatTimeToAMPM,
  formatDateToSpanish,
} from "../../../shared/utils/date-utils";
import {
  Calendar,
  Clock,
  Scissors,
  CheckCircle,
  XCircle,
  ArrowRight,
  BarChart3,
  CalendarDays,
} from "lucide-react";

export default function BusinessDashboard() {
  const user = useAuthStore((state) => state.user);
  const [allAppointments, setAllAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadAllAppointments = async () => {
      try {
        console.log("🔵 Cargando todas las citas del negocio...");
        const data = await appointmentRepository.findByBusiness();
        console.log("🟢 Citas cargadas:", data);
        setAllAppointments(data);
      } catch (error) {
        console.error("Error loading appointments:", error);
      } finally {
        setLoading(false);
      }
    };

    loadAllAppointments();
  }, []);

  const today = format(new Date(), "yyyy-MM-dd");
  const currentTime = format(new Date(), "HH:mm");

  const activeAppointments = allAppointments.filter((apt) => {
    if (apt.status !== "pending" && apt.status !== "confirmed") return false;

    // Si es fecha pasada, excluir
    if (apt.date < today) return false;

    // Si es hoy, verificar hora
    if (apt.date === today) {
      return apt.startTime > currentTime;
    }

    // Si es fecha futura, incluir
    return true;
  });

  // Ordenar por fecha y hora
  const sortedAppointments = [...activeAppointments].sort((a, b) => {
    if (a.date !== b.date) return a.date.localeCompare(b.date);
    return a.startTime.localeCompare(b.startTime);
  });

  // Agrupar por fecha
  const appointmentsByDate = sortedAppointments.reduce(
    (acc, apt) => {
      const date = apt.date;
      if (!acc[date]) {
        acc[date] = [];
      }
      acc[date].push(apt);
      return acc;
    },
    {} as Record<string, Appointment[]>,
  );

  const sortedDates = Object.keys(appointmentsByDate).sort();

  // Estadísticas
  const pendingCount = allAppointments.filter(
    (a) =>
      a.status === "pending" &&
      (a.date > today || (a.date === today && a.startTime > currentTime)),
  ).length;

  const confirmedCount = allAppointments.filter(
    (a) =>
      a.status === "confirmed" &&
      (a.date > today || (a.date === today && a.startTime > currentTime)),
  ).length;

  const completedCount = allAppointments.filter(
    (a) => a.status === "completed",
  ).length;
  const cancelledCount = allAppointments.filter(
    (a) => a.status === "cancelled",
  ).length;
  const totalCount = allAppointments.length;

  // Citas de hoy
  const todayAppointments = allAppointments.filter(
    (apt) =>
      apt.date === today &&
      (apt.status === "pending" || apt.status === "confirmed"),
  ).length;

  return (
    <div className="space-y-8">
      {/* Header con bienvenida y fecha */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            ¡Hola, {user?.businessName || user?.name}!
          </h1>
          <p className="text-gray-600 mt-1">
            {format(new Date(), "EEEE, d 'de' MMMM 'de' yyyy", { locale: es })}
          </p>
        </div>

        {/* Tarjeta de resumen rápido */}
        <div className="bg-blue-600 text-white px-6 py-4 rounded-xl shadow-sm">
          <p className="text-sm opacity-90">Citas para hoy</p>
          <p className="text-3xl font-bold">{todayAppointments}</p>
        </div>
      </div>

      {/* Tarjetas de estadísticas clickeables */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        <Link href="/dashboard/business/appointments" className="block group">
          <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all hover:border-blue-200 cursor-pointer">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-blue-100 rounded-lg group-hover:bg-blue-200 transition-colors">
                <BarChart3 className="h-5 w-5 text-blue-600" />
              </div>
              <p className="text-sm text-gray-500">Total</p>
            </div>
            <p className="text-2xl font-bold text-gray-900">{totalCount}</p>
          </div>
        </Link>

        <Link
          href="/dashboard/business/appointments?status=pending"
          className="block group"
        >
          <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all hover:border-yellow-200 cursor-pointer">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-yellow-100 rounded-lg group-hover:bg-yellow-200 transition-colors">
                <Clock className="h-5 w-5 text-yellow-600" />
              </div>
              <p className="text-sm text-gray-500">Pendientes</p>
            </div>
            <p className="text-2xl font-bold text-yellow-600">{pendingCount}</p>
          </div>
        </Link>

        <Link
          href="/dashboard/business/appointments?status=confirmed"
          className="block group"
        >
          <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all hover:border-green-200 cursor-pointer">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-green-100 rounded-lg group-hover:bg-green-200 transition-colors">
                <CheckCircle className="h-5 w-5 text-green-600" />
              </div>
              <p className="text-sm text-gray-500">Confirmadas</p>
            </div>
            <p className="text-2xl font-bold text-green-600">
              {confirmedCount}
            </p>
          </div>
        </Link>

        <Link
          href="/dashboard/business/appointments?status=completed"
          className="block group"
        >
          <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all hover:border-blue-200 cursor-pointer">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-blue-100 rounded-lg group-hover:bg-blue-200 transition-colors">
                <Calendar className="h-5 w-5 text-blue-600" />
              </div>
              <p className="text-sm text-gray-500">Completadas</p>
            </div>
            <p className="text-2xl font-bold text-blue-600">{completedCount}</p>
          </div>
        </Link>

        <Link
          href="/dashboard/business/appointments?status=cancelled"
          className="block group"
        >
          <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all hover:border-red-200 cursor-pointer">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-red-100 rounded-lg group-hover:bg-red-200 transition-colors">
                <XCircle className="h-5 w-5 text-red-600" />
              </div>
              <p className="text-sm text-gray-500">Canceladas</p>
            </div>
            <p className="text-2xl font-bold text-red-600">{cancelledCount}</p>
          </div>
        </Link>
      </div>

      {/* Grid de navegación mejorado */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link href="/dashboard/business/services" className="group">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:border-blue-200 hover:shadow-md transition-all duration-200">
            <div className="flex items-center gap-4 mb-3">
              <div className="p-3 bg-blue-50 rounded-lg group-hover:bg-blue-100 transition-colors">
                <Scissors className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-800">
                  Servicios
                </h2>
                <p className="text-sm text-gray-500">Gestionar servicios</p>
              </div>
            </div>
            <div className="flex justify-end">
              <span className="flex items-center gap-1 text-sm text-blue-600 group-hover:gap-2 transition-all">
                Ver más <ArrowRight className="h-4 w-4" />
              </span>
            </div>
          </div>
        </Link>

        <Link href="/dashboard/business/hours" className="group">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:border-blue-200 hover:shadow-md transition-all duration-200">
            <div className="flex items-center gap-4 mb-3">
              <div className="p-3 bg-blue-50 rounded-lg group-hover:bg-blue-100 transition-colors">
                <CalendarDays className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-800">
                  Horarios
                </h2>
                <p className="text-sm text-gray-500">Configurar atención</p>
              </div>
            </div>
            <div className="flex justify-end">
              <span className="flex items-center gap-1 text-sm text-blue-600 group-hover:gap-2 transition-all">
                Ver más <ArrowRight className="h-4 w-4" />
              </span>
            </div>
          </div>
        </Link>

        <Link href="/dashboard/business/appointments" className="group">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:border-blue-200 hover:shadow-md transition-all duration-200">
            <div className="flex items-center gap-4 mb-3">
              <div className="p-3 bg-blue-50 rounded-lg group-hover:bg-blue-100 transition-colors">
                <Calendar className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-800">Citas</h2>
                <p className="text-sm text-gray-500">Ver todas las citas</p>
              </div>
            </div>
            <div className="flex justify-end">
              <span className="flex items-center gap-1 text-sm text-blue-600 group-hover:gap-2 transition-all">
                Ver más <ArrowRight className="h-4 w-4" />
              </span>
            </div>
          </div>
        </Link>
      </div>

      {/* Próximas citas activas */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-800">
            Próximas citas activas
          </h2>
          {activeAppointments.length > 0 && (
            <Link
              href="/dashboard/business/appointments"
              className="text-sm text-blue-600 hover:text-blue-800 flex items-center gap-1"
            >
              Ver todas <ArrowRight className="h-4 w-4" />
            </Link>
          )}
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
          </div>
        ) : activeAppointments.length === 0 ? (
          <div className="text-center py-12">
            <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-500">No hay citas activas programadas</p>
          </div>
        ) : (
          <div className="space-y-6">
            {sortedDates.slice(0, 3).map((date) => (
              <div key={date}>
                <h3 className="font-medium text-gray-700 mb-3 flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-gray-400" />
                  {formatDateToSpanish(date)}
                </h3>
                <div className="space-y-3">
                  {appointmentsByDate[date].map((appointment) => (
                    <Link
                      key={appointment.id}
                      href={`/dashboard/business/appointments/${appointment.id}`}
                      className="block group"
                    >
                      <div className="bg-gray-50 p-4 rounded-lg hover:bg-gray-100 transition-colors">
                        <div className="flex justify-between items-center">
                          <div>
                            <p className="font-medium text-gray-900 group-hover:text-blue-600 transition-colors">
                              {appointment.clientName}
                            </p>
                            <p className="text-sm text-gray-600">
                              {appointment.serviceName} ·{" "}
                              {formatTimeToAMPM(appointment.startTime)}
                            </p>
                          </div>
                          <span
                            className={`px-3 py-1 rounded-full text-sm ${
                              appointment.status === "pending"
                                ? "bg-yellow-100 text-yellow-800"
                                : "bg-green-100 text-green-800"
                            }`}
                          >
                            {appointment.status === "pending"
                              ? "Pendiente"
                              : "Confirmada"}
                          </span>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
