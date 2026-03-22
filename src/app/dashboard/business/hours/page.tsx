'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { businessHoursRepository } from '../../../../core/repositories/business-hours.repository';
import type { BusinessHours, WeekDay } from '../../../../core/types/business-hours';
import { toast } from 'sonner';

const DAY_NAMES: Record<WeekDay, string> = {
  0: 'Domingo',
  1: 'Lunes',
  2: 'Martes',
  3: 'Miércoles',
  4: 'Jueves',
  5: 'Viernes',
  6: 'Sábado',
};

const ALL_DAYS: WeekDay[] = [1, 2, 3, 4, 5, 6, 0];

export default function HoursPage() {
  const [hours, setHours] = useState<BusinessHours[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingHour, setEditingHour] = useState<BusinessHours | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newHour, setNewHour] = useState({
    dayOfWeek: 1 as WeekDay,
    openTime: '09:00',
    closeTime: '18:00',
    isOpen: true,
  });

  useEffect(() => {
    loadHours();
  }, []);

  const loadHours = async () => {
    try {
      const data = await businessHoursRepository.findAll();
      setHours(data);
    } catch {
      toast.error('Error al cargar los horarios');
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async () => {
    try {
      const existing = hours.find(h => h.dayOfWeek === newHour.dayOfWeek);
      if (existing) {
        toast.error('Ya existe un horario para este día');
        return;
      }

      await businessHoursRepository.create(newHour);
      toast.success('Horario creado correctamente');
      setShowCreateForm(false);
      setNewHour({
        dayOfWeek: 1 as WeekDay,
        openTime: '09:00',
        closeTime: '18:00',
        isOpen: true,
      });
      loadHours();
    } catch {
      toast.error('Error al crear el horario');
    }
  };

  const handleToggle = async (hour: BusinessHours) => {
    try {
      await businessHoursRepository.update(hour.id, { isOpen: !hour.isOpen });
      toast.success(`Horario ${!hour.isOpen ? 'activado' : 'desactivado'}`);
      loadHours();
    } catch {
      toast.error('Error al actualizar horario');
    }
  };

  const handleUpdate = async (id: string, data: Partial<BusinessHours>) => {
    try {
      await businessHoursRepository.update(id, data);
      toast.success('Horario actualizado');
      setEditingHour(null);
      loadHours();
    } catch {
      toast.error('Error al actualizar horario');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('¿Estás seguro de eliminar este horario?')) return;
    try {
      await businessHoursRepository.delete(id);
      toast.success('Horario eliminado');
      loadHours();
    } catch {
      toast.error('Error al eliminar el horario');
    }
  };

  const existingDays = hours.map(h => h.dayOfWeek);
  const availableDays = ALL_DAYS.filter(day => !existingDays.includes(day));

  if (loading) {
    return <div className="text-center py-12">Cargando horarios...</div>;
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Horarios de atención</h1>
        <div className="flex items-center gap-4">
          {availableDays.length > 0 && (
            <button
              onClick={() => setShowCreateForm(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
            >
              + Agregar horario
            </button>
          )}
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

      {/* Formulario de creación */}
      {showCreateForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h2 className="text-xl font-bold mb-4">Nuevo horario</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Día</label>
                <select
                  value={newHour.dayOfWeek}
                  onChange={(e) => setNewHour({ ...newHour, dayOfWeek: parseInt(e.target.value) as WeekDay })}
                  className="w-full px-3 py-2 border rounded-lg"
                >
                  {availableDays.map((day) => (
                    <option key={day} value={day}>
                      {DAY_NAMES[day]}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Hora de apertura</label>
                <input
                  type="time"
                  value={newHour.openTime}
                  onChange={(e) => setNewHour({ ...newHour, openTime: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg"
                  step="900"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Hora de cierre</label>
                <input
                  type="time"
                  value={newHour.closeTime}
                  onChange={(e) => setNewHour({ ...newHour, closeTime: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg"
                  step="900"
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="isOpen"
                  checked={newHour.isOpen}
                  onChange={(e) => setNewHour({ ...newHour, isOpen: e.target.checked })}
                  className="rounded"
                />
                <label htmlFor="isOpen">Abierto</label>
              </div>

              <div className="flex gap-2 justify-end">
                <button
                  onClick={() => setShowCreateForm(false)}
                  className="px-4 py-2 border rounded-lg hover:bg-gray-50"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleCreate}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Crear horario
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {hours.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow-sm">
          <p className="text-gray-500 mb-4">No hay horarios configurados</p>
          {availableDays.length > 0 && (
            <button
              onClick={() => setShowCreateForm(true)}
              className="text-blue-600 hover:text-blue-800 font-medium"
            >
              + Crear primer horario
            </button>
          )}
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Día</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Horario</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Estado</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {hours.map((hour) => (
                <tr key={hour.id}>
                  <td className="px-6 py-4">
                    {DAY_NAMES[hour.dayOfWeek as WeekDay]}
                  </td>
                  <td className="px-6 py-4">
                    {editingHour?.id === hour.id ? (
                      <div className="flex gap-2">
                        <input
                          type="time"
                          defaultValue={hour.openTime}
                          onChange={(e) => setEditingHour({ ...editingHour, openTime: e.target.value })}
                          className="px-2 py-1 border rounded"
                          step="900"
                        />
                        <span>-</span>
                        <input
                          type="time"
                          defaultValue={hour.closeTime}
                          onChange={(e) => setEditingHour({ ...editingHour, closeTime: e.target.value })}
                          className="px-2 py-1 border rounded"
                          step="900"
                        />
                      </div>
                    ) : (
                      `${hour.openTime} - ${hour.closeTime}`
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-sm ${
                      hour.isOpen ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {hour.isOpen ? 'Abierto' : 'Cerrado'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    {editingHour?.id === hour.id ? (
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleUpdate(hour.id, {
                            openTime: editingHour.openTime,
                            closeTime: editingHour.closeTime,
                          })}
                          className="text-green-600 hover:text-green-800"
                        >
                          Guardar
                        </button>
                        <button
                          onClick={() => setEditingHour(null)}
                          className="text-gray-600 hover:text-gray-800"
                        >
                          Cancelar
                        </button>
                      </div>
                    ) : (
                      <div className="flex gap-4">
                        <button
                          onClick={() => setEditingHour(hour)}
                          className="text-blue-600 hover:text-blue-800"
                        >
                          Editar
                        </button>
                        <button
                          onClick={() => handleToggle(hour)}
                          className="text-yellow-600 hover:text-yellow-800"
                        >
                          {hour.isOpen ? 'Cerrar' : 'Abrir'}
                        </button>
                        <button
                          onClick={() => handleDelete(hour.id)}
                          className="text-red-600 hover:text-red-800"
                        >
                          Eliminar
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
