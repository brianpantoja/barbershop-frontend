"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, Scissors, Clock, DollarSign } from "lucide-react";
import { serviceRepository } from "../../../../core/repositories/service.repository";
import type { Service } from "../../../../core/types/service";
import { toast } from "sonner";

export default function ServicesPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    duration: 30,
    price: 0,
  });

  useEffect(() => {
    loadServices();
  }, []);

  const loadServices = async () => {
    try {
      const data = await serviceRepository.findAll();
      setServices(data);
    } catch {
      toast.error("Error al cargar los servicios");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingService) {
        await serviceRepository.update(editingService.id, formData);
        toast.success("Servicio actualizado");
      } else {
        await serviceRepository.create(formData);
        toast.success("Servicio creado");
      }
      setShowForm(false);
      setEditingService(null);
      setFormData({ name: "", description: "", duration: 30, price: 0 });
      loadServices();
    } catch {
      toast.error("Error al guardar el servicio");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("¿Estás seguro de eliminar este servicio?")) return;
    try {
      await serviceRepository.delete(id);
      toast.success("Servicio eliminado");
      loadServices();
    } catch {
      toast.error("Error al eliminar el servicio");
    }
  };

  if (loading) {
    return <div className="text-center py-12">Cargando servicios...</div>;
  }

  return (
    <div>
      {/* Header con título y botones */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Servicios</h1>
        <div className="flex items-center gap-4">
          <button
            onClick={() => {
              setEditingService(null);
              setFormData({ name: "", description: "", duration: 30, price: 0 });
              setShowForm(true);
            }}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            + Nuevo servicio
          </button>
          <Link
            href="/dashboard/business"
            className="group flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-900 bg-gray-100 hover:bg-gray-200 rounded-lg transition-all duration-200 cursor-pointer"
            title="Volver al dashboard"
          >
            <ArrowLeft className="h-5 w-5 transition-transform group-hover:-translate-x-1" />
            <span>Volver</span>
          </Link>
        </div>
      </div>

      {/* Formulario de creación/edición */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h2 className="text-xl font-bold mb-4">
              {editingService ? "Editar" : "Nuevo"} servicio
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Nombre</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Descripción
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                  rows={3}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Duración (minutos)
                </label>
                <input
                  type="number"
                  value={formData.duration === 30 ? "" : formData.duration}
                  onChange={(e) => {
                    const value = e.target.value;
                    setFormData({
                      ...formData,
                      duration: value === "" ? 30 : parseInt(value) || 30,
                    });
                  }}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                  min="5"
                  step="5"
                  placeholder="30"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Precio</label>
                <input
                  type="number"
                  value={formData.price === 0 ? "" : formData.price}
                  onChange={(e) => {
                    const value = e.target.value;
                    setFormData({
                      ...formData,
                      price: value === "" ? 0 : parseInt(value) || 0,
                    });
                  }}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                  min="0"
                  placeholder="Ingresa el precio"
                  required
                />
              </div>
              <div className="flex gap-2 justify-end">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="px-4 py-2 border rounded-lg hover:bg-gray-50 transition"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                >
                  {editingService ? "Actualizar" : "Crear"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Lista de servicios */}
      {services.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow-sm">
          <Scissors className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500 mb-4">No hay servicios creados</p>
          <button
            onClick={() => {
              setEditingService(null);
              setFormData({ name: "", description: "", duration: 30, price: 0 });
              setShowForm(true);
            }}
            className="text-blue-600 hover:text-blue-800 font-medium"
          >
            + Crear primer servicio
          </button>
        </div>
      ) : (
        <div className="grid gap-4">
          {services.map((service) => (
            <div
              key={service.id}
              className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-all duration-200 border border-gray-100 hover:border-blue-200"
            >
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">
                    {service.name}
                  </h3>
                  <p className="text-sm text-gray-600 mb-4">
                    {service.description}
                  </p>
                  <div className="flex gap-6 text-sm">
                    <span className="flex items-center gap-1 text-gray-500">
                      <Clock className="h-4 w-4" />
                      {service.duration} min
                    </span>
                    <span className="flex items-center gap-1 text-gray-500">
                      <DollarSign className="h-4 w-4" />
                      ${service.price.toLocaleString()}
                    </span>
                  </div>
                </div>
                <div className="flex gap-3 ml-4">
                  <button
                    onClick={() => {
                      setEditingService(service);
                      setFormData({
                        name: service.name,
                        description: service.description,
                        duration: service.duration,
                        price: service.price,
                      });
                      setShowForm(true);
                    }}
                    className="px-3 py-1 text-sm text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-md transition"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => handleDelete(service.id)}
                    className="px-3 py-1 text-sm text-red-600 hover:text-red-800 hover:bg-red-50 rounded-md transition"
                  >
                    Eliminar
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
