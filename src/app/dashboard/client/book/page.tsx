"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useAuthStore } from "../../../../storage/auth.store";
import { serviceRepository } from "../../../../core/repositories/service.repository";
import { appointmentRepository } from "../../../../core/repositories/appointment.repository";
import type { Service } from "../../../../core/types/service";
import { format, addDays } from "date-fns";
import { es } from "date-fns/locale";
import { toast } from "sonner";
import Link from "next/link";
import {
  formatTimeToAMPM,
  formatDateToSpanish,
} from "../../../../shared/utils/date-utils";

// ID fijo del negocio (el mismo que usamos para servicios)
const BUSINESS_ID = "7d3449ff-ff43-48a6-b37c-36d91735d4d5";

export default function BookPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const serviceId = searchParams.get("serviceId");
  const user = useAuthStore((state) => state.user);

  const [service, setService] = useState<Service | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [availableSlots, setAvailableSlots] = useState<string[]>([]);
  const [selectedTime, setSelectedTime] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Cargar servicio
  useEffect(() => {
    if (serviceId) {
      serviceRepository.findById(serviceId).then(setService);
    }
  }, [serviceId]);

  // Cargar disponibilidad cuando cambia la fecha
  useEffect(() => {
    if (service && selectedDate) {
      const loadAvailability = async () => {
        setLoading(true);
        try {
          const slots = await appointmentRepository.getAvailableSlots(
            BUSINESS_ID,
            service.id,
            format(selectedDate, "yyyy-MM-dd"),
          );

          // Filtrar slots pasados si es hoy
          let availableSlots = slots.availableSlots || [];

          const today = format(new Date(), "yyyy-MM-dd");
          if (format(selectedDate, "yyyy-MM-dd") === today) {
            const now = new Date();
            const currentHour = now.getHours();
            const currentMinute = now.getMinutes();

            availableSlots = availableSlots.filter((slot) => {
              const [slotHour, slotMinute] = slot.split(":").map(Number);
              return (
                slotHour > currentHour ||
                (slotHour === currentHour && slotMinute > currentMinute)
              );
            });
          }

          setAvailableSlots(availableSlots);
          setSelectedTime("");
        } catch (error) {
          console.error("Error loading availability:", error);
          toast.error("Error al cargar disponibilidad");
        } finally {
          setLoading(false);
        }
      };
      loadAvailability();
    }
  }, [service, selectedDate]);

  const handleSubmit = async () => {
    if (!service || !selectedTime || !user) return;

    setSubmitting(true);
    try {
      // Crear fecha en formato local YYYY-MM-DD
      const year = selectedDate.getFullYear();
      const month = String(selectedDate.getMonth() + 1).padStart(2, "0");
      const day = String(selectedDate.getDate()).padStart(2, "0");
      const localDate = `${year}-${month}-${day}`;

      await appointmentRepository.create({
        serviceId: service.id,
        date: localDate, //  usar fecha local
        startTime: selectedTime,
        clientName: user.name,
        clientPhone: user.phone,
      });

      toast.success("¡Cita reservada con éxito!");
      router.push("/dashboard/client/appointments");
    } catch (error: unknown) {
      console.error("Error creating appointment:", error);

      // Tipo para el error de axios
      interface ApiError {
        response?: {
          data?: {
            message?: string;
          };
        };
        message?: string;
      }

      const apiError = error as ApiError;
      const errorMessage =
        apiError.response?.data?.message ||
        apiError.message ||
        "Error al reservar la cita";
      toast.error(errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  if (!service) {
    return (
      <div className="flex justify-center items-center min-h-100">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      {/* Breadcrumb */}
      <div className="mb-6">
        <Link
          href="/dashboard/client"
          className="text-blue-600 hover:underline"
        >
          ← Volver a servicios
        </Link>
      </div>

      <h1 className="text-2xl font-bold mb-2">Reservar cita</h1>
      <p className="text-gray-600 mb-6">
        Servicio seleccionado:{" "}
        <span className="font-semibold">{service.name}</span> (
        {service.duration} min)
      </p>

      {/* Selector de fecha */}
      <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
        <h2 className="text-lg font-semibold mb-4">1. Seleccionar fecha</h2>
        <div className="grid grid-cols-4 sm:grid-cols-7 gap-2">
          {[0, 1, 2, 3, 4, 5, 6].map((days) => {
            const date = addDays(new Date(), days);
            const dateStr = format(date, "yyyy-MM-dd");
            const selectedStr = format(selectedDate, "yyyy-MM-dd");
            const isSelected = dateStr === selectedStr;
            const isPast = date < new Date(new Date().setHours(0, 0, 0, 0));

            if (isPast) return null;

            return (
              <button
                key={days}
                onClick={() => setSelectedDate(date)}
                disabled={isPast}
                className={`p-3 rounded-lg border transition ${
                  isSelected
                    ? "bg-blue-600 text-white border-blue-600"
                    : isPast
                      ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                      : "hover:border-blue-600"
                }`}
              >
                <div className="text-xs">
                  {format(date, "EEE", { locale: es })}
                </div>
                <div className="font-bold">{format(date, "d")}</div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Selector de hora */}
      <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
        <h2 className="text-lg font-semibold mb-4">2. Seleccionar hora</h2>
        {loading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
          </div>
        ) : availableSlots.length === 0 ? (
          <p className="text-center text-gray-500 py-8">
            No hay horarios disponibles para esta fecha
          </p>
        ) : (
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2">
            {availableSlots.map((time) => (
              <button
                key={time}
                onClick={() => setSelectedTime(time)}
                className={`p-3 text-center border rounded-lg transition ${
                  selectedTime === time
                    ? "bg-blue-600 text-white border-blue-600"
                    : "hover:border-blue-600"
                }`}
              >
                {formatTimeToAMPM(time)}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Resumen y confirmación */}
      {selectedTime && (
        <div className="bg-blue-50 p-6 rounded-lg shadow-sm mb-6">
          <h2 className="text-lg font-semibold mb-4">3. Confirmar cita</h2>
          <div className="space-y-2 mb-4">
            <p>
              <span className="font-medium">Servicio:</span> {service.name}
            </p>
            <p>
              <span className="font-medium">Fecha:</span>{" "}
              {formatDateToSpanish(format(selectedDate, "yyyy-MM-dd"))}
            </p>
            <p>
              <span className="font-medium">Hora:</span>{" "}
              {formatTimeToAMPM(selectedTime)}
            </p>
            <p>
              <span className="font-medium">Duración:</span> {service.duration}{" "}
              minutos
            </p>
            <p>
              <span className="font-medium">Precio:</span> $
              {service.price.toLocaleString()}
            </p>
          </div>

          <button
            onClick={handleSubmit}
            disabled={submitting}
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {submitting ? "Reservando..." : "Confirmar reserva"}
          </button>
        </div>
      )}
    </div>
  );
}
