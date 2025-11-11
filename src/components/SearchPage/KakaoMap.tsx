import { useEffect, useRef, useState } from 'react';
// import { createRoot } from 'react-dom/client';
import type { Place } from '../../types/place';
import { getNearbyPlaces } from '../../apis/place';
import { markerType } from '../../utils/markerType';
import { keywordType } from '../../utils/placeKeywordType';

interface KakaoMapProps {
  initialLat?: number;
  initialLng?: number;
  initialLevel?: number; //지도 확대 레벨
  selectedCategory: string;
  setShowBottomSheet: React.Dispatch<React.SetStateAction<boolean>>;
  setPlaces: React.Dispatch<React.SetStateAction<Place[]>>;
  setSelectedPlace: React.Dispatch<React.SetStateAction<Place | null>>;
  mapRefExternal: React.RefObject<kakao.maps.Map | null>;
  markersRefExternal: React.RefObject<kakao.maps.Marker[] | null>;
}

const KakaoMap = ({ initialLat = 37.485993139336074, initialLng = 126.80448486831264, initialLevel = 3, selectedCategory, setShowBottomSheet, setPlaces, setSelectedPlace, mapRefExternal, markersRefExternal }: KakaoMapProps) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const markersRef = useRef<kakao.maps.Marker[]>([]);
  const [myLocation, setMyLocation] = useState<{ lat: number; lng: number } | null>(null);

  useEffect(() => {
    const loadMap = async () => {
      if (!mapRef.current) return;
      const { kakao } = window;

      // 지도 객체 생성
      const map = new kakao.maps.Map(mapRef.current, {
        center: new kakao.maps.LatLng(initialLat, initialLng),
        level: initialLevel,
      });

      if (mapRefExternal) mapRefExternal.current = map;

      markersRef.current = [];

      // 내위치 마커 생성
      const createMyLocationMarker = (lat: number, lng: number) => {
        // 내위치 좌표
        const position = new kakao.maps.LatLng(lat, lng);

        // 커스텀 마커핀
        const content = `
    <span class="relative flex h-4 w-4">
      <span class="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#5FD59B] opacity-75"></span>
      <span class="relative inline-flex h-4 w-4 rounded-full bg-[#5FD59B]"></span>
    </span>
  `;

        const overlay = new kakao.maps.CustomOverlay({
          position,
          content,
          yAnchor: 0.5, // 마커 기준점을 가운데로 위치
        });

        overlay.setMap(map);
      };

      // 위치 권한 허용
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          // 허용 시, 현재 위치 정보 가져오기
          (pos) => {
            createMyLocationMarker(pos.coords.latitude, pos.coords.longitude);
            map.setCenter(new kakao.maps.LatLng(pos.coords.latitude, pos.coords.longitude));
            setMyLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude });
          },
          // 허용 안할 시, 초기값으로 위치 설정
          () => {
            createMyLocationMarker(initialLat, initialLng);
            map.setCenter(new kakao.maps.LatLng(initialLat, initialLng));
            setMyLocation({ lat: initialLat, lng: initialLng });
          }
        );
      }
      // 에러 발생 시, 초기값으로 위치 설정
      else {
        createMyLocationMarker(initialLat, initialLng);
        map.setCenter(new kakao.maps.LatLng(initialLat, initialLng));
        setMyLocation({ lat: initialLat, lng: initialLng });
      }

      // 기관 마커 생성
      const createPlaceMarker = (place: Place) => {
        const type = markerType(selectedCategory);
        // 기본 마커
        const normalMarker = type ? new kakao.maps.MarkerImage(type, new kakao.maps.Size(40, 40)) : undefined;
        // 선택한 마커
        const selectedMarker = type ? new kakao.maps.MarkerImage(type, new kakao.maps.Size(50, 50)) : undefined;

        const marker = new kakao.maps.Marker({
          position: new kakao.maps.LatLng(place.latitude, place.longitude),
          image: normalMarker,
        });

        marker.setMap(map);

        // 마커를 배열에 저장
        markersRef.current.push(marker);

        if (markersRefExternal) {
          markersRefExternal.current = markersRef.current;
        }

        // 마커 클릭 시 오버레이 생성
        kakao.maps.event.addListener(marker, 'click', () => {
          markersRef.current.forEach((m) => m.setImage(normalMarker || ''));
          marker.setImage(selectedMarker || ''); // 선택한 마커의 크기 확대
          map.panTo(marker.getPosition()); // 마커 위치로 이동

          setSelectedPlace(place);
          setShowBottomSheet(false);
        });

        return marker;
      };

      const isValidCategory = selectedCategory === '동행 산책' || selectedCategory === '유기견 산책';
      const params = {
        lat: myLocation?.lat || initialLat,
        lng: myLocation?.lng || initialLng,
        radius: 5000,
        type: keywordType(selectedCategory),
      };

      if (isValidCategory) {
        try {
          const data = await getNearbyPlaces(params);
          console.log('근처 기관 데이터:', data);
          setPlaces(data?.result || []);
          data?.result.forEach(createPlaceMarker);
        } catch (e) {
          console.error('getNearbyPlaces api error', e);
        }
      }
    };

    // 이미 로드된 경우
    if (window.kakao && window.kakao.maps) {
      window.kakao.maps.load(loadMap);
    }
    // 아직 로드되지 않은 경우
    else {
      const script = document.createElement('script');
      script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${import.meta.env.VITE_KAKAO_MAP_KEY}&autoload=false`;
      script.async = true;
      document.head.appendChild(script);

      script.onload = () => window.kakao.maps.load(loadMap);
    }
  }, [initialLat, initialLng, initialLevel, selectedCategory, myLocation?.lat, myLocation?.lng, setPlaces, setSelectedPlace, setShowBottomSheet, mapRefExternal, markersRefExternal]);

  return (
    <div className='relative w-full h-[calc(100dvh-48px)]'>
      <div ref={mapRef} className='w-full h-full' />
    </div>
  );
};

export default KakaoMap;
