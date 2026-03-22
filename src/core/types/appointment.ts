export type AppointmentStatus = 'pending' | 'confirmed' | 'cancelled' | 'completed';

export interface Appointment {
  id: string;
  businessId: string;
  businessName: string;
  clientId: string;
  clientName: string;
  serviceId: string;
  serviceName: string;
  serviceDuration: number;
  servicePrice: number;
  date: string;
  startTime: string;
  endTime: string;
  status: AppointmentStatus;
  clientPhone?: string;
  notes?: string;
  businessNotes?: string;
  createdAt: string;
}

export interface CreateAppointmentDto {
  serviceId: string;
  date: string;
  startTime: string;
  clientName: string;
  clientPhone?: string;
  notes?: string;
}

export interface UpdateAppointmentStatusDto {
  status: AppointmentStatus;
  businessNotes?: string;
}
