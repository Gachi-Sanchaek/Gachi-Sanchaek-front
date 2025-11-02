import Header from "../components/common/Header";
import BottomButton from "../components/common/BottomButton";


export default function WalkPage() {
  return (
    <div className="relative bg-gray-500 min-h-screen">
      <Header hasArrow title="유기견 산책" titleColor="black" bgColor="white" />

      {/* 지도 
      카테고리텝 넣기 */}

      <div className="absolute bottom-0 w-full max-w-[480px] pb-4 z-40">
        <div className="flex flex-col bottom-0 h-[238px] bg-white rounded-t-xl gap-2 p-6 ">
          <p className="font-[PretendardVariable] font-semibold text-lg">
            얼마나 걸으실 건가요?
          </p>
          <p className="font-[PretendardVariable] font-normal text-sm text-[#bdbdbd]">
            추천 코스는 입력한 시간과 ±10분 정도 차이날 수 있어요.
          </p>
          <div className="flex items-center gap-2">
            <input
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              placeholder="시간입력"
              className="w-[100px] h-12 px-4 border border-gray-200 rounded-lg text-center font-[PretendardVariable] font-normal text-lg "
            ></input>
            <p className="font-[PretendardVariable] font-semibold text-lg">
              분
            </p>
          </div>
        </div>
      </div>

      <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[480px] z-50">
        <BottomButton
          buttons={[
            { text: "코스 추천 받기", variant: "green", onClick: () => {} },
          ]}
        />
      </div>
    </div>
  );
}
