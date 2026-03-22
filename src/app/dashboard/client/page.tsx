"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Calendar, Scissors } from "lucide-react";
import { useAuthStore } from "../../../storage/auth.store";
import { serviceRepository } from "../../../core/repositories/service.repository";
import type { Service } from "../../../core/types/service";

export default function ClientDashboard() {
  const user = useAuthStore((state) => state.user);
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadServices = async () => {
      try {
        console.log("🔵 Cargando servicios para cliente...");

        // 👇 ID fijo del negocio (el que usaste en Postman)
        const BUSINESS_ID = "7d3449ff-ff43-48a6-b37c-36d91735d4d5";

        const data = await serviceRepository.findByBusinessId(BUSINESS_ID);
        console.log("🟢 Servicios recibidos:", data);

        setServices(data);
      } catch (error) {
        console.error("🔴 Error loading services:", error);
      } finally {
        setLoading(false);
      }
    };

    loadServices();
  }, []);

  return (
    <div className="space-y-8">
      {/* Header con bienvenida y botón de mis citas */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            ¡Hola, {user?.name}!
          </h1>
          <p className="text-gray-600 mt-1">
            ¿Qué servicio te gustaría reservar hoy?
          </p>
        </div>

        {/* Botón de Mis Citas */}
        <Link
          href="/dashboard/client/appointments"
          className="group flex items-center gap-3 px-6 py-3 bg-linear-to-r from-teal-600 to-blue-600 text-white rounded-xl shadow-md hover:shadow-lg transition-all duration-200 hover:scale-105"
        >
          <Calendar className="h-5 w-5" />
          <span className="font-medium">Mis Citas</span>
          <span className="text-sm bg-white/20 px-2 py-0.5 rounded-full">
            Ver historial
          </span>
        </Link>
      </div>

      {/* Sección de servicios disponibles */}
      <div>
        <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
          <Scissors className="h-5 w-5 text-teal-600" />
          Servicios disponibles
        </h2>

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
          </div>
        ) : services.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-xl shadow-sm">
            <Scissors className="h-12 w-12 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-500">No hay servicios disponibles por el momento</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service) => (
              <Link
                key={service.id}
                href={`/dashboard/client/book?serviceId=${service.id}`}
                className="group block"
              >
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:border-teal-200 hover:shadow-md transition-all duration-200">
                  <h3 className="text-lg font-semibold text-gray-800 mb-2 group-hover:text-teal-600 transition-colors">
                    {service.name}
                  </h3>
                  <p className="text-gray-600 text-sm mb-4">
                    {service.description}
                  </p>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500 flex items-center gap-1">
                      <span>⏱️</span> {service.duration} min
                    </span>
                    <span className="text-lg font-bold text-teal-600">
                      ${service.price.toLocaleString()}
                    </span>
                  </div>
                  <div className="mt-4 flex justify-end">
                    <span className="text-sm text-teal-600 group-hover:translate-x-1 transition-transform">
                      Reservar →
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
