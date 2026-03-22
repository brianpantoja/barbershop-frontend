import { authService } from '../services/auth.service';

export class LogoutUseCase {
  async execute(): Promise<void> {
    try {
      await authService.logout();
    } catch (error) {
      console.error('Error en logout:', error);
      throw error;
    }
  }
}

export const logoutUseCase = new LogoutUseCase();
