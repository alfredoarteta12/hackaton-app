export const TOKEN_KEY = "accessToken"; 

export const tokenStorage = {
  // Guarda el token en el almacenamiento local
  set: (token: string): void => localStorage.setItem(TOKEN_KEY, token),

  // Obtiene el token actual (devuelve string o null si no existe)
  get: (): string | null => localStorage.getItem(TOKEN_KEY),

  // Elimina el token (Crucial para hacer Logout)
  remove: (): void => localStorage.removeItem(TOKEN_KEY),
};
