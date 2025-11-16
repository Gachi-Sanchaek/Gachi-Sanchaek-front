import { useCallback, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuthStore } from "../store/AuthStore";

const KakaoOAuthHandler = () => {
  const navigate = useNavigate();
  const processedRef = useRef(false);
  const setAccessToken = useAuthStore((state) => state.setAccessToken);
  const searchParams = new URLSearchParams(window.location.search);
  const code = searchParams.get("code");
  const K_API_URL = import.meta.env.VITE_API_URL;

  const sendAuthCodeToServer = useCallback(
    async (code: string) => {
      try {
        const response = await axios.get(
          `${K_API_URL}/api/v1/auth/kakao/login?code=${code}`,

          {
            withCredentials: true, // 리프레시 토큰 받는 용도(브라우저가 자동으로 쿠키를 첨부해서 서버로 보내줌)
          }
        );

        console.log("📩 응답 헤더:", response.headers);
        console.log("📩 응답 데이터:", response.data);

        const authHeader =
          response.headers["authorization"] ||
          response.headers["Authorization"];

        const accessToken = authHeader?.startsWith("Bearer ")
          ? authHeader.split(" ")[1]
          : null;

        console.log("📩 AccessToken 값: ", accessToken);

        const { data } = response.data;
        const { isNewUser } = data ?? { isNewUser: false };

        // 첫 로그인 여부에 따라 true -> 회원정보 설정 / false -> 홈으로 보냄
        if (accessToken) {
          localStorage.setItem("accessToken", accessToken);
          setAccessToken(accessToken);
          navigate(isNewUser ? "/signup" : "/");
        }
      } catch (error) {
        console.error(`kakao 로그인 실패:`, error);
        navigate("/login", { replace: true });
      }
    },
    [navigate, setAccessToken, K_API_URL]
  );

  useEffect(() => {
    if (processedRef.current) return;

    if (code) {
      sendAuthCodeToServer(code);
    } else {
      navigate("/", { replace: true });
    }

    processedRef.current = true;
  }, [navigate, code, sendAuthCodeToServer]);

  return null;
};

export { KakaoOAuthHandler };
