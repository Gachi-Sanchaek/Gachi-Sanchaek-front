import { motion, useMotionValue } from 'framer-motion';
import { BOTTOM_SHEET_HEIGHT, MAX_Y, MIN_Y } from '../../../constant/BottomSheet';
import BottomSheetHeader from './BottomSheetHeader';
import BottomSheetContent from './BottomSheetContent';
import useBottomSheet from '../../../hooks/useBottomSheet';

const BottomSheet = () => {
  const { sheet, content } = useBottomSheet();
  const y = useMotionValue<number>(MAX_Y - 240);

  const handleDragEnd = (_: unknown, info: { point: { y: number } }) => {
    const middle = (MIN_Y + MAX_Y) / 2;
    if (info.point.y === middle) {
      y.set(middle);
      if (info.point.y < middle) {
        y.set(MIN_Y); // 열림
      } else {
        y.set(MAX_Y); // 닫힘
      }
    }
  };

  return (
    <motion.div
      className='w-full max-w-[480px] fixed bottom-0 z-50 flex flex-col rounded-t-xl bg-white shadow-[0_0_5px_rgba(0,0,0,0.2)] transition-transform duration-500 ease-out'
      style={{
        height: `${BOTTOM_SHEET_HEIGHT}px`,
        y,
      }}
      ref={sheet}
      drag='y'
      dragConstraints={{ top: MIN_Y, bottom: MAX_Y }}
      dragElastic={0.2}
      onDragEnd={handleDragEnd}
    >
      <BottomSheetHeader />
      <div ref={content} className='flex-1 overflow-auto [&::-webkit-scrollbar]:hidden'>
        <BottomSheetContent />
      </div>
    </motion.div>
  );
};

export default BottomSheet;
