import { useAuthStore } from "@/store/authstore";
import axios from "axios";

export const http = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL || "http://localhost:5000/api",
  withCredentials: true,
});

http.interceptors.request.use((config) => {
  const { accessToken } = useAuthStore.getState();
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
});

let isRefreshing = false;
let failedQueue = [];

http.interceptors.response.use(
  (res) => res,
  async (error) => {
    const orignal = error.config;

    if (error.response?.status === 401 && !orignal._retry) {
      if (!isRefreshing) {
        isRefreshing = true;
        const res = await axios.post(
          "/api/auth/refresh",
          {},
          { withCredentials: true },
        );
        const { login } = useAuthStore.getState();
        login({
          accessToken: res.data.accessToken,
          user: useAuthStore.getState().user,
        });
        isRefreshing = false;
      }
      return http(orignal);
    }
    return Promise.reject(error);
  },
);
