import type { AuthResponse, LoginRequest, RegisterRequest } from "@/types/auth";
import { api } from "./api";

export const authService = {
  login(data: LoginRequest) {
    return api.post<AuthResponse>("/Auth/login", data);
  },

  register(data: RegisterRequest) {
    return api.post<AuthResponse>("/Auth/register", data);
  },
};
