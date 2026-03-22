import { useEffect, useState } from 'react';
import { getAppointmentDetailUseCase } from '../core/usecases/get-appointment-detail.usecase';
import type { Appointment } from '../core/types/appointment';

export const useAppointmentDetail = (id: string) => {
  const [appointment, setAppointment] = useState<Appointment | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadAppointment = async () => {
      try {
        setLoading(true);
        const data = await getAppointmentDetailUseCase.execute(id);
        setAppointment(data);
      } catch (err) {
        setError('Error al cargar la cita');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      loadAppointment();
    }
  }, [id]);

  return { appointment, loading, error };
};
