import type { Place } from '../../../types/place';
import ListCard from '../ListCard';
import NotFoundBongGong from '/src/assets/images/not_found_bonggong.png';

interface BottomSheetContentProps {
  places: Place[];
  setSelectedPlace: React.Dispatch<React.SetStateAction<Place | null>>;
  setShowBottomSheet: React.Dispatch<React.SetStateAction<boolean>>;
  mapRef: React.RefObject<kakao.maps.Map | null>;
  markersRef: React.RefObject<kakao.maps.Marker[] | null>;
}

const BottomSheetContent = ({ places, setSelectedPlace, setShowBottomSheet, mapRef, markersRef }: BottomSheetContentProps) => {
  return (
    <div className='pb-3 px-3'>
      {places.length > 0 ? (
        places.map((p) => <ListCard key={p.kakaoId} place={p} setSelectedPlace={setSelectedPlace} setShowBottomSheet={setShowBottomSheet} mapRef={mapRef} markersRef={markersRef} />)
      ) : (
        <div className='flex flex-col justify-center items-center'>
          <img src={NotFoundBongGong} alt='not_found_bonggong' className='w-25 h-25' />
          <p className='font-[pretendardVariable] text-sm text-gray-400'>근처에 관련 기관이 없습니다.</p>
        </div>
      )}
    </div>
  );
};

export default BottomSheetContent;
