import axios from "axios";
import Cookies from "js-cookie";

const axiosClient = axios.create({
  baseURL: "/api",
  withCredentials: true,
});

axiosClient.interceptors.request.use(
  (config) => {
    const token = Cookies.get("access_token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

let isRefreshing = false;
let failedQueue: any[] = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) prom.reject(error);
    else prom.resolve(token);
  });
  failedQueue = [];
};

axiosClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (!error.response) {
      console.error("Network error:", error);
      return Promise.reject(error);
    }

    if (error.response.status === 401 && !originalRequest._retry) {
      const refresh_token = Cookies.get("refresh_token");

    
      if (!refresh_token) {    
        Cookies.remove("access_token");
        if (typeof window !== "undefined") {
          window.location.href = `/auth/login`;
        }
        return Promise.reject(error);
      }

      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            if (token) {
              originalRequest.headers.Authorization = `Bearer ${token}`;
            }
            return axiosClient(originalRequest);
          })
          .catch(Promise.reject);
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const refresh_token = Cookies.get("refresh_token");
        const { data } = await axiosClient.post("/auth/refresh", {
          refresh_token,
        });

        const newAccess = data.tokens.access_token;
        const newRefresh = data.tokens.refresh_token;

        Cookies.set("access_token", newAccess, {
          sameSite: "strict",
          secure: true,
        });
        Cookies.set("refresh_token", newRefresh, {
          sameSite: "strict",
          secure: true,
        });

        processQueue(null, newAccess);

        originalRequest.headers.Authorization = `Bearer ${newAccess}`;
        return axiosClient(originalRequest);
      } catch (err) {
        processQueue(err, null);
        Cookies.remove("access_token");
        Cookies.remove("refresh_token");

        if (typeof window !== "undefined") {
          window.location.href = `/auth/login?from=${encodeURIComponent(window.location.pathname)}`;
        }

        return Promise.reject(err);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default axiosClient;
