import { authRepository } from '../repositories/auth.repository';
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

export class AuthService {
  async login(credentials: LoginCredentials): Promise<LoginResponse> {
    return authRepository.login(credentials);
  }

  async register(data: RegisterData): Promise<{ success: boolean; user: User }> {
    return authRepository.register(data);
  }

  async logout(): Promise<void> {
    await authRepository.logout();
  }

  async getCurrentUser(): Promise<User | null> {
    return authRepository.getCurrentUser();
  }
}

// Singleton instance
export const authService = new AuthService();
