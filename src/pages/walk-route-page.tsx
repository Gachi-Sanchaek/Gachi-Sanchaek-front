import { useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import Header from "../components/common/Header";
import BottomButton from "../components/common/BottomButton";
import MapRoute from "../components/WalkRoutePage/MapRoute";
import { mockFetchWalkRecommendations } from "../mocks/walkRoutes";
import type { WalkApiResponse, RouteItem } from "../mocks/walkRoutes";

// .env에서 VITE_USE_MOCK=true 면 목 사용
const USE_MOCK = import.meta.env.VITE_USE_MOCK === "true";

export default function WalkRoutePage() {
  const [search] = useSearchParams();
  const navigate = useNavigate();

  const minutes = Number(search.get("minutes") ?? "40");
  const organizationId = search.get("organizationId") ?? "";

  const [routes, setRoutes] = useState<RouteItem[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollRef = useRef<HTMLDivElement | null>(null);

  // 필요 시 현재위치 쓰고 싶으면 MapRoute가 bounds로 맞추니 필수는 아님
  useEffect(() => {
    (async () => {
      try {
        let data: WalkApiResponse;

        if (USE_MOCK) {
          data = await mockFetchWalkRecommendations();
        } else {
          const url =
            `/api/walk/recommendations` +
            `?minutes=${minutes}` +
            `&currentLat=${37.5665}` + // 실제에선 geolocation 값
            `&currentLng=${126.978}` +
            (organizationId ? `&organizationId=${organizationId}` : "");
          const res = await fetch(url);
          if (!res.ok) throw new Error(String(res.status));
          data = (await res.json()) as WalkApiResponse;
        }

        if (data?.isSuccess && data.result?.routes) {
          setRoutes(data.result.routes);
          setCurrentIndex(0);
          if (scrollRef.current)
            scrollRef.current.scrollTo({ left: 0, behavior: "instant" as any });
        }
      } catch (e) {
        console.error(e);
      }
    })();
  }, [minutes, organizationId]);

  // 스와이프 → 인덱스 동기화
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      window.requestAnimationFrame(() => {
        const i = Math.round(el.scrollLeft / el.clientWidth);
        setCurrentIndex(Math.max(0, Math.min(i, routes.length - 1)));
        ticking = false;
      });
      ticking = true;
    };
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => el.removeEventListener("scroll", onScroll);
  }, [routes.length]);

  const activeRoute = useMemo(
    () => routes[currentIndex],
    [routes, currentIndex]
  );

  return (
    <div className="relative min-h-screen bg-white">
      <Header hasArrow title="유기견 산책" titleColor="black" bgColor="white" />

      <div className="pt-10">
        <MapRoute waypoints={activeRoute?.waypoints ?? []} height={360} />
      </div>

      {/* 하단 카드 & 인디케이터 */}
      <div className="absolute bottom-0 w-full max-w-[480px] z-40">
        <div className="bg-white pt-3 pb-28 rounded-t-xl shadow-[0_-4px_16px_rgba(0,0,0,0.06)]">
          <div className="flex justify-center gap-2 pb-2">
            {routes.map((_, i) => (
              <span
                key={i}
                className={`h-1.5 rounded-full transition-all ${i === currentIndex ? "w-6 bg-[#5FD59B]" : "w-1.5 bg-[#E0E0E0]"}`}
              />
            ))}
          </div>

          <div
            ref={scrollRef}
            className="flex overflow-x-auto snap-x snap-mandatory scroll-smooth"
            style={{ scrollSnapType: "x mandatory" }}
          >
            {routes.map((r) => (
              <section key={r.id} className="min-w-full px-6 pb-3 snap-start">
                <div className="border border-[#5FD59B] rounded-xl p-4">
                  <p className="text-[#5FD59B] font-semibold text-center">
                    프레쉬한 공기를 맡는 길
                  </p>
                  <hr className="my-3 border-[#E0FFE8]" />
                  <p className="text-center text-[#7D7D7D] text-sm">
                    약 {r.estimatedTime}분 소요
                  </p>
                </div>
                <p className="mt-3 text-sm text-[#7D7D7D]">{r.description}</p>
              </section>
            ))}

            {routes.length === 0 && (
              <section className="min-w-full px-6 pb-3 snap-start">
                <div className="border border-[#E0E0E0] rounded-xl p-4">
                  <p className="text-center text-sm text-[#7D7D7D]">
                    추천 코스를 불러오는 중…
                  </p>
                </div>
              </section>
            )}
          </div>
        </div>

        <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[480px] px-4 pb-4 bg-white">
          <BottomButton
            buttons={[
              {
                text: "산책 시작",
                variant: "green",
                onClick: () => {
                  if (!activeRoute) return;
                  // routeId 넘겨서 다음 페이지에서 활용
                  navigate(`/walk-start-page?routeId=${activeRoute.id}`);
                },
              },
            ]}
          />
        </div>
      </div>
    </div>
  );
}
