export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
}

export interface AuthUser {
  userId: string;
  name: string;
  email: string;
}

export interface AuthResponse {
  id: string;
  name: string;
  email: string;
  token: string;
}
