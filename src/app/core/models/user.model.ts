export interface User {
  id: string;
  username: string;
  email: string;
  bio?: string;
  role: 'USER' | 'ADMIN';
}

export interface AuthRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  tokenType: string;
  expiresIn: number;
  userId: string;
  username: string;
  email: string;
  role: 'USER' | 'ADMIN';
}