import axios, { AxiosError, type InternalAxiosRequestConfig } from "axios";
import type { ResponseRefreshTokenResponse } from "../types/user";

interface CustomInternalAxiosRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

export const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true, // HTTP-only 쿠키를 포함
});

let refreshPromise: Promise<string | void> | null = null;

// 요청 인터셉터: 요청 전에 accessToken을 Auhorization 헤더에 추가
axiosInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const accessToken = localStorage.getItem("accessToken");

    if (accessToken) {
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${accessToken}`;
    }

    //수정된 요청 설정을 반환
    return config;
  },
  (error: AxiosError) => Promise.reject(error)
);

// 응답 인터셉터: 단순 에러 처리
axiosInstance.interceptors.response.use(
  (response) => response,

  async (error: AxiosError) => {
    const originalRequest = error.config as CustomInternalAxiosRequestConfig;

    if (
      error &&
      error.status === 401 &&
      originalRequest &&
      !originalRequest._retry
    ) {
      if (originalRequest.url === "/api/v1/auth/refresh") {
        localStorage.removeItem("accessToken");
        window.location.href = "/login";
        return Promise.reject(error);
      }

      originalRequest._retry = true;

      if (!refreshPromise) {
        refreshPromise = (async () => {
          try {
            const { data } = await axios.post<ResponseRefreshTokenResponse>(
              "/api/v1/auth/refresh",
              {},
              { withCredentials: true }
            );

            localStorage.setItem("accessToken", data.accessToken);
            return data.accessToken;
          } catch (error) {
            console.error("Refresh token failed:", error);
            localStorage.removeItem("accessToken");
            window.location.href = "/login";
          } finally {
            refreshPromise = null;
          }
        })();
      }
      return refreshPromise.then((newAccessToken) => {
        // newAccessToken이 string인지 확인
        if (typeof newAccessToken === "string") {
          //원본 요청의 Authorization 헤더를 갱신된 토큰으로 업데이트
          originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;

          //업데이트된 원본 요청을 재시도
          return axiosInstance.request(originalRequest);
        } else {
          // 토큰이 없으면 에러 반환
          return Promise.reject(new Error("Failed to refresh access token"));
        }
      });
    }
    return Promise.reject(error);
  }
);
