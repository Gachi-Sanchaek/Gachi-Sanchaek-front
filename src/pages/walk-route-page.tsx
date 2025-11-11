import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import BottomButton from "../components/common/BottomButton";
import RouteInfoCard from "../components/WalkRoutePage/RouteInfoCard";
import MapRoute from "../components/WalkRoutePage/MapRoute";
import { WalkStateStore } from "../store/WalkStateStore";
import type { RecommendResponse } from "../apis/routes";

export default function WalkRoutePage() {
  const navigate = useNavigate();
  const location = useLocation();
  const recommend = (location.state as { recommend?: RecommendResponse } | null)
    ?.recommend;
  //API응답만사용
  const routes = recommend?.routes ?? [];
  const [index, setIndex] = useState(0);
  const touchX = useRef<number | null>(null);
  const { setWalkState } = WalkStateStore();

  useEffect(() => {
    //경로 없을 시 입력 페이지 복귀
    if (!routes.length) {
      navigate("/walk", { replace: true });
    }
  }, [routes.length, navigate]);

  if (!routes.length) return null; //데이터 없으면 렌더 X

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

  const handleStart = () => {
    setWalkState("walk");
    navigate("/walk/realtime");
  };

  return (
    <>
      <MapRoute
        waypoints={current.waypoints}
        height="calc(100vh - 48px - 230px)"
      />

      <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[480px] z-40">
        <div className="w-full h-[238px] relative overflow-hidden rounded-tl-xl rounded-t-xl bg-white mx-auto">
          <div
            className="flex flex-col items-center w-full absolute top-6 gap-3"
            onTouchStart={onTouchStart}
            onTouchEnd={onTouchEnd}
          >
            {/* 인디케이터 점 */}
            <div className="flex items-center gap-2">
              {routes.map((_, i) => (
                <div
                  key={i}
                  onClick={() => setIndex(i)}
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
                  onClick: handleStart,
                },
              ]}
            />
          </div>
        </div>
      </div>
    </>
  );
}
