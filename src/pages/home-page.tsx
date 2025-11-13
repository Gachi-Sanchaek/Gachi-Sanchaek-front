import Background from "../components/Background";
import walkingBonggong from "../assets/images/gachi_sanchaek_bonggong.svg";
import walkBonggong from "../assets/bonggong_png/4_걷는봉공.png";
import { ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import dayjs, { Dayjs } from "dayjs";
import { useUserStore } from "../store/UserStore";

const STAMP_POINT = 500;

function getWeekOfMonth(date: Dayjs): number {
  const startOfMonth = date.startOf("month");
  const startDay = startOfMonth.day(); // 0=일요일, 1=월요일 ...
  const offset = startDay === 0 ? 6 : startDay - 1; // 월요일 기준 정렬
  const dayOfMonth = date.date();

  return Math.ceil((dayOfMonth + offset) / 7);
}

const Home = () => {
  const navigate = useNavigate();
  const { profile, ranking, error, fetchProfile, fetchRanking } =
    useUserStore();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  useEffect(() => {
    const init = async () => {
      try {
        const { year, month, week } = getCurrentWeek();
        const formattedDate = `${year}${String(month).padStart(2, "0")}${week}`;
        await fetchProfile();
        await fetchRanking(formattedDate);
      } finally {
        setLoading(false);
      }
    };
    init();
  }, [fetchProfile, fetchRanking]);

  const getCurrentWeek = (baseDate: Dayjs = dayjs()) => {
    const date = baseDate;
    let targetMonth = date.month();
    const targetDate = date.date();
    const startWeekDay = date.startOf("month").day();
    const originalWeek = Math.ceil((targetDate + startWeekDay - 1) / 7);
    let weekCorrection = 0;

    if (startWeekDay >= 1 && startWeekDay <= 4) {
      if (originalWeek === 5) {
        const endWeekDay = date.endOf("month").day();
        if (endWeekDay >= 1 && endWeekDay <= 3) {
          targetMonth = date.add(1, "month").month();
          weekCorrection = -4;
        }
      }
    } else if (startWeekDay === 0) {
      if (originalWeek === 0) {
        const lastDateOfPreviousMonth = date
          .subtract(1, "month")
          .endOf("month");
        const weekNum = getWeekOfMonth(lastDateOfPreviousMonth);
        targetMonth = lastDateOfPreviousMonth.month();
        weekCorrection = weekNum;
      } else if (originalWeek === 5) {
        targetMonth = date.add(1, "month").month();
        weekCorrection = -4;
      }
    } else {
      if (originalWeek === 1) {
        const lastDateOfPreviousMonth = date
          .subtract(1, "month")
          .endOf("month");
        const weekNum = getWeekOfMonth(lastDateOfPreviousMonth);
        targetMonth = lastDateOfPreviousMonth.month();
        weekCorrection = weekNum - originalWeek;
      } else if (originalWeek === 6) {
        targetMonth = date.add(1, "month").month();
        weekCorrection = -5;
      } else {
        weekCorrection = -1;
      }
    }
    return {
      year: date.year(),
      month: targetMonth + 1,
      week: originalWeek + weekCorrection,
      date: date,
    };
  };

  if (loading) return <p>로딩중...</p>;
  if (error) return <p>{error}</p>;
  if (!profile) return <p>사용자 정보가 없습니다.</p>;

  const currentPoints = profile?.totalPoints;

  const currentStampCount = Math.floor(currentPoints / STAMP_POINT);
  const startPoints = currentStampCount * STAMP_POINT;
  const nextPoints = startPoints + STAMP_POINT;

  const progressInSegment = currentPoints - startPoints;
  const getRoundedProgress = (value: number): number => {
    const floored = Math.floor(value / 100) * 100;
    switch (floored) {
      case 0:
        return 10;
      case 100:
        return 23.5;
      case 200:
        return 41;
      case 300:
        return 58.5;
      case 400:
        return 76;
      default:
        return 100;
    }
  };
  let progressPercentage = getRoundedProgress(progressInSegment);
  if (progressPercentage >= 70) {
    progressPercentage += 7;
  } else if (progressPercentage >= 50) {
    progressPercentage += 5.5;
  } else if (progressPercentage >= 40) {
    progressPercentage += 4;
  } else if (progressPercentage >= 20) {
    progressPercentage += 2;
  } else {
    progressPercentage += 1;
  }
  const bonggongPosition = getRoundedProgress(progressInSegment);

  return (
    <Background
      whiteBackgroundHeight={55}
      whiteBgColor="#FAFAFA"
      greenChildren={
        <div className="p-5 pt-2">
          <div className="flex items-center mt-4">
            <div className="bg-[#FFFFFF] w-[50px] h-[50px] rounded-full flex items-center justify-center overflow-visible shadow-[0_0_8px_0_rgba(0,0,0,0.3)]">
              <img
                src={`${import.meta.env.VITE_API_URL}${profile.profileImageUrl}`}
                alt="프로필 봉공"
                className="w-[50px] h-[50px] rounded-full"
              />
            </div>
            <h2 className="ml-2 font-[PretendardVariable] text-[24px] text-[#FFFFFF]">
              {profile.nickname}님
            </h2>
            <ChevronRight
              size={30}
              color="#FFFFFF"
              onClick={() => navigate("/mypage")}
            />
          </div>

          <div className="absolute left-0 bottom-[62vh] flex justify-center w-full px-4 mt-25 overflow-visible">
            <div className="bg-[#FFFFFF] w-full h-4 rounded-full">
              <div
                className="bg-[#FFEC8A] h-full rounded-full transition-all duration-500"
                style={{
                  width: `${progressPercentage}%`,
                }}
              />
              {[6.5, 23.9, 41.3, 58.7, 76.1].map((point, index) => (
                <div
                  key={index}
                  className="bg-[#FFFFFF] absolute top-1/2 w-2.5 h-2.5 rounded-full border-white -translate-x-1/2 -translate-y-1/2 z-20"
                  style={{
                    left: `${point}%`,
                  }}
                />
              ))}
            </div>
            <div className="absolute top-full w-full flex justify-between text-sm mt-2 px-4">
              <span></span>
              <span className="text-right text-[#FFFFFF]">
                {nextPoints.toLocaleString()}P
              </span>
            </div>

            <div
              className="absolute top-1/2 transition-all -translate-y-4/5 z-20"
              style={{
                left: `calc(${bonggongPosition}% - 40px)`,
              }}
            >
              <img
                src={walkBonggong}
                alt="산책 봉공"
                className="w-[80px] h-[80px]"
              />

              <div className="absolute top-[-10px] left-1/2 transform -translate-x-1/2 text-xs px-2 py-0.5 rounded-md font-medium bg-[#FFFFFF] text-[#5FD59B]">
                {currentPoints.toLocaleString()}
              </div>
            </div>
          </div>
        </div>
      }
      whiteChildren={
        <div className="flex flex-col h-full gap-6">
          <div className="bg-[#FFFFFF] flex-[4] flex flex-col items-center justify-center rounded-xl p-5 shadow-[0_0_10px_0_rgba(0,0,0,0.08)]">
            <div className="flex-1 flex items-center justify-center w-full mb-2">
              <img
                src={walkingBonggong}
                alt="산책 봉공"
                className="w-[207px]"
              />
            </div>

            <button
              className="bg-[#5FD59B] w-full text-white py-2 rounded-lg font-[PretendardVariable] text-sm font-medium"
              onClick={() => {
                navigate("/search");
              }}
            >
              산책 시작하기
            </button>
          </div>

          <div className="flex-[3] flex gap-4">
            <div className="bg-[#FFFFFF] flex-1 flex flex-col justify-center rounded-xl p-5 shadow-[0_0_10px_0_rgba(0,0,0,0.08)] mx-auto">
              <div
                className="flex items-center"
                onClick={() => navigate("/mypage")}
              >
                <p className="font-[PretendardVariable] text-[16px] text-[#BDBDBD]">
                  나의 포인트
                </p>
                <ChevronRight size={20} color="#BDBDBD" />
              </div>
              <p className="font-[PretendardVariable] text-[18px] font-semibold">
                {profile.totalPoints.toLocaleString()}P
              </p>
            </div>
            <div className="bg-[#FFFFFF] flex-1 flex flex-col justify-center rounded-xl p-5 shadow-[0_0_10px_0_rgba(0,0,0,0.08)] mx-auto">
              <div className="flex items-center">
                <p
                  className="font-[PretendardVariable] text-[16px] text-[#BDBDBD]"
                  onClick={() => navigate("/ranking")}
                >
                  나의 순위
                </p>
                <ChevronRight size={20} color="#BDBDBD" />
              </div>
              <p className="font-[PretendardVariable] text-[18px] font-semibold">
                {ranking?.ranking}위
              </p>
            </div>
          </div>
        </div>
      }
    />
  );
};

export default Home;
