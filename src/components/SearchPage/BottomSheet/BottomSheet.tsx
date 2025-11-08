import BottomSheetHeader from './BottomSheetHeader';
import BottomSheetContent from './BottomSheetContent';
import useBottomSheet from '../../../hooks/useBottomSheet';
import type { Place } from '../../../types/place';

interface BottomSheetProps {
  places: Place[];
  setSelectedPlace: React.Dispatch<React.SetStateAction<Place | null>>;
  setShowBottomSheet: React.Dispatch<React.SetStateAction<boolean>>;
  mapRef: React.RefObject<kakao.maps.Map | null>;
  markersRef: React.RefObject<kakao.maps.Marker[] | null>;
}

const BottomSheet = ({ places, setSelectedPlace, setShowBottomSheet, mapRef, markersRef }: BottomSheetProps) => {
  const { sheet, content } = useBottomSheet();

  return (
    <div className='w-full max-w-[480px] fixed left-1/2 -translate-x-1/2 z-50 flex flex-col rounded-t-xl bg-white shadow-[0_0_5px_rgba(0,0,0,0.2)] touch-none' ref={sheet}>
      <BottomSheetHeader />
      <div ref={content} className='flex-1 overflow-y-auto [&::-webkit-scrollbar]:hidden'>
        <BottomSheetContent places={places} setSelectedPlace={setSelectedPlace} setShowBottomSheet={setShowBottomSheet} mapRef={mapRef} markersRef={markersRef} />
      </div>
    </div>
  );
};

export default BottomSheet;
