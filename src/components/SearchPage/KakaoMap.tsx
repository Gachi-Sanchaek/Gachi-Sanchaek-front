import { useEffect, useRef, useState } from 'react';
import WelfareCenter from '/assets/welfare-center-pin.png';
import AnimalShelter from '/assets/animal-shelter-pin.png';
import { createRoot } from 'react-dom/client';
import LocationInfoCard from './LocationInfoCard';
import type { Place } from '../../types/place';
import { getNearbyPlaces } from '../../apis/place';

interface KakaoMapProps {
  initialLat?: number;
  initialLng?: number;
  initialLevel?: number; //지도 확대 레벨
  selectedCategory: string;
}

// 마커 타입 반환
const markerType = (category: string) => {
  switch (category) {
    case '동행 산책':
      return WelfareCenter;
    case '유기견 산책':
      return AnimalShelter;
    default:
      return undefined;
  }
};
const keywordType = (category: string) => {
  switch (category) {
    case '동행 산책':
      return '복지관';
    case '유기견 산책':
      return '보호센터';
    default:
      return '';
  }
};

const KakaoMap = ({ initialLat = 37.485993139336074, initialLng = 126.80448486831264, initialLevel = 3, selectedCategory }: KakaoMapProps) => {
  const mapRef = useRef<HTMLDivElement>(null);
  // 내 위치 마커
  let myLocationMarker: kakao.maps.Marker | null = null;
  // 팝업 오버레이
  let activeOverlay: kakao.maps.CustomOverlay | null = null;
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

      // 일반 마커 생성
      const createMarker = (lat: number, lng: number, imageUrl?: string, size: number = 28, isMyLocation: boolean = false) => {
        const markerImage = imageUrl ? new kakao.maps.MarkerImage(imageUrl, new kakao.maps.Size(size, size)) : undefined;

        const marker = new kakao.maps.Marker({
          position: new kakao.maps.LatLng(lat, lng),
          image: markerImage,
        });

        marker.setMap(map);

        // 내 위치 업데이트
        if (isMyLocation) {
          if (myLocationMarker) myLocationMarker.setMap(null);
          myLocationMarker = marker;
        }
      };

      // 기관 마커 생성
      const createPlaceMarker = (place: Place) => {
        const type = markerType(selectedCategory);
        const marker = new kakao.maps.Marker({
          position: new kakao.maps.LatLng(place.latitude, place.longitude),
          image: type,
        });

        marker.setMap(map);

        // 마커 클릭 시 오버레이 생성
        kakao.maps.event.addListener(marker, 'click', () => {
          if (activeOverlay) activeOverlay.setMap(null);

          const container = document.createElement('div');
          const root = createRoot(container);

          const overlay = new kakao.maps.CustomOverlay({
            content: container,
            position: new kakao.maps.LatLng(place.latitude, place.longitude),
            yAnchor: 1,
          });

          root.render(<LocationInfoCard location={place.name} address={place.address} phoneNum={place.phone} />);

          overlay.setMap(map);
          activeOverlay = overlay;
        });
      };

      // 내 위치 중심 이동 및 마커 표시
      // const handleLocation = (lat: number, lng: number) => {
      //   createMarker(lat, lng, markerType(selectedCategory), 40, true);
      //   map.setCenter(new kakao.maps.LatLng(lat, lng));
      //   setMyLocation({ lat, lng });
      // };

      // 실제 내 위치 기반 지도 중심 재설정
      // if (navigator.geolocation) {
      //   navigator.geolocation.getCurrentPosition(
      //     (pos) => handleLocation(pos.coords.latitude, pos.coords.longitude),
      //     () => handleLocation(initialLat, initialLng)
      //   );
      // } else {
      //   handleLocation(initialLat, initialLng);
      // }
    };

    const isValidCategory = selectedCategory === '동행 산책' || selectedCategory === '유기견 산책';
    const params = {
      lat: myLocation?.lat || initialLat,
      lng: myLocation?.lng || initialLng,
      radius: 5000,
      keyword: keywordType(selectedCategory),
    };

    if (isValidCategory) {
      (async () => {
        try {
          const data = await getNearbyPlaces(params);
          console.log('근처 기관 데이터:', data);
        } catch (e) {
          console.error('getNearbyPlaces api error', e);
        }
      })();
    }

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
  }, [initialLat, initialLng, initialLevel, selectedCategory]);

  return <div ref={mapRef} className='w-full h-[calc(100dvh-48px)]' />;
};

export default KakaoMap;
