import { useCallback, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuthStore } from "../store/AuthStore";

const KakaoOAuthHandler = () => {
  const navigate = useNavigate();
  const processedRef = useRef(false);
  const setAccessToken = useAuthStore((state) => state.setAccessToken);

  const sendAuthCodeToServer = useCallback(
    async (code: string) => {
      try {
        const response = await axios.post(
          `/api/v1/auth/kakao/login`, // 에러날 시 해당 url 설정이 맞는지 점검하기
          { code },
          {
            withCredentials: true, // 리프레시 토큰 받는 용도(브라우저가 자동으로 쿠키를 첨부해서 서버로 보내줌)
          }
        );

        const { accessToken, data } = response.data;
        const { isNewUser } = data?.[0]?.isNewUser ?? false;

        // 첫 로그인 여부에 따라 true -> 회원정보 설정 / false -> 홈으로 보냄
        if (accessToken) {
          setAccessToken(accessToken);
          navigate(isNewUser ? "/signup" : "/");
        }
      } catch (error) {
        console.error(`kakao 로그인 실패:`, error);
        navigate("/login", { replace: true });
      }
    },
    [navigate, setAccessToken]
  );

  useEffect(() => {
    if (processedRef.current) return;

    const searchParams = new URLSearchParams(window.location.search);
    const code = searchParams.get("code");

    if (code) {
      sendAuthCodeToServer(code);
    } else {
      navigate("/", { replace: true });
    }

    processedRef.current = true;
  }, [navigate, sendAuthCodeToServer]);

  return null;
};

export { KakaoOAuthHandler };
