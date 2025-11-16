import { useEffect, useState } from "react";
import { Check } from "lucide-react";
import BottomButton from "../components/common/BottomButton";
import { useNavigate } from "react-router-dom";
import { axiosInstance } from "../apis/axios";
import close from "../assets/close.svg";
import { checkNickname } from "../apis/user";

const SignUp = () => {
  const navigate = useNavigate();
  const [nickname, setNickname] = useState("");
  const [shake, setShake] = useState(false);
  const [isNicknameValid, setIsNicknameValid] = useState<boolean | null>(null);
  const [nicknameChecked, setNicknameChecked] = useState(false);

  const [gender, setGender] = useState<"MALE" | "FEMALE" | null>(null);

  // 닉네임 중복 검사
  const handleCheckNickname = async () => {
    if (!nickname.trim()) return;

    try {
      const response = await checkNickname(nickname);
      const available = response.isAvailable ?? false;
      setIsNicknameValid(available);
    } catch (error) {
      console.error("닉네임 중복 검사 실패:", error);
      setIsNicknameValid(false);
    } finally {
      setNicknameChecked(true);
    }
  };

  // 닉네임 변경 시 초기화
  const handleNicknameChange = (value: string) => {
    const filteredValue = value.replace(
      /[^a-zA-Z0-9\u3131-\u318E\uAC00-\uD7A3]/g,
      ""
    );

    if (filteredValue.length > 7) {
      setShake(true);
      setTimeout(() => setShake(false), 300);
      return;
    }

    setNickname(filteredValue);
    setNicknameChecked(false);
    setIsNicknameValid(null);
  };

  const isButtonEnabled = isNicknameValid && gender !== null;

  const handleSignUp = async () => {
    if (!isButtonEnabled) return;

    try {
      const response = await axiosInstance.post("/api/v1/users", {
        gender,
        nickname,
      });

      if (response.status === 201 || response.status === 200) {
        navigate("/");
      } else {
        console.error("회원가입 실패:", response.data);
        alert("회원가입에 실패했습니다. 다시 시도해주세요.");
      }
    } catch (error) {
      console.error("회원가입 실패:", error);
      alert("회원가입 중 오류가 발생했습니다. 다시 시도해주세요.");
    }
  };

  useEffect(() => {
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  return (
    <div className="relative w-full h-screen overflow-hidden">
      <header
        className={`fixed top-0 w-full max-w-[480px] z-50 py-2.5 bg-white`}
      >
        <div className="flex items-center justify-center px-6">
          <h1
            className={`font-[PretendardVariable] font-medium text-black text-[18px] select-none`}
          >
            회원가입
          </h1>
        </div>
      </header>
      <div className="pt-16 px-6 flex flex-col pb-20">
        <label className="flex items-center gap-2 pt-4 font-[PretendardVariable] font-medium text-[16px]">
          닉네임
          <div
            className={`w-4 h-4 rounded-full flex items-center justify-center border-2 transition-colors ${
              nicknameChecked
                ? isNicknameValid
                  ? "bg-[#5FD59B] border-[#5FD59B]"
                  : "bg-red-500 border-red-500"
                : "bg-[#F5F5F5] border-[#F5F5F5]"
            }`}
          >
            <Check size={12} color="white" />
          </div>
        </label>
        <div className="flex gap-2 mt-1 mb-1">
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="닉네임을 입력하세요"
              value={nickname}
              onChange={(e) => handleNicknameChange(e.target.value)}
              className={`flex-1 min-w-0 w-full pr-8 px-3 py-3 rounded-lg font-[PretendardVariable] font-medium text-[16px] border ${
                nicknameChecked && isNicknameValid
                  ? "border-[#5FD59B]"
                  : "border-[#F5F5F5]"
              } focus:outline-none focus:ring-2 focus:ring-green-400 ${shake ? "shake" : ""}`}
            />
            {nickname.length > 0 && (
              <button
                onClick={() => {
                  setNickname("");
                  setNicknameChecked(false);
                  setIsNicknameValid(null);
                }}
                className="absolute right-3 top-1/2 -translate-y-1/2"
              >
                <img src={close} alt="초기화" />
              </button>
            )}
          </div>

          <button
            type="button"
            onClick={handleCheckNickname}
            disabled={nickname.length < 1 || nicknameChecked}
            className={`w-[72px] flex-shrink-0 bg-[#5FD59B] text-white text-[16px] rounded-lg active:brightness-98 transition-colors
            }`}
          >
            중복확인
          </button>
        </div>
        <div className="h-[18px] mb-1 text-[13px]">
          {nicknameChecked && isNicknameValid && (
            <p className="text-[#5FD59B]">사용 가능한 닉네임입니다.</p>
          )}
          {nicknameChecked && !isNicknameValid && (
            <p className="text-red-500">사용 불가능한 닉네임입니다.</p>
          )}
        </div>

        <label className="flex items-center gap-2 pt-10 font-[PretendardVariable] font-medium text-[16px] pt-8">
          성별
          <div
            className={`w-4 h-4 rounded-full flex items-center justify-center border-2 transition-colors ${
              gender
                ? "bg-[#5FD59B] border-[#5FD59B]"
                : "bg-[#F5F5F5] border-[#F5F5F5]"
            }`}
          >
            <Check size={12} color="white" />
          </div>
        </label>
        <div className="flex gap-2 mt-1">
          <button
            type="button"
            onClick={() => setGender("MALE")}
            className={`flex-1 py-3 rounded-lg font-[PretendardVariable] font-medium text-[16px] transition-colors ${
              gender === "MALE"
                ? "bg-[#5FD59B] text-white"
                : "bg-[#F5F5F5] text-black"
            }`}
          >
            남성
            {gender === "MALE"}
          </button>
          <button
            type="button"
            onClick={() => setGender("FEMALE")}
            className={`flex-1 py-3 rounded-lg font-[PretendardVariable] font-medium text-[16px] transition-colors ${
              gender === "FEMALE"
                ? "bg-[#5FD59B] text-white"
                : "bg-[#F5F5F5] text-black"
            }`}
          >
            여성
            {gender === "FEMALE"}
          </button>
        </div>
      </div>
      <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[480px] z-50">
        <BottomButton
          buttons={[
            {
              text: "시작하기",
              onClick: handleSignUp,
              variant: "green",
              disabled: !isButtonEnabled,
            },
          ]}
        />
      </div>
    </div>
  );
};

export default SignUp;
