import api from '../api/axios';
import { LoginCredentials, LoginResponse, User } from '../types/auth';

export interface RegisterData {
  email: string;
  password: string;
  name: string;
  role: 'client' | 'business';
  businessName?: string;
  businessAddress?: string;
  phone?: string;
}

export class AuthRepository {
  async login(credentials: LoginCredentials): Promise<LoginResponse> {
    const response = await api.post<LoginResponse>('/auth/login', credentials);
    return response.data;
  }

  async register(data: RegisterData): Promise<{ success: boolean; user: User }> {
    const response = await api.post<{ success: boolean; user: User }>('/users', data);
    return response.data;
  }

  async logout(): Promise<void> {
    await api.post('/auth/logout');
  }

  async getCurrentUser(): Promise<User | null> {
    try {
      const response = await api.get<{ success: boolean; user: User }>('/auth/me');
      return response.data.user;
    } catch {
      return null;
    }
  }
}

export const authRepository = new AuthRepository();
