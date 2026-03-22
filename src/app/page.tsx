'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Scissors, Calendar, Clock, Users, ArrowRight } from 'lucide-react';
import { serviceRepository } from '../core/repositories/service.repository';
import type { Service } from '../core/types/service';

// ID fijo del negocio de ejemplo
const BUSINESS_ID = "7d3449ff-ff43-48a6-b37c-36d91735d4d5";

export default function HomePage() {
  const router = useRouter();
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const loadServices = async () => {
      try {
        const data = await serviceRepository.findPublicByBusinessId(BUSINESS_ID);
        setServices(data);
      } catch (error) {
        console.error('Error loading services:', error);
      } finally {
        setLoading(false);
      }
    };
    loadServices();
  }, []);

  const handleServiceClick = (service: Service) => {
    setSelectedService(service);
    setShowModal(true);
  };

  const handleBook = () => {
    // Guardar la intención de reserva en localStorage
    if (selectedService) {
      localStorage.setItem('pendingBooking', JSON.stringify({
        serviceId: selectedService.id,
        serviceName: selectedService.name,
        timestamp: Date.now()
      }));
    }
    router.push('/register');
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-teal-50 to-blue-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-teal-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Scissors className="h-6 w-6 text-teal-600" />
              <span className="text-xl font-bold text-gray-800">miTurno</span>
            </div>
            <div className="flex gap-4">
              <Link
                href="/login"
                className="px-4 py-2 text-gray-600 hover:text-gray-900 transition"
              >
                Iniciar sesión
              </Link>
              <Link
                href="/register"
                className="px-4 py-2 bg-linear-to-r from-teal-600 to-blue-600 text-white rounded-lg hover:shadow-md transition"
              >
                Registrarse
              </Link>
            </div>
          </div>
        </div>
      </header>

      <main>
        {/* Hero Section */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Tu barbería, <br />
              <span className="text-transparent bg-clip-text bg-linear-to-r from-teal-600 to-blue-600">
                siempre a tu alcance
              </span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Reserva tus citas de manera fácil y rápida. Gestiona tu negocio 
              y ofrece la mejor experiencia a tus clientes.
            </p>
            <div className="flex gap-4 justify-center">
              <Link
                href="/register"
                className="px-8 py-3 bg-linear-to-r from-teal-600 to-blue-600 text-white rounded-lg hover:shadow-lg transition transform hover:scale-105"
              >
                Comenzar ahora
              </Link>
              <Link
                href="/login"
                className="px-8 py-3 bg-white text-gray-700 rounded-lg border border-gray-200 hover:border-teal-300 hover:shadow-md transition"
              >
                Iniciar sesión
              </Link>
            </div>
          </div>

          {/* Servicios destacados - CLICKEABLES */}
          <div className="mt-24">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-bold text-gray-800">
                Nuestros servicios
              </h2>
              <span className="text-sm text-gray-500 flex items-center gap-1">
                Haz clic para reservar <ArrowRight className="h-4 w-4" />
              </span>
            </div>

            {loading ? (
              <div className="flex justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600" />
              </div>
            ) : services.length === 0 ? (
              <p className="text-center text-gray-500 py-12">
                Próximamente más servicios
              </p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {services.map((service) => (
                  <button
                    key={service.id}
                    onClick={() => handleServiceClick(service)}
                    className="group text-left w-full transition-transform hover:scale-105"
                  >
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:border-teal-300 hover:shadow-lg transition-all duration-200 cursor-pointer">
                      <h3 className="text-lg font-semibold text-gray-800 mb-2 group-hover:text-teal-600 transition-colors">
                        {service.name}
                      </h3>
                      <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                        {service.description}
                      </p>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-500 flex items-center gap-1">
                          <Clock className="h-4 w-4" /> {service.duration} min
                        </span>
                        <span className="text-lg font-bold text-teal-600">
                          ${service.price.toLocaleString()}
                        </span>
                      </div>
                      <div className="mt-4 text-right">
                        <span className="text-sm text-teal-600 group-hover:translate-x-1 transition-transform inline-flex items-center gap-1">
                          Reservar <ArrowRight className="h-3 w-3" />
                        </span>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Features */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-24">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <div className="bg-teal-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                <Calendar className="h-6 w-6 text-teal-600" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Reserva fácil</h3>
              <p className="text-gray-600">
                Elige servicio, fecha y hora en pocos clics. Recibe confirmación inmediata.
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <div className="bg-blue-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Para negocios</h3>
              <p className="text-gray-600">
                Gestiona servicios, horarios y citas. Todo en un solo lugar.
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <div className="bg-teal-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                <Clock className="h-6 w-6 text-teal-600" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Recordatorios</h3>
              <p className="text-gray-600">
                Recibe notificaciones y nunca olvides tu cita.
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Modal de confirmación */}
      {showModal && selectedService && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl">
            <div className="text-center mb-6">
              <div className="bg-teal-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Scissors className="h-8 w-8 text-teal-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">
                {selectedService.name}
              </h3>
              <p className="text-gray-600 text-sm mb-4">
                {selectedService.description}
              </p>
              <div className="flex justify-center gap-4 text-sm text-gray-500 mb-6">
                <span className="flex items-center gap-1">⏱️ {selectedService.duration} min</span>
                <span className="flex items-center gap-1">💰 ${selectedService.price.toLocaleString()}</span>
              </div>
            </div>

            <div className="bg-blue-50 p-4 rounded-lg mb-6">
              <p className="text-sm text-blue-800 text-center">
                Para reservar este servicio necesitas una cuenta.
              </p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition"
              >
                Cancelar
              </button>
              <button
                onClick={handleBook}
                className="flex-1 px-4 py-2 bg-linear-to-r from-teal-600 to-blue-600 text-white rounded-lg hover:shadow-md transition"
              >
                Registrarse
              </button>
            </div>
          </div>
        </div>
      )}

      <footer className="border-t border-teal-100 bg-white/50 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <p className="text-center text-gray-500">
            © {new Date().getFullYear()} miTurno. Todos los derechos reservados.
          </p>
        </div>
      </footer>
    </div>
  );
}
