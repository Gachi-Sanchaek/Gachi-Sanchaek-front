import Background from "../components/Background";
import vector from "../assets/vector.svg";
import coin from "../assets/coin.svg";
import polygon from "../assets/polygon.svg";
import lock from "../assets/lock.svg";
import pen from "../assets/pen.svg";
import sadBonggong from "../assets/images/not_found_bonggong.png";
import { useEffect, useRef, useState } from "react";
import { Check, ChevronDown, ChevronUp } from "lucide-react";
import BottomButton from "../components/common/BottomButton";
import type { PointLogItem } from "../types/point";
import { getPointLog } from "../apis/point";
import { useUserStore } from "../store/UserStore";
import { checkNickname, deleteUser, updateUserProfile } from "../apis/user";
import Modal from "../components/common/Modal";
import WarningModal from "../components/common/Modal";
import type { CheckNicknameResponse } from "../types/user";
import { useBonggongs } from "../hooks/useBonggong";
import { walkAuthType } from "../utils/walkType";

export default function MyPage() {
  const [activeTab, setActiveTab] = useState<"points" | "stamps">("points");
  const { profile, error: profileError, updateProfile } = useUserStore();
  const [isEditing, setIsEditing] = useState(false);
  const [shake, setShake] = useState(false);
  const [newNickname, setNewNickname] = useState(profile?.nickname || "");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isWarningOpen, setIsWarningOpen] = useState(false);
  const [selectedBonggong, setSelectedBonggong] = useState<number | null>(null);
  const [representBonggong, setRepresentBonggong] = useState<string>("");
  const {
    data: bonggongs,
    isLoading: bonggongsLoading,
    error: bonggongsError,
  } = useBonggongs();
  const [pointLogs, setPointLogs] = useState<PointLogItem[]>([]);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState<string>("전체");
  const inputRef = useRef<HTMLInputElement>(null);
  const [pointsLoading, setPointsLoading] = useState(true);
  const [pointsError, setPointsError] = useState<string | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isEditing]);

  const handleEditClick = () => {
    if (isEditing) {
      handleCheckNickname();
    } else {
      setIsEditing(true);
    }
  };

  const handleNicknameChange = (value: string) => {
    const filteredValue = value.replace(
      /[^a-zA-Z0-9\u3131-\u318E\uAC00-\uD7A3]/g,
      ""
    );

    if (filteredValue.length > 7) {
      setShake(true);
      setTimeout(() => setShake(false), 300);
      return;
    }

    setNewNickname(filteredValue);
    setIsModalOpen(false);
    setIsWarningOpen(false);
  };

  const handleCheckNickname = async () => {
    if (!newNickname.trim()) return;

    try {
      const response: CheckNicknameResponse = await checkNickname(newNickname);
      if (response.isAvailable) {
        setIsModalOpen(true);
      } else {
        setIsWarningOpen(true);
      }
    } catch (err) {
      console.error(err);
      alert("닉네임 중복 검사 중 오류가 발생했습니다.");
    }
  };

  const handleConfirmChange = async () => {
    setIsModalOpen(false);
    try {
      const updated = await updateUserProfile({
        nickname: newNickname,
        profileImageUrl: profile?.profileImageUrl,
      });
      updateProfile(updated);
      setIsEditing(false);
    } catch (err) {
      console.error("닉네임 변경 실패:", err);
      alert("닉네임 변경 중 오류가 발생했습니다.");
    }
  };

  const handleDeleteUser = async () => {
    await deleteUser();
  };

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
      setPointsLoading(true);
      try {
        const logs = await getPointLog();
        setPointLogs(logs);
        setPointsError(null);
      } catch (err) {
        console.error("포인트 로그 불러오기 실패", err);
        setPointsError("포인트 로그 불러오기 실패");
      } finally {
        setPointsLoading(false);
      }
    };
    fetchLogs();
  }, []);

  useEffect(() => {
    if (profile) {
      setRepresentBonggong(profile.profileImageUrl);
    }
  }, [profile]);

  const handleChangeBonggong = async () => {
    if (selectedBonggong === null || !profile) return;

    const selected = bonggongs?.data.find((b) => b.id === selectedBonggong);
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

  if (bonggongsLoading || pointsLoading)
    return (
      <div className="w-full h-screen flex justify-center items-center font-[PretendardVariable] text-[#FFFFFF]">
        로딩중...
      </div>
    );
  if (bonggongsError || pointsError || profileError)
    return (
      <div className="w-full h-screen flex justify-center items-center font-[PretendardVariable] text-[#FFFFFF]">
        {(bonggongsError || pointsError || profileError) as string}
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
      whiteBackgroundHeight={52}
      whiteBgColor="#FFFFFF"
      greenChildren={
        <div className="p-5 pt-2">
          <div className="flex items-center mt-4 justify-between w-full">
            <div className="flex items-center">
              <div className="relative w-[50px] h-[50px] bg-[#FFFFFF] rounded-full flex-shrink-0 flex items-center justify-center overflow-visible shadow-[0_0_8px_0_rgba(0,0,0,0.3)]">
                <img
                  src={`${import.meta.env.VITE_API_URL}${profile?.profileImageUrl}`}
                  alt="프로필 봉공"
                  className="w-[50px] h-[50px] rounded-full"
                />
                <button
                  onClick={handleEditClick}
                  className="absolute bottom-0 right-0 w-4 h-4 flex items-center justify-center"
                >
                  <img
                    src={pen}
                    alt="수정펜"
                    className={isEditing ? "grayscale" : "opacity-100"}
                  />
                </button>
              </div>
              <div className="ml-2 flex items-center">
                {isEditing ? (
                  <input
                    ref={inputRef}
                    value={newNickname}
                    onChange={(e) => handleNicknameChange(e.target.value)}
                    className={`text-white font-[PretendardVariable] font-medium text-[22px] bg-transparent border-none outline-none caret-white w-full ${shake ? "shake" : ""}`}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") handleCheckNickname();
                      if (e.key === "Escape") setIsEditing(false);
                    }}
                  />
                ) : (
                  <h2 className="text-white font-[PretendardVariable] font-medium text-[22px]">
                    {profile?.nickname}님
                  </h2>
                )}
              </div>
            </div>
            <button
              onClick={() => setIsDeleteModalOpen(true)}
              className="w-[48px] flex-shrink-0 text-white border border-white rounded-md px-3 py-2 font-[PretendardVariable] font-medium text-[16px] hover: bg-white/10"
            >
              탈퇴
            </button>
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

          <div className="absolute bottom-[51vh] left-1/2 transform -translate-x-1/2 flex gap-14">
            <div
              className="flex flex-col items-center cursor-pointer"
              onClick={() => {
                setActiveTab("points");
                setSelectedBonggong(null);
              }}
            >
              <span
                className={`text-base font-[PretendardVariable] ${activeTab === "points" ? "text-white font-semibold" : "text-white/70"}`}
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
                className={`text-base font-[PretendardVariable] ${activeTab === "stamps" ? "text-white font-semibold" : "text-white/70"}`}
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
                      className={`px-3 py-2 cursor-pointer ${selectedMonth === "전체" ? "text-[#5FD59B]" : ""}`}
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
                        className={`px-3 py-2 text-sm cursor-pointer hover:bg-gray-100 ${selectedMonth === m ? "text-[#5FD59B] font-semibold" : ""}`}
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
                {filteredPointHistory.length === 0 ? (
                  <div className="w-full h-full flex flex-col justify-center items-center text-center text-[#BDBDBD] font-[PretendardVariable]">
                    <img src={sadBonggong} alt="우는 봉공" className="w-20" />
                    <p className="text-[14px]">포인트 내역이 아직 없어요.</p>
                    <p className="text-[14px] mt-1">
                      산책하고 포인트를 모아보세요!
                    </p>
                  </div>
                ) : (
                  <div className="flex flex-col gap-3">
                    {filteredPointHistory.map((p) => {
                      const [, month, day] = p.date.split("-");
                      const formattedDate = `${parseInt(month, 10)}.${parseInt(day, 10)}`;

                      return (
                        <div
                          key={p.date}
                          className="flex justify-between h-16 items-center font-[PretendardVariable]"
                        >
                          <span className="text-[#BDBDBD] font-semibold text-[16px] w-15">
                            {formattedDate}
                          </span>
                          <div className="flex flex-col flex-1 ml-2 justify-center">
                            <span className="font-medium text-[16px]">
                              {walkAuthType(p.type)}
                            </span>
                            <span className="text-[#BDBDBD] text-[14px]">
                              {p.location.length > 15
                                ? `${p.location.slice(0, 15)}...`
                                : p.location}
                            </span>
                          </div>
                          <span className="text-[#5FD59B] text-[16px] font-semibold">
                            {p.amount.toLocaleString()}P
                          </span>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="overflow-y-auto h-[calc(100%-10px)]">
              <div className="grid grid-cols-3 gap-3 p-2">
                {bonggongs?.data.map((b) => {
                  const isSelected = selectedBonggong === b.id;
                  const isRepresentative = representBonggong === b.imageUrl;
                  return (
                    <div
                      key={b.id}
                      className={`relative flex flex-col items-center cursor-pointer rounded-lg transition-transform duration-100 ${isSelected ? "outline-[2px] outline-[#5FD59B] shadow-[0_0_10px_#5FD59B]" : ""}`}
                      onClick={() => {
                        if (!b.isActive) return;
                        if (isRepresentative) return;
                        setSelectedBonggong(b.id);
                      }}
                    >
                      <img
                        src={`${import.meta.env.VITE_API_URL}${b.imageUrl}`}
                        alt={b.name}
                        className={`w-28 h-28 object-contain rounded-lg ${b.isActive ? "" : "filter grayscale"}`}
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
          {isModalOpen && (
            <Modal
              title={`닉네임을 "${newNickname}"(으)로 바꾸시겠습니까?`}
              buttons={[
                {
                  text: "취소",
                  onClick: () => setIsModalOpen(false),
                  variant: "gray",
                },
                {
                  text: "확인",
                  onClick: handleConfirmChange,
                  variant: "green",
                },
              ]}
            />
          )}
          {isWarningOpen && (
            <WarningModal
              title={`이미 사용중인 닉네임입니다.`}
              buttons={[
                {
                  text: "확인",
                  onClick: () => setIsWarningOpen(false),
                  variant: "gray",
                },
              ]}
            />
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
          {isDeleteModalOpen && (
            <Modal
              title={
                <div className="flex flex-col items-center gap-3">
                  <img
                    src={sadBonggong}
                    alt="우는 봉공"
                    className="w-20 h-20"
                  />
                  <span className="font-[PretendardVariable] font-medium text-[18px]">
                    정말 탈퇴하시겠습니까?
                  </span>
                </div>
              }
              buttons={[
                {
                  text: "아니오",
                  variant: "gray",
                  onClick: () => setIsDeleteModalOpen(false),
                },
                {
                  text: "예",
                  variant: "green",
                  onClick: handleDeleteUser,
                },
              ]}
            />
          )}
        </div>
      }
    />
  );
}
