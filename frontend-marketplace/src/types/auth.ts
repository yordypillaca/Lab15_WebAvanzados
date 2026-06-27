export type UserRole = 'CUSTOMER' | 'ADMIN';

export interface User {
  id: number;
  nombre: string;
  email: string;
  role: UserRole;
}

export interface AuthResponse {
  token: string;
  user: User;
}
