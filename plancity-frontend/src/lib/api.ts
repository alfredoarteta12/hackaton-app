import axios from "axios";
import { tokenStorage } from "./tokenStorage";
import { appRouter } from "../appRouter";

export const api = axios.create({
  baseURL: "http://localhost:3001",
});

// 1. Interceptor de Petición
api.interceptors.request.use(
  (config) => {
    const token = tokenStorage.get();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// 2. Interceptor de Respuesta
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      tokenStorage.remove();

      appRouter.navigate("/auth/login");
    }

    return Promise.reject(error);
  },
);
