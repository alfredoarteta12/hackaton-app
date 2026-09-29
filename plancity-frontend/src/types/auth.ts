// Aquí irán todas las interfaces.

// register
export interface RegisterCredentials {
  name: string;
  email: string;
  password: string;
}

// login
// Usamos Omit (con Mayúscula) para quitar el campo 'name' de RegisterCredentials
export type LoginCredentials = Omit<RegisterCredentials, "name">;

// respuesta login y register
export interface User {
  id: string; // Es buena práctica tipar la estructura real del usuario
  name: string;
  email: string;
}

export interface AuthResponse {
  accessToken: string; // Corregido: 'accessToken' con doble 's'
  user: User; // Cambiado de 'user' a la interfaz User estructurada
}
export interface ChangePasswordRequest{
    currentPassword:string;
    newPassword:string;
}
