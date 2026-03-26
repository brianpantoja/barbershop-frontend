'use client';

import { useState, useEffect } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { ArrowLeft } from 'lucide-react';
import { appointmentRepository } from "../../../../core/repositories/appointment.repository";
import type { Appointment } from "../../../../core/types/appointment";
import { format } from "date-fns";
import { formatDateToSpanish, formatTimeToAMPM } from "../../../../shared/utils/date-utils";

export default function BusinessAppointmentsPage() {
  const searchParams = useSearchParams();
  const statusParam = searchParams.get('status');
  
  const [allAppointments, setAllAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<
    "active" | "pending" | "confirmed" | "completed" | "cancelled"
  >(() => {
    if (statusParam === 'pending' || statusParam === 'confirmed' || 
        statusParam === 'completed' || statusParam === 'cancelled') {
      return statusParam;
    }
    return "active";
  });
  const [selectedDate, setSelectedDate] = useState(
    format(new Date(), "yyyy-MM-dd"),
  );
  const [showAllDates, setShowAllDates] = useState(!!statusParam); // 👈 Si viene statusParam, mostrar todas las fechas

  // Cargar TODAS las citas al inicio
  useEffect(() => {
    const loadAllAppointments = async () => {
      setLoading(true);
      try {
        console.log("🔵 Cargando TODAS las citas...");
        const data = await appointmentRepository.findByBusiness();
        console.log("🟢 Todas las citas:", data);
        setAllAppointments(data);
      } catch (error) {
        console.error("Error loading appointments:", error);
      } finally {
        setLoading(false);
      }
    };

    loadAllAppointments();
  }, []);
 
  const appointmentsToShow = showAllDates 
    ? allAppointments // Todas las citas 
    : allAppointments.filter(apt => apt.date === selectedDate); // Solo la fecha seleccionada

  // Aplicar filtro de estado
  const filteredAppointments = appointmentsToShow.filter((apt) => {
    if (filter === "active") {
      return apt.status === "pending" || apt.status === "confirmed";
    }
    return apt.status === filter;
  });

  // Ordenar por fecha más reciente primero para historial
  const sortedAppointments = [...filteredAppointments].sort((a, b) => {
    return b.date.localeCompare(a.date) || b.startTime.localeCompare(a.startTime);
  });

  // Agrupar por fecha para mostrar
  const appointmentsByDate = sortedAppointments.reduce((acc, apt) => {
    const date = apt.date;
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(apt);
    return acc;
  }, {} as Record<string, Appointment[]>);

  const sortedDates = Object.keys(appointmentsByDate).sort().reverse(); // Más reciente primero

  const statusColors = {
    pending: "bg-yellow-100 text-yellow-800",
    confirmed: "bg-green-100 text-green-800",
    cancelled: "bg-red-100 text-red-800",
    completed: "bg-blue-100 text-blue-800",
  };

  const statusText = {
    pending: "Pendiente",
    confirmed: "Confirmada",
    cancelled: "Cancelada",
    completed: "Completada",
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Citas</h1>
        <Link
          href="/dashboard/business"
          className="group flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-900 bg-gray-100 hover:bg-gray-200 rounded-lg transition-all duration-200 cursor-pointer"
          title="Volver al dashboard"
        >
          <ArrowLeft className="h-5 w-5 transition-transform group-hover:-translate-x-1" />
          <span>Volver</span>
        </Link>
      </div>

      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="flex items-center gap-4">
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            disabled={showAllDates}
            className={`px-4 py-2 border rounded-lg ${
              showAllDates ? 'bg-gray-100 text-gray-500' : ''
            }`}
          />
          
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={showAllDates}
              onChange={(e) => setShowAllDates(e.target.checked)}
              className="rounded text-blue-600"
            />
            <span className="text-sm text-gray-700">Todas las fechas</span>
          </label>
        </div>

        <div className="flex gap-2 flex-wrap">
          {(
            [
              "active",
              "pending",
              "confirmed",
              "completed",
              "cancelled",
            ] as const
          ).map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-4 py-2 rounded-lg transition ${
                filter === status
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 hover:bg-gray-200"
              }`}
            >
              {status === "active"
                ? "Activas"
                : status === "pending"
                  ? "Pendientes"
                  : status === "confirmed"
                    ? "Confirmadas"
                    : status === "completed"
                      ? "Completadas"
                      : "Canceladas"}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
        </div>
      ) : filteredAppointments.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow-sm">
          <p className="text-gray-500">
            {showAllDates 
              ? `No hay citas ${filter === 'active' ? 'activas' : statusText[filter as keyof typeof statusText].toLowerCase()}`
              : "No hay citas para esta fecha"}
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {sortedDates.map((date) => (
            <div key={date}>
              <h3 className="font-medium text-gray-700 mb-3">
                {formatDateToSpanish(date)}
              </h3>
              <div className="space-y-4">
                {appointmentsByDate[date].map((appointment) => (
                  <Link
                    key={appointment.id}
                    href={`/dashboard/business/appointments/${appointment.id}`}
                    className="block"
                  >
                    <div className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="text-lg font-semibold">
                            {appointment.clientName}
                          </h3>
                          <p className="text-sm text-gray-600">
                            {appointment.serviceName}
                          </p>
                        </div>
                        <span
                          className={`px-3 py-1 rounded-full text-sm ${statusColors[appointment.status]}`}
                        >
                          {statusText[appointment.status]}
                        </span>
                      </div>

                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="text-gray-500">Hora</p>
                          <p className="font-medium">
                            {formatTimeToAMPM(appointment.startTime)}
                          </p>
                        </div>
                        <div>
                          <p className="text-gray-500">Teléfono</p>
                          <p className="font-medium">
                            {appointment.clientPhone || "No registrado"}
                          </p>
                        </div>
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
  );
}
