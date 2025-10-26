import BottomSheetHeader from '../../components/SearchPage/BottomSheet/BottomSheetHeader';
import BottomSheetContent from '../../components/SearchPage/BottomSheet/BottomSheetContent';
import { BOTTOM_SHEET_HEIGHT } from '../../constant/BottomSheet';

export default function MapPage() {
  return (
    // base layer
    // <div>
    //   <Category />
    //   {/* 지도 */}
    // </div>

    // bottom sheet
    <div
      className='w-full max-w-[480px] fixed bottom-0 z-50 flex flex-col rounded-t-xl bg-white shadow-[0_0_5px_rgba(0,0,0,0.2)]'
      style={{
        height: `${BOTTOM_SHEET_HEIGHT}px`,
      }}
    >
      <BottomSheetHeader />
      <BottomSheetContent />
    </div>
  );
}
