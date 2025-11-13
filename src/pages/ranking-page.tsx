import { useEffect, useState } from "react";
import Background from "../components/Background";
import { ChevronLeft, ChevronRight } from "lucide-react";

import dayjs, { Dayjs } from "dayjs";
import { getTopRanking, getUserRanking } from "../apis/user";
import type { UserRankingItem } from "../types/user";
import { useUserStore } from "../store/UserStore";

function getWeekOfMonth(date: Dayjs): number {
  const startOfMonth = date.startOf("month");
  const startDay = startOfMonth.day(); // 0=일요일, 1=월요일 ...
  const offset = startDay === 0 ? 6 : startDay - 1; // 월요일 기준 정렬
  const dayOfMonth = date.date();

  return Math.ceil((dayOfMonth + offset) / 7);
}

export default function RankingPage() {
  const { profile } = useUserStore();
  const [myRanking, setMyRanking] = useState<UserRankingItem | null>(null);
  const [topRankings, setTopRankings] = useState<UserRankingItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

  const [weekInfo, setWeekInfo] = useState(() => {
    const saved = localStorage.getItem("rankingWeek");
    if (saved) {
      const parsed = JSON.parse(saved);
      parsed.date = dayjs(parsed.date);
      return parsed;
    }

    return getCurrentWeek();
  });

  useEffect(() => {
    localStorage.setItem(
      "rankingWeek",
      JSON.stringify({ ...weekInfo, date: weekInfo.date.toISOString() })
    );
  }, [weekInfo]);

  useEffect(() => {
    return () => {
      localStorage.removeItem("rankingWeek");
    };
  }, []);

  const handlePrevWeek = () => {
    setWeekInfo((prev: typeof weekInfo) => {
      const prevDate = dayjs(prev.date);
      const newWeek = getCurrentWeek(prevDate.subtract(7, "day"));

      return newWeek;
    });
  };

  const handleNextWeek = () => {
    setWeekInfo((prev: typeof weekInfo) => {
      const prevDate = dayjs(prev.date);
      const newDate = prevDate.add(7, "day");

      if (newDate.isAfter(dayjs(), "week")) return prev;

      const newWeek = getCurrentWeek(newDate);

      return newWeek;
    });
  };

  const isNextDisabled = weekInfo.date.add(7, "day").isAfter(dayjs(), "week");

  const formattedWeek = () => {
    return `${weekInfo.year.toString().slice(2)}년 ${weekInfo.month}월 ${weekInfo.week}주`;
  };

  useEffect(() => {
    const fetchRankings = async () => {
      setLoading(true);
      setError(null);

      try {
        const { year, month, week } = weekInfo;
        const formattedDate = `${year}${month}${week}`;

        console.log("요청 주차: ", formattedDate);

        const myRan = await getUserRanking(formattedDate);
        const topRan = await getTopRanking(formattedDate);

        setMyRanking(myRan);
        setTopRankings(topRan);
      } catch (error) {
        setError("사용자 정보를 불러오지 못했습니다.");
        console.error("사용자 정보 불러오기 실패: ", error);
      } finally {
        setLoading(false);
      }
    };
    fetchRankings();
  }, [weekInfo]);

  useEffect(() => {
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  const user1 = topRankings.find((u) => Number(u.ranking) === 1);
  const user2 = topRankings.find((u) => Number(u.ranking) === 2);
  const user3 = topRankings.find((u) => Number(u.ranking) === 3);

  const podiumUsers = [user2, user1, user3];

  const others = topRankings
    .filter((u) => Number(u.ranking) > 3)
    .sort((a, b) => Number(a.ranking) - Number(b.ranking));

  if (loading)
    return (
      <div className="w-full h-screen flex justify-center items-center font-[PretendardVariable] text-[#FFFFFF]">
        로딩중...
      </div>
    );
  if (error)
    return (
      <div className="w-full h-screen flex justify-center items-center font-[PretendardVariable] text-[#FFFFFF]">
        {error}
      </div>
    );

  return (
    <Background
      whiteBackgroundHeight={45}
      whiteBgColor="#FFFFFF"
      greenChildren={
        <div className="p-5 pt-0 flex flex-col justify-between h-[50%] w-full">
          <div className="flex justify-center items-center">
            <button onClick={handlePrevWeek} className="p-2">
              <ChevronLeft className="text-white" size={24} />
            </button>
            <span className="text-white text-[16px] mx-6">
              {formattedWeek()}
            </span>
            <button
              onClick={!isNextDisabled ? handleNextWeek : undefined}
              className="p-2"
              disabled={isNextDisabled}
            >
              <ChevronRight
                className={
                  isNextDisabled
                    ? "text-white/50 cursor-not-allowed"
                    : "text-white"
                }
                size={24}
              />
            </button>
          </div>

          <div className="mt-2 w-full h-[70px] flex-shrink-0 bg-[#FFFFFF]/80 rounded-2xl flex items-center shadow-[0_0_5px_0_rgba(0,0,0,0.2)] px-4">
            <div className="relative w-[50px] h-[50px] bg-[#FFFFFF] rounded-full flex items-center justify-center overflow-visible shadow-[0_0_3px_0_rgba(0,0,0,0.1)] mr-3">
              <img
                src={`${import.meta.env.VITE_API_URL}${profile?.profileImageUrl}`}
                alt="프로필 봉공"
                className="w-[50px] h-[50px] rounded-full"
              />
              <div className="absolute top-0 -left-1 w-5 h-5 rounded-full bg-[#5FD59B] text-[#FFFFFF] text-[8px] font-[PretendardVariable] flex items-center justify-center">
                MY
              </div>
            </div>

            <div className="flex flex-col justify-center flex-1 font-[PretendardVariable] font-medium">
              <span className="text-[13px]">{profile?.nickname}</span>
              <span className="text-[13px] text-[#BDBDBD]">
                {myRanking?.ranking ?? "- "}위
              </span>
            </div>
            <div className="flex justify-end">
              <span className="bg-[#5FD59B] text-[#FFFFFF] text-[12px] px-3.5 py-0.5 rounded-full font-[PretendardVariable] font-light">
                {myRanking?.point ?? 0}P
              </span>
            </div>
          </div>

          <div className="mt-2 flex justify-between items-end w-full">
            {topRankings.length === 0 ? (
              <></>
            ) : (
              podiumUsers.map((user, idx) => {
                if (!user) {
                  return (
                    <div
                      className="w-[90px] flex-shrink-0"
                      key={`placeholder-${idx}`}
                    />
                  );
                }
                const isFirstPlace = idx === 1;
                const size = isFirstPlace ? 110 : 90;
                const marginTop = 0;
                const marginBottom = isFirstPlace ? 0 : 8;

                const rankNum = Number(user.ranking) as 1 | 2 | 3;

                const rankColor: Record<1 | 2 | 3, string> = {
                  1: "bg-[#FFEC8A]",
                  2: "bg-[#E0E0E0]",
                  3: "bg-[#ED9D5D]",
                };

                return (
                  <div
                    key={user.ranking}
                    className="flex flex-col items-center"
                    style={{ marginTop, marginBottom }}
                  >
                    <div
                      className="relative rounded-full flex items-center justify-center shadow-[0_0_5px_0_rgba(0,0,0,0.2)] bg-white"
                      style={{ width: size, height: size }}
                    >
                      <img
                        src={`${import.meta.env.VITE_API_URL}${user?.profileImageUrl}`}
                        alt={`${user.nickname} 프로필`}
                        className="rounded-full"
                        style={{ width: size, height: size }}
                      />
                      <div
                        className={`absolute top-0 left-0 w-6 h-6 rounded-full text-[#FFFFFF] font-[PretendardVariable] flex items-center justify-center ${rankColor[rankNum]}`}
                      >
                        {rankNum}
                      </div>
                    </div>

                    <span className="font-[PretendardVariable] font-medium text-[15px] text-[#FFFFFF] mt-1 ">
                      {user.nickname}
                    </span>
                    <span className="bg-[#FFFFFF]/30 text-[#FFFFFF] text-[12px] px-3.5 py-0.5 rounded-full font-[PretendardVariable] font-light">
                      {user.point.toLocaleString()}P
                    </span>
                  </div>
                );
              })
            )}
          </div>
        </div>
      }
      whiteChildren={
        <div className="overflow-y-auto h-[100%]">
          {others.length === 0 ? (
            <div className="h-full flex items-center justify-center text-[#5FD59B] text-[15px] font-[PretendardVariable]">
              얼른 산책하여 <span className="ml-1 font-semibold">순위권</span>을
              노려보세요!
            </div>
          ) : (
            others.map((user, idx) => (
              <div
                key={`${user.ranking}-${idx}`}
                className="flex items-center justify-between py-2"
              >
                <span className="w-6 text-[16px] font-[PretendardVariable] font-medium text-[#BDBDBD] ml-4">
                  {user.ranking}
                </span>

                <div className="flex items-center flex-1 ml-2">
                  <div className="w-[60px] h-[60px] bg-[#FFFFFF] rounded-full flex items-center justify-center overflow-visible shadow-[0_0_3px_0_rgba(0,0,0,0.1)] mr-3">
                    <img
                      src={`${import.meta.env.VITE_API_URL}${user?.profileImageUrl}`}
                      alt={`${user.nickname} 프로필`}
                      className="w-13 h-13 rounded-full"
                    />
                  </div>
                  <span className="font-[PretendardVariable] font-medium text-[16px]">
                    {user.nickname}
                  </span>
                </div>

                <span className="bg-[#5FD59B] text-white text-[12px] px-3 py-0.5 rounded-full font-[PretendardVariable] font-light">
                  {user.point.toLocaleString()}P
                </span>
              </div>
            ))
          )}
        </div>
      }
    />
  );
}
