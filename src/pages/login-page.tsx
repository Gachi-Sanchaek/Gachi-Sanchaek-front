import walkingBonggong from "../assets/bonggong_png/4_걷는봉공.png";

const KakaoIcon = () => (
  <svg
    width="20"
    height="18"
    viewBox="0 0 20 18"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M10 0C15.5227 0 19.9998 3.45096 20 7.70801C20 11.9652 15.5228 15.417 10 15.417C9.00121 15.417 8.03705 15.3019 7.12695 15.0918L4.76465 17.4561C4.43444 17.7864 3.87198 17.5238 3.91309 17.0586L4.18457 13.9775C1.65156 12.5791 0 10.2929 0 7.70801C0.000228331 3.45096 4.47729 0 10 0Z"
      fill="#1A1A1C"
    />
  </svg>
);

const LogIn = () => {
  const K_REST_API_KEY = import.meta.env.VITE_KAKAO_REST_API_KEY;
  const K_REDIRECT_URI = import.meta.env.VITE_KAKAO_REDIRECT_URI;
  const kakaoURL = `https://kauth.kakao.com/oauth/authorize?response_type=code&client_id=${K_REST_API_KEY}&redirect_uri=${K_REDIRECT_URI}`;

  const handleKakaoLogin = () => {
    window.location.href = kakaoURL;
  };

  return (
    <div
      className="relative w-full h-screen overflow-hidden flex flex-col items-center justify-center"
      style={{
        background: "linear-gradient(to bottom, #5FD59B, #FFEC8A)",
      }}
    >
      <div className="flex flex-col items-center justify-center ">
        <img src={walkingBonggong} alt="걷는 봉공" className="w-[200px]" />
        <p className="font-[PretendardVariable] font-light text-[16px] text-[#FFFFFF]">
          걸음마다 쌓이는 가치
        </p>
        <h1 className="font-[Cafe24Ssurround] font-medium text-[50px] text-white">
          가치산책
        </h1>
        <button
          type="button"
          className="
          flex flex-row justify-center items-center 
          py-5 px-6 gap-2 mt-10
          w-[345px] h-[62px] 
          bg-[#FFE600] 
          rounded-xl
          text-[#1A1A1C] 
          active:scale-95 transition-transform duration-150
          hover:brightness-95
        "
          onClick={handleKakaoLogin}
        >
          <KakaoIcon />
          <span
            className="
            font-[PretendardVariable] text-base leading-[1.4] 
            text-center tracking-[-0.003em]
          "
          >
            카카오톡으로 시작하기
          </span>
        </button>
      </div>
    </div>
  );
};

export default LogIn;
