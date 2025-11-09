import { CategoryStore } from '../../store/CategoryStore';
import type { Place } from '../../types/place';
import { markerType } from '../../utils/markerType';
import Location from '/src/assets/location.svg';
import Phone from '/src/assets/phone.svg';

interface ListCardProps {
  place: Place;
  setSelectedPlace?: React.Dispatch<React.SetStateAction<Place | null>>;
  setShowBottomSheet?: React.Dispatch<React.SetStateAction<boolean>>;
  mapRef?: React.RefObject<kakao.maps.Map | null>;
  markersRef?: React.RefObject<kakao.maps.Marker[] | null>;
}

const ListCard = ({ place, setSelectedPlace, setShowBottomSheet, mapRef, markersRef }: ListCardProps) => {
  const { selectedCategory } = CategoryStore();

  const handleClickCard = () => {
    setSelectedPlace?.(place);
    setShowBottomSheet?.(false);

    // 리스트 카드 클릭 시 해당 위치를 지도 중심으로 이동
    if (mapRef?.current) {
      const { kakao } = window;
      const position = new kakao.maps.LatLng(place.latitude, place.longitude);
      mapRef.current.panTo(position);
    }

    // 리스트 카드 클릭 시 마커핀 이미지 크기 변경
    if (markersRef?.current && markersRef?.current.length) {
      const { kakao } = window;
      const type = markerType(selectedCategory);
      const normalMarker = type ? new kakao.maps.MarkerImage(type, new kakao.maps.Size(40, 40)) : undefined;
      const selectedMarker = type ? new kakao.maps.MarkerImage(type, new kakao.maps.Size(50, 50)) : undefined;

      // 좌표 오차 허용치
      const EPS = 1e-6;

      markersRef.current.forEach((marker) => {
        const pos = marker.getPosition();
        const lat = pos.getLat();
        const lng = pos.getLng();

        if (Math.abs(lat - place.latitude) < EPS && Math.abs(lng - place.longitude) < EPS) {
          marker.setImage(selectedMarker || '');
        } else {
          marker.setImage(normalMarker || '');
        }
      });
    }
  };

  return (
    <div className='w-full max-w-[480px] flex flex-col gap-0.5 px-6 py-3 border-b border-[#F5F5F5] select-none cursor-pointer' onClick={handleClickCard}>
      <p className='font-[PretendardVariable] font-semibold text-[14px]'>{place.name}</p>
      <div className='flex gap-1'>
        <img src={Location} alt='주소' />
        <p className='font-[PretendardVariable] font-normal text-[14px]'>{place.address ? place.address : '-'}</p>
      </div>
      <div className='flex gap-1'>
        <img src={Phone} alt='연락처' />
        <p className='font-[PretendardVariable] font-normal text-[14px]'>{place.phone ? place.phone : '-'}</p>
      </div>
    </div>
  );
};

export default ListCard;
