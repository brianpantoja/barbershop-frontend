import api from "../api/axios";
import type {
  Appointment,
  CreateAppointmentDto,
  UpdateAppointmentStatusDto,
} from "../types/appointment";

// Tipo para el error de Axios
interface AxiosErrorResponse {
  response?: {
    data?: {
      message?: string;
    };
    status?: number;
  };
  message?: string;
}

export class AppointmentRepository {
  async findByClient(): Promise<Appointment[]> {
    try {
      const response = await api.get<Appointment[]>("/appointments/client");
      return response.data;
    } catch (error) {
      console.error("Error fetching client appointments:", error);
      throw error;
    }
  }
  async findById(id: string): Promise<Appointment> {
    try {
      const response = await api.get<Appointment>(`/appointments/${id}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching appointment by id:", error);
      throw error;
    }
  }
  async findByBusiness(date?: string): Promise<Appointment[]> {
    try {
      const params = date ? `?date=${date}` : "";
      const response = await api.get<Appointment[]>(
        `/appointments/business${params}`,
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching business appointments:", error);
      throw error;
    }
  }

  async getAvailableSlots(
    businessId: string,
    serviceId: string,
    date: string,
  ): Promise<{ availableSlots: string[] }> {
    try {
      const response = await api.get<{ availableSlots: string[] }>(
        "/appointments/availability",
        {
          params: { businessId, serviceId, date },
        },
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching available slots:", error);
      throw error;
    }
  }

  async create(data: CreateAppointmentDto): Promise<Appointment> {
    try {
      console.log("📤 Enviando a backend:", data);
      const response = await api.post<Appointment>("/appointments", data);
      console.log("📥 Respuesta backend:", response.data);
      return response.data;
    } catch (error) {
      console.error("🔴 Error en API:", {
        data: (error as AxiosErrorResponse).response?.data,
        status: (error as AxiosErrorResponse).response?.status,
      });
      throw error;
    }
  }

  async updateStatus(
    id: string,
    data: UpdateAppointmentStatusDto,
  ): Promise<Appointment> {
    try {
      const response = await api.patch<Appointment>(
        `/appointments/${id}/status`,
        data,
      );
      return response.data;
    } catch (error) {
      console.error("Error updating appointment status:", error);
      throw error;
    }
  }
}

export const appointmentRepository = new AppointmentRepository();
