import { axiosClient } from '../../api/axiosClient';
import { AuthResponse, UserProfile, RegisterPayload, LoginPayload } from './types';

const AUTH_TOKEN_KEY = 'pn_auth_token';

export const authService = {
  async register(payload: RegisterPayload): Promise<AuthResponse> {
    const response = await axiosClient.post<{ success: boolean; data: AuthResponse }>(
      '/auth/register',
      payload
    );
    return response.data.data;
  },

  async login(payload: LoginPayload): Promise<AuthResponse> {
    const response = await axiosClient.post<{ success: boolean; data: AuthResponse }>(
      '/auth/login',
      payload
    );
    return response.data.data;
  },

  async getMe(): Promise<UserProfile> {
    const response = await axiosClient.get<{ success: boolean; data: UserProfile }>(
      '/auth/me'
    );
    return response.data.data;
  },

  getToken(): string | null {
    return localStorage.getItem(AUTH_TOKEN_KEY);
  },

  setToken(token: string): void {
    localStorage.setItem(AUTH_TOKEN_KEY, token);
  },

  removeToken(): void {
    localStorage.removeItem(AUTH_TOKEN_KEY);
  },
};
