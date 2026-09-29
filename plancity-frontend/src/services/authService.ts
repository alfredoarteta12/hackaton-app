import { api } from '../lib/api';
import { tokenStorage } from '../lib/tokenStorage';
import type {
  RegisterCredentials,
  LoginCredentials,
  AuthResponse,
  User, 
} from '../types/auth';

export async function register(
  credentials: RegisterCredentials,
): Promise<AuthResponse> {
  const response = await api.post<AuthResponse>('/auth/register', credentials);
  tokenStorage.set(response.data.accessToken);
  return response.data;
}

export async function login(credentials: LoginCredentials): Promise<AuthResponse> {
  const response = await api.post<AuthResponse>('/auth/login', credentials);
  tokenStorage.set(response.data.accessToken);
  return response.data;
}

export async function logout(): Promise<void> {
  try {
    await api.post('/auth/logout');
  } finally {
    tokenStorage.remove();
  }
}

export async function getProfile(): Promise<User> {
  const response = await api.get<User>('/users/me');
  return response.data;
}
