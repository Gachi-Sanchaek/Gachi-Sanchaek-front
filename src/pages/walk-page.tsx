import { useState } from "react";
import BottomButton from "../components/common/BottomButton";
import MapView from "../components/WalkPage/MapView";
import { useLocation, useNavigate } from "react-router-dom";
import { getRecommendedRoutes } from "../apis/routes";
import Loading from "../components/common/Loading";

export default function WalkPage() {
  const [time, setTime] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const orgId = location.state?.orgId ?? null;
  console.log(orgId);

  //5분이상 300이하만 산책 시간 입력가능
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9]/g, "");

    if (Number(value) > 300) {
      alert("최대 300분까지만 가능합니다!");
      return;
    }
    setTime(value);
  };

  const isDisabled = Number(time) < 5 || Number(time) > 300;

//현재위치 받아옴
  const getCurrent = (): Promise<{ lat: number; lng: number }> =>
    new Promise((resolve) => {
      if (!navigator?.geolocation)
        return resolve({ lat: 37.485993139336074, lng: 126.80448486831264 });
      navigator.geolocation.getCurrentPosition(
        (p) => resolve({ lat: p.coords.latitude, lng: p.coords.longitude }),
        () => resolve({ lat: 37.485993139336074, lng: 126.80448486831264 }) //기본값
      );
    });

  const handleRecommendClick = async () => {
    if (loading) return;
    try {
      setLoading(true);
      const minutes = Number(time);
      const cur = await getCurrent(); //현재위치
      const data = await getRecommendedRoutes({
        minutes,
        currentLat: cur.lat,
        currentLng: cur.lng,
        orgId: orgId ?? null,
      });
      console.log("백엔드 응답:", data);
      navigate("/walk/route", { state: { recommend: data } });
      setTimeout(() => {
        window.location.reload();
      }, 100);
    } catch (e) {
      console.log("추천 코스 조회 실패", e);
    } finally {
      setLoading(false);
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
      {loading && <Loading label="AI가 산책 경로를 생성하는 중입니다" />}
    </>
  );
}
