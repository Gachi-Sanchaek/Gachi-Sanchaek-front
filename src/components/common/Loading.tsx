import { useEffect, useState } from "react";

import basic from "../../assets/bonggong_png/1_기본봉공.png";
import durumagi from "../../assets/bonggong_png/12_두루마기봉공.png";
import raincoat from "../../assets/bonggong_png/13_우비봉공.png";
import marine from "../../assets/bonggong_png/16_마린봉공.png";

type LoadingProps = {
  label: string; //"산책 경로를 생성"
};

function CuteLoading({ label }: LoadingProps) {
  const frames = [basic, durumagi, raincoat, marine];
  const [index, setIndex] = useState(0);
  const [dots, setDots] = useState(0);

  //봉공 전환
  useEffect(() => {
    const frameInterval = setInterval(() => {
      setIndex((prev) => (prev + 1) % frames.length);
    }, 700);
    return () => clearInterval(frameInterval);
  }, []);

  //애니메이션
  useEffect(() => {
    const dotInterval = setInterval(() => {
      setDots((d) => (d + 1) % 4);
    }, 400);
    return () => clearInterval(dotInterval);
  }, []);

  return (
    <div className="flex flex-col justify-center items-center w-full h-screen bg-white/70 backdrop-blur-sm fixed inset-0 z-[9999]">
      <div className="relative w-40 h-40 mb-6">
        {frames.map((src, i) => (
          <img
            key={i}
            src={src}
            alt="로딩 캐릭터"
            className={`absolute inset-0 w-full h-full object-contain transition-opacity duration-300 ${
              i === index ? "opacity-100" : "opacity-0"
            }`}
            draggable={false}
          />
        ))}
      </div>

      {/* 텍스트 */}
      <p className="text-neutral-700 text-sm text-center font-medium">
        {label}
        {".".repeat(dots)}
      </p>
    </div>
  );
}

export default CuteLoading;
