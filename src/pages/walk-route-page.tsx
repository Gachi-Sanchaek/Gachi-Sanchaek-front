import { useRef, useState } from "react";
import BottomButton from "../components/common/BottomButton";
import RouteInfoCard from "../components/WalkRoutePage/RouteInfoCard";
import { walkRoutes } from "../mocks/walkRoutes";
import MapRoute from "../components/WalkRoutePage/MapRoute";

export default function WalkRoutePage() {
  const routes = walkRoutes; //api연결후교체
  const [index, setIndex] = useState(0);
  const touchX = useRef<number | null>(null);

  const count = routes.length;
  const current = routes[index];

  const onTouchStart = (e: React.TouchEvent) => {
    touchX.current = e.touches[0].clientX;
  };

  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchX.current === null) return;
    const delta = e.changedTouches[0].clientX - touchX.current;
    // 50px 이상 드래그 시 슬라이드
    if (delta > 50) setIndex((i) => (i - 1 + count) % count);
    else if (delta < -50) setIndex((i) => (i + 1) % count);
    touchX.current = null;
  };

  return (
    <>
      {/* 지도 자리 */}

      <MapRoute waypoints={current.waypoints} height={580} />

      <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[480px] z-40">
        <div className="w-[393px] h-[238px] relative overflow-hidden rounded-tl-xl rounded-tr-xl bg-white mx-auto">
          <div
            className="flex flex-col items-center w-[393px] absolute top-6 gap-3"
            onTouchStart={onTouchStart}
            onTouchEnd={onTouchEnd}
          >
            {/* 인디케이터 점 */}
            <div className="flex items-center gap-2">
              {routes.map((_, i) => (
                <div
                  key={i}
                  className={`w-2 h-2 rounded-full ${
                    i === index ? "bg-[#5fd59b]" : "bg-neutral-200"
                  }`}
                />
              ))}
            </div>

            {/* 카드 */}
            <div className="flex items-center self-stretch gap-4 px-6">
              <div className="flex-1">
                <RouteInfoCard
                  title={current.description}
                  minutes={current.estimatedTime}
                />
              </div>
            </div>
          </div>
          <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[480px] z-50">
            <BottomButton
              buttons={[
                {
                  text: "산책 시작",
                  variant: "green",
                  onClick: () => {
                    console.log("산책 시작 버튼 클릭");
                  },
                },
              ]}
            />
          </div>
        </div>
      </div>
    </>
  );
}
