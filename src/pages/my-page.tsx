import Background from "../components/Background";
import vector from "../assets/vector.svg";
import coin from "../assets/coin.svg";
import polygon from "../assets/polygon.svg";
import lock from "../assets/lock.svg";
import { useEffect, useState } from "react";
import { Check, ChevronDown, ChevronUp } from "lucide-react";
import BottomButton from "../components/common/BottomButton";
import type { PointLogItem } from "../types/point";
import { getPointLog } from "../apis/point";
import { useUserStore } from "../store/UserStore";
import type { Bonggong } from "../types/bonggong";
import { getBonggongs } from "../apis/bonggong";

export default function MyPage() {
  const [activeTab, setActiveTab] = useState<"points" | "stamps">("points");
  const { profile, error, updateProfile } = useUserStore();
  const [selectedBonggong, setSelectedBonggong] = useState<number | null>(null);
  const [representBonggong, setRepresentBonggong] = useState<string>("");
  const [bonggongs, setBonggongs] = useState<Bonggong[]>([]);
  const [pointLogs, setPointLogs] = useState<PointLogItem[]>([]);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState<string>("전체");
  const [loading, setLoading] = useState(true);

  const sortedPointHistory = [...pointLogs].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  const months = [
    ...new Set(
      pointLogs.map((p) => {
        const [year, month] = p.date.split("-");
        return `${year.slice(2)}.${parseInt(month, 10)}`;
      })
    ),
  ];

  const filteredPointHistory =
    selectedMonth === "전체"
      ? sortedPointHistory
      : sortedPointHistory.filter((p) => {
          const [year, month] = p.date.split("-");
          const formatted = `${year.slice(2)}.${parseInt(month, 10)}`;
          return formatted === selectedMonth;
        });

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const logs = await getPointLog();
        setPointLogs(logs);
      } catch (err) {
        console.error("포인트 로그 불러오기 실패", err);
      }
    };
    fetchLogs();
  }, []);

  useEffect(() => {
    if (profile) {
      setRepresentBonggong(profile.profileImageUrl);
    }
  }, [profile]);

  useEffect(() => {
    const fetchStamps = async () => {
      try {
        const response = await getBonggongs();
        setBonggongs(response);
      } catch (error) {
        console.error("스탬프 데이터 호출 실패: ", error);
      } finally {
        setLoading(false);
      }
    };
    fetchStamps();
  }, []);

  const handleChangeBonggong = async () => {
    if (selectedBonggong === null || !profile) return;

    const selected = bonggongs.find((b) => b.id === selectedBonggong);
    if (!selected) return;

    if (!profile) {
      alert("유저 정보를 불러오지 못했습니다.");
      return;
    }

    try {
      const response = await updateProfile({
        profileImageUrl: selected.imageUrl,
      });

      console.log("프로필 수정 성공:", response);
      setRepresentBonggong(selected.imageUrl);
      setSelectedBonggong(null);
    } catch (error) {
      console.error("대표 봉공 변경 실패: ", error);
      alert("봉공이 변경 중 오류가 발생했습니다.");
    }
  };

  useEffect(() => {
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

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
  if (!profile)
    return (
      <div className="w-full h-screen flex justify-center items-center font-[PretendardVariable] text-[#FFFFFF]">
        사용자 정보가 없습니다.
      </div>
    );

  return (
    <Background
      whiteBackgroundHeight={60}
      whiteBgColor="#FFFFFF"
      greenChildren={
        <div className="p-5 pt-2">
          <div className="flex items-center mt-4">
            <div
              className="w-[50px] h-[50px] rounded-full flex items-center justify-center overflow-visible shadow-[0_0_8px_0_rgba(0,0,0,0.3)]"
              style={{ backgroundColor: "#FFFFFF" }}
            >
              <img
                src={`${import.meta.env.VITE_API_URL}${profile?.profileImageUrl}`}
                alt="프로필 봉공"
                className="w-[50px] h-[50px] rounded-full"
              />
            </div>
            <h2
              className="ml-2 font-[PretendardVariable]"
              style={{ color: "#FFFFFF", fontSize: "24px" }}
            >
              {profile?.nickname}님
            </h2>
          </div>

          <div className="mt-4 flex items-center text-white font-medium">
            <div className="flex items-center rounded-lg bg-black/10 p-2">
              <img src={vector} alt="발바닥 아이콘" className="w-5 h-5" />
              <span className="ml-2 font-[PretendardVariable] text-base">
                {profile?.walkingCount}번
              </span>
            </div>
            <span className="ml-1 font-[PretendardVariable] text-base">
              의 산책을 하고
            </span>
          </div>

          <div className="mt-1.5 flex items-center text-white font-medium">
            <div className="flex items-center rounded-lg bg-black/10 p-2">
              <img src={coin} alt="동전 아이콘" className="w-4.5 h-4.5" />
              <span className="ml-2 font-[PretendardVariable] text-base">
                {profile?.totalPoints.toLocaleString()}포인트
              </span>
            </div>
            <span className="ml-1 font-[PretendardVariable] text-base">
              를 적립했어요!
            </span>
          </div>

          <div className="absolute bottom-[58.5vh] left-1/2 transform -translate-x-1/2 flex gap-14">
            <div
              className="flex flex-col items-center cursor-pointer"
              onClick={() => {
                setActiveTab("points");
                setSelectedBonggong(null);
              }}
            >
              <span
                className={`text-base font-[PretendardVariable] ${
                  activeTab === "points"
                    ? "text-white font-semibold"
                    : "text-white/70"
                }`}
              >
                포인트
              </span>
              {activeTab === "points" && (
                <img
                  src={polygon}
                  alt="삼각형 아이콘"
                  className="w-6 h-6 mt-0.5"
                />
              )}
            </div>

            <div
              className="flex flex-col items-center cursor-pointer"
              onClick={() => setActiveTab("stamps")}
            >
              <span
                className={`text-base font-[PretendardVariable] ${
                  activeTab === "stamps"
                    ? "text-white font-semibold"
                    : "text-white/70"
                }`}
              >
                스탬프
              </span>
              {activeTab === "stamps" && (
                <img
                  src={polygon}
                  alt="삼각형 아이콘"
                  className="w-6 h-6 mt-0.5"
                />
              )}
            </div>
          </div>
        </div>
      }
      whiteChildren={
        <div className="w-full h-full">
          {activeTab === "points" ? (
            <div className="relative h-full">
              <div className="sticky top-0 left-0 z-10 pt-2 pb-3 flex items-center">
                <div
                  className="flex items-center gap-1 text-sm text-[#BDBDBD] cursor-pointer select-none"
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                >
                  <span className="font-[PretendardVariable] font-light text-[16px] text-[#BDBDBD] cursor-pointer flex items-center gap-1">
                    {selectedMonth}
                  </span>
                  {dropdownOpen ? (
                    <ChevronUp size={20} className="text-[#BDBDBD]" />
                  ) : (
                    <ChevronDown size={20} className="text-[#BDBDBD]" />
                  )}
                </div>
                {dropdownOpen && (
                  <div className="absolute mt-2 bg-white border-none rounded-lg shadow-md w-32 z-20">
                    <div
                      className={`px-3 py-2 cursor-pointer ${
                        selectedMonth === "전체" ? "text-[#5FD59B]" : ""
                      }`}
                      onClick={() => {
                        setSelectedMonth("전체");
                        setDropdownOpen(false);
                      }}
                    >
                      전체
                    </div>
                    {months.map((m) => (
                      <div
                        key={m}
                        className={`px-3 py-2 text-sm cursor-pointer hover:bg-gray-100 ${
                          selectedMonth === m
                            ? "text-[#5FD59B] font-semibold"
                            : ""
                        }`}
                        onClick={() => {
                          setSelectedMonth(m);
                          setDropdownOpen(false);
                        }}
                      >
                        {m}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="overflow-y-auto h-[calc(100%-40px)] pb-5">
                <div className="flex flex-col gap-3">
                  {filteredPointHistory.map((p) => {
                    const [, month, day] = p.date.split("-");
                    const formattedDate = `${parseInt(month, 10)}.${parseInt(day, 10)}`;

                    return (
                      <div
                        key={p.date}
                        className="flex justify-between h-16 items-center font-[PretendardVariable]"
                      >
                        <span className="text-[#BDBDBD] text-[16px] w-15">
                          {formattedDate}
                        </span>
                        <div className="flex flex-col flex-1 ml-2 justify-center">
                          <span className="font-medium text-[16px]">
                            {p.title}
                          </span>
                          <span className="text-[#BDBDBD] text-[14px]">
                            {p.location.length > 15
                              ? `${p.location.slice(0, 15)}...`
                              : p.location}
                          </span>
                        </div>
                        <span className="text-[#5FD59B] text-[16px] font-medium">
                          {p.amount}P
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          ) : (
            <div className="overflow-y-auto h-[calc(100%-40px)]">
              <div className="grid grid-cols-3 gap-3 p-2">
                {bonggongs.map((b) => {
                  const isSelected = selectedBonggong === b.id;
                  const isRepresentative = representBonggong === b.imageUrl;
                  return (
                    <div
                      key={b.id}
                      className={`relative flex flex-col items-center cursor-pointer rounded-lg transition-transform duration-100 ${
                        isSelected
                          ? "outline outline-[2px] outline-[#5FD59B] shadow-[0_0_10px_#5FD59B]"
                          : ""
                      }`}
                      onClick={() => {
                        if (!b.isActive) return;
                        if (isRepresentative) return;
                        setSelectedBonggong(b.id);
                      }}
                    >
                      <img
                        src={`${import.meta.env.VITE_API_URL}${b.imageUrl}`}
                        alt={b.name}
                        className={`w-28 h-28 object-contain rounded-lg ${
                          b.isActive ? "" : "filter grayscale"
                        }`}
                      />
                      {isSelected && (
                        <div className="absolute top-1 right-1 w-5 h-5 rounded-full flex items-center justify-center bg-[#5FD59B]">
                          <Check size={16} color="white" />
                        </div>
                      )}

                      {!b.isActive && (
                        <div className="absolute bottom-1 right-1 w-6 h-6 bg-[#BDBDBD] rounded-full flex items-center justify-center">
                          <img
                            src={lock}
                            alt="잠금 아이콘"
                            className="w-3 h-3"
                          />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {selectedBonggong && (
            <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[480px] z-50">
              <BottomButton
                buttons={[
                  {
                    text: "변경하기",
                    onClick: handleChangeBonggong,
                    variant: "green",
                  },
                ]}
              />
            </div>
          )}
        </div>
      }
    />
  );
}
