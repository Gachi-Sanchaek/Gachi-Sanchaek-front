import { useNavigate } from "react-router-dom";
import BottomButton from "../components/common/BottomButton";
import fighting from "../assets/images/54_화이팅봉공.png";

export default function GoodbyePage() {
  const navigate = useNavigate();

  const goToLogin = () => {
    navigate("/login");
  };

  return (
    <div className="flex flex-col items-center justify-between min-h-screen bg-white px-6 py-10 w-full">
      <div className="mt-20 text-center">
        <h1 className="font-[PretendardVariable] text-[22px] font-semibold text-[#222]">
          탈퇴가 완료되었습니다
        </h1>
        <p className="font-[PretendardVariable] text-[#777] mt-4 text-[15px] leading-[1.6]">
          지금까지 이용해주셔서 감사합니다. <br />
          언제든지 다시 만나뵙기를 바랍니다.
        </p>
        <img
          src={fighting}
          alt="파이팅봉공"
          className="items-center w-30 ml-12 mt-20"
        />
      </div>
      <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[480px] z-50">
        <BottomButton
          buttons={[
            {
              text: "로그인 화면으로 이동",
              onClick: goToLogin,
              variant: "green",
            },
          ]}
        />
      </div>
    </div>
  );
}
