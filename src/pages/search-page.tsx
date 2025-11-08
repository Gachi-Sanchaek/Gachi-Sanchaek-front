import { useEffect, useRef, useState } from 'react';
import BottomSheet from '../components/SearchPage/BottomSheet/BottomSheet';
import Category from '../components/SearchPage/Category/Category';
import KakaoMap from '../components/SearchPage/KakaoMap';
import { useCategoryStore } from '../store/useCategoryStore';
import type { Place } from '../types/place';
import LocationInfoCard from '../components/SearchPage/LocationInfoCard';

export default function SearchPage() {
  const { selectedCategory } = useCategoryStore();
  const [showBottomSheet, setShowBottomSheet] = useState(false);
  const [places, setPlaces] = useState<Place[]>([]);
  const [selectedPlace, setSelectedPlace] = useState<Place | null>(null);

  const mapRef = useRef<kakao.maps.Map | null>(null);
  const markersRef = useRef<kakao.maps.Marker[] | null>(null);

  useEffect(() => {
    if (selectedCategory === '산책' || selectedCategory === '플로깅') {
      setShowBottomSheet(false);
    } else {
      setShowBottomSheet(true);
    }
  }, [selectedCategory]);

  return (
    <div>
      {/* base layer */}
      <div>
        <Category />
        <KakaoMap selectedCategory={selectedCategory} setShowBottomSheet={setShowBottomSheet} setPlaces={setPlaces} setSelectedPlace={setSelectedPlace} mapRefExternal={mapRef} markersRefExternal={markersRef} />
      </div>
      {selectedPlace && !showBottomSheet && <LocationInfoCard place={selectedPlace} setSelectedPlace={setSelectedPlace} setShowBottomSheet={setShowBottomSheet} />}
      {showBottomSheet && <BottomSheet places={places} setSelectedPlace={setSelectedPlace} setShowBottomSheet={setShowBottomSheet} mapRef={mapRef} markersRef={markersRef} />}
    </div>
  );
}
