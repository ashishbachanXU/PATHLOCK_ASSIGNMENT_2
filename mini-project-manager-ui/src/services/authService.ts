import api from './api';
import type { AuthResponse, LoginCredentials, RegisterCredentials } from '../types';

export const authService = {
  async register(credentials: RegisterCredentials): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>('/auth/register', credentials);
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('email', response.data.email);
    }
    return response.data;
  },

  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>('/auth/login', credentials);
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('email', response.data.email);
    }
    return response.data;
  },

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('email');
  },

  getToken(): string | null {
    return localStorage.getItem('token');
  },

  getEmail(): string | null {
    return localStorage.getItem('email');
  },

  isAuthenticated(): boolean {
    return !!this.getToken();
  },
};
