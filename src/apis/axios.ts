import axios, { AxiosError, type InternalAxiosRequestConfig } from "axios";

export const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true, // HTTP-only 쿠키를 포함
});

// 요청 인터셉터: 요청 전에 accessToken을 Auhorization 헤더에 추가
axiosInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const accessToken = localStorage.getItem("accessToken");

    if (accessToken) {
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer eyJhbGciOiJIUzI1NiJ9.eyJ1c2VySWQiOjEsInJvbGUiOiJBRE1JTiIsImlhdCI6MTc2MjkzNzczOSwiZXhwIjoxNzYzNTQyNTM5fQ._TlPBb-KghJ0J7tZ5zbsoPxSMeqh8LrCUsh0q5t1g-4`;
    }

    //수정된 요청 설정을 반환
    return config;
  },
  (error: AxiosError) => Promise.reject(error)
);

// 응답 인터셉터: 단순 에러 처리
axiosInstance.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      // 토큰 만료 시 로그아웃 처리 또는 로그인 페이지로 이동
      localStorage.removeItem("accessToken");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);
