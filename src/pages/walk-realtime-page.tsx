import MapView from "../components/WalkPage/MapView";
export default function WalkRealtimePage() {
  return (
    <>
      <div className="w-full" style={{ height: "calc(100vh - 48px - 230px)" }}>
        <MapView />
      </div>

      <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[480px] z-40 ">
        <div className="w-[393px] h-[238px] relative overflow-hidden rounded-tr-xl bg-white mx-auto"></div>
        <div className="w-[393px] absolute left-1/2 -translate-x-1/2 top-6 px-6">
          {/* 거리,시간 */}
          <div className="flex justify-center items-center gap-10">
            <div className="flex flex-col items-center gap-1">
              <p className="text-2xl font-semibold text-[#bdbdbd] font-[PretendardVariable]">
                0.0
              </p>
              <p className="text-sm text-[#bdbdbd] font-[PretendardVariable]">
                거리(km)
              </p>
            </div>

            <div className="flex flex-col items-center gap-1">
              <p className="text-2xl font-semibold text-[#bdbdbd] font-[PretendardVariable]">
                00:01
              </p>
              <p className="text-sm text-[#bdbdbd] font-[PretendardVariable]">
                시간(분)
              </p>
            </div>
          </div>

          {/* 중지, 종료 버튼 */}
          <div className="mt-6 flex justify-center items-center gap-9">
            <button
              type="button"
              className="w-[60px] h-[60px] rounded-full bg-white shadow-[0_0_10px_rgba(0,0,0,0.15)] place-items-center"
            >
              <img src="/src/assets/stop.svg" alt="중지" className="w-9 h-9" />
            </button>

            <button
              type="button"
              className="w-[60px] h-[60px] rounded-full bg-white shadow-[0_0_10px_rgba(0,0,0,0.15)] place-items-center"
            >
              <img
                src="/src/assets/finish.svg"
                alt="종료"
                className="w-9 h-9"
              />
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
