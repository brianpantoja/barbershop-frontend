import api from '../api/axios';
import type { BusinessHours } from '../types/business-hours';

export class BusinessHoursRepository {
  async findAll(): Promise<BusinessHours[]> {
    const response = await api.get('/business-hours');
    return response.data;
  }

  async create(data: Partial<BusinessHours>): Promise<BusinessHours> {
    const response = await api.post('/business-hours', data);
    return response.data;
  }

  async update(id: string, data: Partial<BusinessHours>): Promise<BusinessHours> {
    const response = await api.patch(`/business-hours/${id}`, data);
    return response.data;
  }

  async delete(id: string): Promise<void> {
    await api.delete(`/business-hours/${id}`);
  }
}

export const businessHoursRepository = new BusinessHoursRepository();
