import { ENV } from "@/config/env";
import axios from "axios";
import { storageService } from "./storage";

// eslint-disable-next-line import/no-named-as-default-member
export const api = axios.create({
  baseURL: ENV.API_URL,
});

api.interceptors.request.use(async (config) => {
  const token = await storageService.getToken();

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});
