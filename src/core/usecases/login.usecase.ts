import { authService } from '../services/auth.service';
import { LoginCredentials, LoginResponse } from '../types/auth';

export class LoginUseCase {
  async execute(credentials: LoginCredentials): Promise<LoginResponse> {
    // Validaciones básicas
    if (!credentials.email || !credentials.password) {
      throw new Error('Email y contraseña son requeridos');
    }

    if (!credentials.email.includes('@')) {
      throw new Error('Email inválido');
    }

    if (credentials.password.length < 6) {
      throw new Error('La contraseña debe tener al menos 6 caracteres');
    }

    // Llamar al servicio
    return authService.login(credentials);
  }
}

export const loginUseCase = new LoginUseCase();
