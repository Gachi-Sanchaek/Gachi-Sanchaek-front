import { useEffect, useState } from 'react';
import MapRealtime from '../components/WalkRealtime/MapRealtime';
import Modal from '../components/common/Modal';
import { useNavigate } from 'react-router-dom';
import { CategoryStore } from '../store/CategoryStore';
import { patchWalkFinish } from '../apis/walk';
import pauseIcon from '/src/assets/stop.svg';
import playIcon from "/src/assets/play.svg";
import finishIcon from "/src/assets/finish.svg";
import { useLocation } from "react-router-dom";

export default function WalkRealtimePage() {
  const navigate = useNavigate();
  const { selectedCategory } = CategoryStore();

  const [tracking, setTracking] = useState(true);
  const [elapsed, setElapsed] = useState(0);
  const [distanceKm, setDistanceKm] = useState(0);
  const [showConfirm, setShowConfirm] = useState(false);

  const location = useLocation();
  const aiRoute = location.state?.aiRoute ?? null;

  //인증이 필요한 카테고리인지 판별
  const isAuthCategory =
    selectedCategory === "플로깅" ||
    selectedCategory === "유기견 산책" ||
    selectedCategory === "동행 산책";

  //인증 허용 최소시간 10분
  const MIN_AUTH_SECONDS = 10 * 60;

  //타이머
  useEffect(() => {
    if (!tracking) return;
    const id = setInterval(() => setElapsed((s) => s + 1), 1000);
    return () => clearInterval(id);
  }, [tracking]);

  //거리
  const handleStats = ({ distanceKm }: { distanceKm: number }) =>
    setDistanceKm(distanceKm);

  //비정상적 거리 감지
  useEffect(() => {
    if (distanceKm >= 30) {
      alert("비정상적인 움직임이 감지되어 산책이 자동 종료되었습니다.");
      navigate("/", { replace: true });
    }
  }, [distanceKm, navigate]);

  //산책중 화면 꺼짐 방지
  useEffect(() => {
    type ScreenWakeLock = { release: () => Promise<void> };

    let wakeLock: ScreenWakeLock | null = null;

    async function requestWakeLock() {
      const nav = navigator as Navigator & {
        wakeLock?: {
          request: (type: "screen") => Promise<ScreenWakeLock>;
        };
      };

      if (nav.wakeLock) {
        try {
          wakeLock = await nav.wakeLock.request("screen");
          console.log("Screen Wake Lock 활성화");
        } catch (err) {
          console.error("Wake Lock 요청 실패:", err);
        }
      }
    }

    requestWakeLock();

    return () => {
      if (wakeLock) {
        wakeLock.release().then(() => {
          console.log("Screen Wake Lock 해제");
          wakeLock = null;
        });
      }
    };
  }, []);

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

    const walkResult = {
      totalDistance: Number(distanceKm),
      totalSeconds: elapsed,
    };

    //10분 미만 포인트 없이 종료
    if (isAuthCategory && elapsed < MIN_AUTH_SECONDS) {
      navigate("/", { replace: true });
      return;
    }

    if (selectedCategory === "산책") {
      const walkId = Number(localStorage.getItem("walkId"));
      if (!walkId) {
        console.error("walkId가 없습니다");
        return;
      }

      try {
        const res = await patchWalkFinish({
          walkId,
          totalDistance: Number(distanceKm),
          totalSeconds: elapsed,
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
      state: { ...walkResult }, //거리,시간 전달
    });

    console.log(walkResult);
  };

  const pausePlayIcon = tracking ? pauseIcon : playIcon;

  return (
    <>
      {/* 지도 영역 */}
      <div className="w-full" style={{ height: "calc(100vh - 48px - 230px)" }}>
        <MapRealtime
          tracking={tracking}
          onStatsChange={handleStats}
          width="100%"
          height="100%"
          aiRoute={aiRoute}
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
              <img src={pausePlayIcon} alt="중지/재개" className="w-9 h-9" />
            </button>

            <button
              type="button"
              onClick={openFinish}
              className="w-[60px] h-[60px] rounded-full bg-white shadow-[0_0_10px_rgba(0,0,0,0.15)] place-items-center grid"
            >
              <img src={finishIcon} alt="종료" className="w-9 h-9" />
            </button>
          </div>
        </div>
      </div>

      {showConfirm && (
        <Modal
          //10분 미만, 인증 카테고리일경우 내용 변경
          title={
            isAuthCategory && elapsed < MIN_AUTH_SECONDS ? (
              <>
                10분 이상 산책해야 인증 후 포인트를 받을 수 있어요.
                <br />
                그래도 종료하시겠어요?
              </>
            ) : (
              "산책을 마치겠습니까?"
            )
          }
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