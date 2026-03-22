import { appointmentRepository } from '../repositories/appointment.repository';
import type { Appointment } from '../types/appointment';

export class GetAppointmentDetailUseCase {
  async execute(id: string): Promise<Appointment> {
    try {
      return await appointmentRepository.findById(id);
    } catch (error) {
      console.error('Error obteniendo detalle de cita:', error);
      throw error;
    }
  }
}

export const getAppointmentDetailUseCase = new GetAppointmentDetailUseCase();
