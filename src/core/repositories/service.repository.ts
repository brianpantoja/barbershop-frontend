import api from "../api/axios";
import type {
  Service,
  CreateServiceDto,
  UpdateServiceDto,
} from "../types/service";

export class ServiceRepository {
  async findAll(): Promise<Service[]> {
    try {
      console.log("🟣 Llamando a API /services");
      const response = await api.get<Service[]>("/services");
      console.log("🟣 Respuesta completa:", response);
      console.log("🟣 Data:", response.data);
      return response.data;
    } catch (error) {
      console.error("🔴 Error en API:", error);
      throw error;
    }
  }

  // 👇 CORREGIR: usar /public en lugar de /business
  async findByBusinessId(businessId: string): Promise<Service[]> {
    try {
      console.log("🟣 Buscando servicios para negocio:", businessId);
      const response = await api.get<Service[]>(
        `/services/public/${businessId}`, // 👈 Cambiar a /public/
      );
      console.log("🟣 Servicios encontrados:", response.data);
      return response.data;
    } catch (error) {
      console.error("🔴 Error:", error);
      throw error;
    }
  }

  async findPublicByBusinessId(businessId: string): Promise<Service[]> {
    try {
      const response = await api.get<Service[]>(`/services/public/${businessId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching public services:', error);
      throw error;
    }
  }

  async findById(id: string): Promise<Service> {
    const response = await api.get<Service>(`/services/${id}`);
    return response.data;
  }

  async create(data: CreateServiceDto): Promise<Service> {
    const response = await api.post<Service>("/services", data);
    return response.data;
  }

  async update(id: string, data: UpdateServiceDto): Promise<Service> {
    const response = await api.patch<Service>(`/services/${id}`, data);
    return response.data;
  }

  async delete(id: string): Promise<void> {
    await api.delete(`/services/${id}`);
  }
}

export const serviceRepository = new ServiceRepository();
