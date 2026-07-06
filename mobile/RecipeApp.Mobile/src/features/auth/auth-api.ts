import { baseApi } from "@/services/base-api";
import type {
  AuthResponse,
  AuthUser,
  LoginRequest,
  RegisterRequest,
} from "@/types/auth";

export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation<AuthResponse, LoginRequest>({
      query: (body) => ({
        url: "/Auth/login",
        method: "POST",
        body,
      }),
    }),

    register: builder.mutation<AuthResponse, RegisterRequest>({
      query: (body) => ({
        url: "/Auth/register",
        method: "POST",
        body,
      }),
    }),

    me: builder.query<AuthUser, void>({
      query: () => "/Auth/me",
    }),
  }),
});

export const { useLoginMutation, useRegisterMutation, useMeQuery } = authApi;
