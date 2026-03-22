import { appointmentRepository } from '../repositories/appointment.repository';
import type { Appointment, AppointmentStatus } from '../types/appointment';

export class UpdateAppointmentStatusUseCase {
  async execute(id: string, status: AppointmentStatus, businessNotes?: string): Promise<Appointment> {
    try {
      return await appointmentRepository.updateStatus(id, { status, businessNotes });
    } catch (error) {
      console.error('Error actualizando estado de cita:', error);
      throw error;
    }
  }
}

export const updateAppointmentStatusUseCase = new UpdateAppointmentStatusUseCase();
