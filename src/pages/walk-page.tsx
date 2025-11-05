import { useState } from "react";
import BottomButton from "../components/common/BottomButton";
import Category from "../components/SearchPage/Category/Category";
import MapView from "../components/WalkPage/MapView";
export default function WalkPage() {
  const [time, setTime] = useState("");

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9]/g, "");
    setTime(value);
  };

  const isDisabled = !time || Number(time) === 0;

  return (
    <>
      <Category />
      <div className="w-full" style={{ height: "calc(100vh - 48px - 230px)" }}>
        <MapView />
      </div>

      <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[480px] z-40 ">
        <div className="w-[393px] h-[238px] relative overflow-hidden rounded-tr-xl bg-white mx-auto font-[PretendardVariable]">
          <div className="flex flex-col w-[393px] absolute p-6 gap-2">
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
              onClick: () => {},
              disabled: isDisabled,
            },
          ]}
        />
      </div>
    </>
  );
}
