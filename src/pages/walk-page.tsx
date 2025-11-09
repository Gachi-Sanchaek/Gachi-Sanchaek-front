import { useState } from "react";
import BottomButton from "../components/common/BottomButton";
import MapView from "../components/WalkPage/MapView";
import { postWalkTime } from "../apis/walk-time";
import { useNavigate } from "react-router-dom"; 

export default function WalkPage() {
  const [time, setTime] = useState("");
  const navigate = useNavigate();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9]/g, "");
    //토스트로 수정하기
    if (Number(value) > 300) { 
      alert("최대 300분까지만 가능합니다!");
      return;
    }
    setTime(value);
  };

  const isDisabled = !time || Number(time) === 0;

  const handleRecommendClick = async () => {
    try {
      const minutes = Number(time);
      const data = await postWalkTime(minutes);
      console.log("백엔드 응답:", data);
      navigate("/walk/route");
    } catch (error) {
      console.log("시간 전송 실패");
    }
  };

  return (
    <>
      <div className="w-full" style={{ height: "calc(100vh - 48px - 230px)" }}>
        <MapView />
      </div>

      <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[480px] z-40 ">
        <div className="w-full h-[238px] relative overflow-hidden rounded-t-xl bg-white mx-auto font-[PretendardVariable]">
          <div className="flex flex-col w-full absolute p-6 gap-2">
            <p className="font-semibold text-lg">얼마나 걸으실 건가요?</p>
            <p className="font-normal text-sm text-[#bdbdbd]">
              추천 코스는 입력한 시간과 ±10분 정도 차이날 수 있어요.
            </p>
            <div className="flex items-center gap-2">
              <input
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                placeholder="시간입력"
                value={time}
                onChange={handleInputChange}
                className="w-[100px] h-12 px-4 border border-gray-200 rounded-lg text-center font-normal text-lg "
              ></input>
              <p className="font-semibold text-lg">분</p>
            </div>
          </div>
        </div>
      </div>

      <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[480px] z-50">
        <BottomButton
          buttons={[
            {
              text: "코스 추천 받기",
              variant: "green",
              onClick: handleRecommendClick,
              disabled: isDisabled,
            },
          ]}
        />
      </div>
    </>
  );
}
