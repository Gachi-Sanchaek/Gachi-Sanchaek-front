import { useEffect, useRef, useState } from 'react';
import BottomSheet from '../components/SearchPage/BottomSheet/BottomSheet';
import Category from '../components/SearchPage/Category/Category';
import KakaoMap from '../components/SearchPage/KakaoMap';
import { CategoryStore } from '../store/CategoryStore';
import type { Place } from '../types/place';
import LocationInfoCard from '../components/SearchPage/LocationInfoCard';
import BottomButton from '../components/common/BottomButton';
import { useNavigate } from 'react-router-dom';

export default function SearchPage() {
  const navigate = useNavigate();
  const { selectedCategory } = CategoryStore();
  const [showBottomSheet, setShowBottomSheet] = useState(false);
  const [places, setPlaces] = useState<Place[]>([]);
  const [selectedPlace, setSelectedPlace] = useState<Place | null>(null);

  const mapRef = useRef<kakao.maps.Map | null>(null);
  const markersRef = useRef<kakao.maps.Marker[] | null>(null);

  const isAllowedCategory = selectedCategory === '산책' || selectedCategory === '플로깅';

  useEffect(() => {
    if (isAllowedCategory) {
      setShowBottomSheet(false);
      setSelectedPlace(null);
    } else {
      setShowBottomSheet(true);
    }
  }, [isAllowedCategory]);

  return (
    <div>
      {/* base layer */}
      <div>
        <Category />
        <KakaoMap selectedCategory={selectedCategory} setShowBottomSheet={setShowBottomSheet} setPlaces={setPlaces} setSelectedPlace={setSelectedPlace} mapRefExternal={mapRef} markersRefExternal={markersRef} />
      </div>
      {selectedPlace && !showBottomSheet && !isAllowedCategory && <LocationInfoCard place={selectedPlace} setSelectedPlace={setSelectedPlace} setShowBottomSheet={setShowBottomSheet} />}
      {showBottomSheet && <BottomSheet places={places} setSelectedPlace={setSelectedPlace} setShowBottomSheet={setShowBottomSheet} mapRef={mapRef} markersRef={markersRef} />}
      {!showBottomSheet && !selectedPlace && isAllowedCategory && (
        <div className='fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[480px] z-50'>
          <BottomButton
            buttons={[
              {
                text: '코스 추천 받기',
                variant: 'white',
                onClick: () => navigate('/walk'),
              },
              { text: '바로 산책 시작', variant: 'green', onClick: () => {} },
            ]}
          />
        </div>
      )}
    </div>
  );
}
