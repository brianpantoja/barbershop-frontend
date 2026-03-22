export interface LoginCredentials {
  email: string;
  password: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'business' | 'client';
  phone?: string;
  businessName?: string;
  businessAddress?: string;
}

export interface LoginResponse {
  success: boolean;
  user: User;
}

export interface ApiError {
  message: string;
  error: string;
  statusCode: number;
}
