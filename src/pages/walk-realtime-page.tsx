import { useEffect, useRef, useState } from "react";
import MapRealtime from "../components/WalkRealtime/MapRealtime";
import Modal from "../components/common/Modal";
import { useNavigate } from "react-router-dom";
import { CategoryStore } from "../store/CategoryStore";
import { patchWalkFinish } from "../apis/walk";

export default function WalkRealtimePage() {
  const navigate = useNavigate();
  const { selectedCategory } = CategoryStore();
  //const isPlogging = selectedCategory === "플로깅";

  const [tracking, setTracking] = useState(true);
  const [elapsed, setElapsed] = useState(0);
  const [distanceKm, setDistanceKm] = useState(0);
  const [showConfirm, setShowConfirm] = useState(false);

  const pathRef = useRef<{ lat: number; lng: number }[]>([]);

  //타이머
  useEffect(() => {
    if (!tracking) return;
    const id = setInterval(() => setElapsed((s) => s + 1), 1000);
    return () => clearInterval(id);
  }, [tracking]);

  //거리
  const handleStats = ({ distanceKm }: { distanceKm: number }) =>
    setDistanceKm(distanceKm);

  //누적 좌표
  const handlePath = (p: { lat: number; lng: number }[]) => {
    pathRef.current = p;
  };

  //시간 mm:ss
  const fmt = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  };

  //정지/재시작
  const onPauseResume = () => {
    setTracking((t) => !t);
  };

  //종료 버튼 모달 열기
  const openFinish = () => setShowConfirm(true);
  const closeFinish = () => setShowConfirm(false);

  const confirmFinish = async () => {
    setShowConfirm(false);
    setTracking(false);

    const walkId = Number(localStorage.getItem("walkId"));
    if (!walkId) {
      console.error("walkId가 없습니다");
      return;
    }
    console.log("walkId:", walkId);
    console.log("보내는 데이터:", {
      walkId,
      totalDistance: Number(distanceKm),
      totalMinutes: Math.floor(elapsed / 60),
    });

    const walkResult = {
      totalDistance: Number(distanceKm),
      totalMinutes: Math.floor(elapsed / 60),
    };

    if (selectedCategory === "산책") {
      try {
        const res = await patchWalkFinish({
          walkId,
          totalDistance: Number(distanceKm),
          totalMinutes: Math.floor(elapsed / 60),
        });

        const finishData = res.data;
        navigate("/end", { state: finishData });
      } catch (err) {
        console.error("산책 종료 API 실패:", err);
      }
      return;
    }

    const authRoutes: Record<string, string> = {
      플로깅: "/plogging-auth",
      "유기견 산책": "/qr-auth",
      "동행 산책": "/qr-auth",
    };

    const next = authRoutes[selectedCategory];

    if (!next) {
      console.error("해당 카테고리 인증 페이지 없음");
      return;
    }

    navigate(next, {
      state: walkResult, //거리,시간 전달
    });
  };

  const pauseIcon = tracking ? "/src/assets/stop.svg" : "/src/assets/play.svg";

  return (
    <>
      {/* 지도 영역 */}
      <div className="w-full" style={{ height: "calc(100vh - 48px - 230px)" }}>
        <MapRealtime
          tracking={tracking}
          onStatsChange={handleStats}
          onPathUpdate={handlePath}
          width="100%"
          height="100%"
        />
      </div>

      <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[480px] z-40 ">
        <div className="w-full h-[238px] relative overflow-hidden rounded-t-xl bg-white mx-auto"></div>
        <div className="w-full absolute left-1/2 -translate-x-1/2 top-6 px-6">
          {/* 거리,시간 */}
          <div className="flex justify-center items-center gap-10">
            <div className="flex flex-col items-center gap-1">
              <p className="text-2xl font-semibold text-[#bdbdbd] font-[PretendardVariable]">
                {distanceKm.toFixed(2)}
              </p>
              <p className="text-sm text-[#bdbdbd] font-[PretendardVariable]">
                거리(km)
              </p>
            </div>

            <div className="flex flex-col items-center gap-1">
              <p className="text-2xl font-semibold text-[#bdbdbd] font-[PretendardVariable]">
                {fmt(elapsed)}
              </p>
              <p className="text-sm text-[#bdbdbd] font-[PretendardVariable]">
                시간(분)
              </p>
            </div>
          </div>

          {/* 중지/재시작/종료 버튼 */}
          <div className="mt-6 flex justify-center items-center gap-9">
            <button
              type="button"
              onClick={onPauseResume}
              className="w-[60px] h-[60px] rounded-full bg-white shadow-[0_0_10px_rgba(0,0,0,0.15)] place-items-center grid"
            >
              <img src={pauseIcon} alt="중지/재개" className="w-9 h-9" />
            </button>

            <button
              type="button"
              onClick={openFinish}
              className="w-[60px] h-[60px] rounded-full bg-white shadow-[0_0_10px_rgba(0,0,0,0.15)] place-items-center grid"
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

      {/* 종료 확인 모달 수정예정 */}
      {showConfirm && (
        <Modal
          title="산책을 마치겠습니까?"
          buttons={[
            {
              text: "아니오",
              onClick: closeFinish,
              variant: "gray",
            },
            {
              text: "예",
              onClick: confirmFinish,
              variant: "green",
            },
          ]}
        />
      )}
    </>
  );
}
