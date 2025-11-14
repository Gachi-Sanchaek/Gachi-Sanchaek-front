import { useEffect, useState } from 'react';

import basic from '../../assets/images/7_신난봉공.png';
import durumagi from '../../assets/images/12_두루마기봉공.png';
import raincoat from '../../assets/images/13_우비봉공.png';
import marine from '../../assets/images/16_마린봉공.png';

type LoadingProps = {
  label: string; //로딩이유
};

function Loading({ label }: LoadingProps) {
  const frames = [basic, durumagi, raincoat, marine];
  const [index, setIndex] = useState(0);
  const [dots, setDots] = useState(0);

  //봉공 전환
  useEffect(() => {
    const frameInterval = setInterval(() => {
      setIndex((prev) => (prev + 1) % frames.length);
    }, 700);
    return () => clearInterval(frameInterval);
  }, [frames.length]);

  //점애니메이션
  useEffect(() => {
    const dotInterval = setInterval(() => {
      setDots((d) => (d + 1) % 4);
    }, 400);
    return () => clearInterval(dotInterval);
  }, []);

  return (
    <div className='flex flex-col justify-center items-center w-full h-screen bg-white fixed inset-0 z-[9999]'>
      <div className='relative w-40 h-40 mb-6'>
        {frames.map((src, i) => (
          <img key={i} src={src} alt='봉공이' className={`absolute inset-0 w-full h-full object-contain transition-opacity duration-300 ${i === index ? 'opacity-100' : 'opacity-0'}`} draggable={false} />
        ))}
      </div>

      <p className='text-black text-sm text-center font-semibold'>
        {label}
        {'.'.repeat(dots)}
      </p>
    </div>
  );
}

export default Loading;
