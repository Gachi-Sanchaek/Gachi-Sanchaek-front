import BottomButton from "../components/common/BottomButton";

export default function WalkEndPage() {
  //교체예정
  const nickname = "즈에";
  const walkingCount = 3;
  const totalDistance = 5.0;
  const totalMinutes = 30;
  const pointsEarned = 600;

  return (
    <>
      <div className="flex flex-col items-center justify-center w-full h-[calc(100vh-136px)] gap-4">
        <p className="text-2xl font-semibold text-center text-[#5fd59b] font-[PretendardVariable]">
          {nickname}님의 {walkingCount}번째 산책
        </p>

        <div className="flex flex-col items-center relative">
          <img
            src="/src/assets/bonggong_png/54_화이팅봉공.png"
            alt="화이팅봉공"
            className="w-[100px] h-[100px] object-cover -mb-8"
          />
          <div className="flex justify-center items-center gap-10 px-9 py-3 rounded-2xl bg-white shadow-[0_0_4px_rgba(0,0,0,0.1)]">
            <div className="flex flex-col items-center">
              <p className="text-2xl font-semibold text-[#bdbdbd] font-[PretendardVariable]">
                {totalDistance.toFixed(1)}
              </p>
              <p className="text-sm text-[#bdbdbd] font-[PretendardVariable]">
                거리(km)
              </p>
            </div>
            <div className="flex flex-col items-center">
              <p className="text-2xl font-semibold text-[#bdbdbd] font-[PretendardVariable]">
                {String(Math.floor(totalMinutes / 60)).padStart(2, "0")}:
                {String(totalMinutes % 60).padStart(2, "0")}
              </p>
              <p className="text-sm text-[#bdbdbd] font-[PretendardVariable]">
                시간(분)
              </p>
            </div>
          </div>
        </div>

        <p className="text-2xl font-semibold text-center">
          <span className="text-[#5fd59b] font-[PretendardVariable]">
            {pointsEarned}포인트
          </span>
          <span className="text-black font-[PretendardVariable]">
            를 받았어요!
          </span>
        </p>
      </div>

      <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[480px] z-50">
        <BottomButton
          buttons={[
            {
              text: "완료",
              variant: "green",
              onClick: () => console.log("완료 클릭"),
              disabled: false,
            },
          ]}
        />
      </div>
    </>
  );
}
