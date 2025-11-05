import Background from "../components/Background";
import walkingBonggong from "../assets/images/gachi_sanchaek_bonggong.svg";
import walkBonggong from "../assets/bonggong_png/4_걷는봉공.png";
import { userMock } from "../mocks/user";
import { ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

const STAMP_POINT = 500;

const Home = () => {
  const navigate = useNavigate();
  const currentPoints = userMock.points;

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

  useEffect(() => {
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  return (
    <Background
      whiteBackgroundHeight={55}
      whiteBgColor="#FAFAFA"
      greenChildren={
        <div className="p-5 pt-2">
          <div className="flex items-center mt-4">
            <div className="bg-[#FFFFFF] w-[50px] h-[50px] rounded-full flex items-center justify-center overflow-visible shadow-[0_0_8px_0_rgba(0,0,0,0.3)]">
              <img
                src={userMock.profileImage}
                alt="프로필 봉공"
                className="w-[50px] h-[50px] rounded-full"
              />
            </div>
            <h2 className="ml-2 font-[PretendardVariable] text-[24px] text-[#FFFFFF]">
              {userMock.nickname}님
            </h2>
            <ChevronRight
              size={30}
              color="#FFFFFF"
              onClick={() => navigate("/mypage")}
            />
          </div>

          <div className="absolute left-0 bottom-[62vh] w-full flex justify-center w-full px-4 mt-25 overflow-visible">
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

            <button className="bg-[#5FD59B] w-full text-white py-2 rounded-lg font-[PretendardVariable] text-sm font-medium">
              산책 시작하기
            </button>
          </div>

          <div className="flex-[3] flex gap-4">
            <div className="bg-[#FFFFFF] flex-1 flex flex-col justify-center rounded-xl p-5 shadow-[0_0_10px_0_rgba(0,0,0,0.08)] mx-auto">
              <div className="flex items-center">
                <p className="font-[PretendardVariable] text-[16px] text-[#BDBDBD]">
                  나의 포인트
                </p>
                <ChevronRight
                  size={20}
                  color="#BDBDBD"
                  onClick={() => navigate("/mypage")}
                />
              </div>
              <p className="font-[PretendardVariable] text-[18px] font-semibold">
                {userMock.points.toLocaleString()}P
              </p>
            </div>
            <div className="bg-[#FFFFFF] flex-1 flex flex-col justify-center rounded-xl p-5 shadow-[0_0_10px_0_rgba(0,0,0,0.08)] mx-auto">
              <div className="flex items-center">
                <p className="font-[PretendardVariable] text-[16px] text-[#BDBDBD]">
                  나의 순위
                </p>
                <ChevronRight
                  size={20}
                  color="#BDBDBD"
                  onClick={() => navigate("/ranking")}
                />
              </div>
              <p className="font-[PretendardVariable] text-[18px] font-semibold">
                {userMock.ranking}위
              </p>
            </div>
          </div>
        </div>
      }
    />
  );
};

export default Home;
