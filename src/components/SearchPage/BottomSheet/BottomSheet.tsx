import BottomSheetHeader from './BottomSheetHeader';
import BottomSheetContent from './BottomSheetContent';
import useBottomSheet from '../../../hooks/useBottomSheet';

const BottomSheet = () => {
  const { sheet, content } = useBottomSheet();

  return (
    <div className='w-full max-w-[480px] fixed left-1/2 -translate-x-1/2 z-50 flex flex-col rounded-t-xl bg-white shadow-[0_0_5px_rgba(0,0,0,0.2)] touch-none' ref={sheet}>
      <BottomSheetHeader />
      <div ref={content} className='flex-1 overflow-y-auto [&::-webkit-scrollbar]:hidden'>
        <BottomSheetContent />
      </div>
    </div>
  );
};

export default BottomSheet;
