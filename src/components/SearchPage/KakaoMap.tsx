import { useEffect, useRef, useState } from 'react';
import type { Place } from '../../types/place';
import { getNearbyPlaces } from '../../apis/place';
import { markerType } from '../../utils/markerType';
import { keywordType } from '../../utils/placeKeywordType';

interface KakaoMapProps {
  initialLat?: number;
  initialLng?: number;
  initialLevel?: number;
  selectedCategory: string;
  setShowBottomSheet: React.Dispatch<React.SetStateAction<boolean>>;
  setPlaces: React.Dispatch<React.SetStateAction<Place[]>>;
  setSelectedPlace: React.Dispatch<React.SetStateAction<Place | null>>;
  mapRefExternal: React.RefObject<kakao.maps.Map | null>;
  markersRefExternal: React.RefObject<kakao.maps.Marker[] | null>;
}

const KakaoMap = ({ initialLat = 37.485993139336074, initialLng = 126.80448486831264, initialLevel = 3, selectedCategory, setShowBottomSheet, setPlaces, setSelectedPlace, mapRefExternal, markersRefExternal }: KakaoMapProps) => {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);

  const myLocationMarkerRef = useRef<kakao.maps.CustomOverlay | null>(null);

  // 지도에 표시 중인 마커 배열
  const markersRef = useRef<kakao.maps.Marker[]>([]);

  const [myLocation, setMyLocation] = useState<{ lat: number; lng: number } | null>(null);

  /* -------------------------------------------------------------
    1) 카카오맵 스크립트 로드 + 지도 최초 1회 생성
  -------------------------------------------------------------- */
  useEffect(() => {
    const loadKakaoMap = () => {
      const { kakao } = window;

      if (!mapContainerRef.current) return;

      // 지도 최초 생성
      if (!mapRefExternal.current) {
        const map = new kakao.maps.Map(mapContainerRef.current, {
          center: new kakao.maps.LatLng(initialLat, initialLng),
          level: initialLevel,
        });

        mapRefExternal.current = map;
      }
    };

    // 이미 로드된 경우
    if (window.kakao && window.kakao.maps) {
      window.kakao.maps.load(loadKakaoMap);
    } else {
      const script = document.createElement('script');
      script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${import.meta.env.VITE_KAKAO_MAP_KEY}&autoload=false`;
      script.async = true;
      document.head.appendChild(script);

      script.onload = () => window.kakao.maps.load(loadKakaoMap);
    }
  }, [initialLat, initialLng, initialLevel]);

  /* -------------------------------------------------------------
    2) 위치 권한 요청
  -------------------------------------------------------------- */
  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setMyLocation({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        });
      },
      () => {
        setMyLocation({
          lat: initialLat,
          lng: initialLng,
        });
      }
    );
  }, []);

  /* -------------------------------------------------------------
    3) 내 위치 마커 생성 함수
  -------------------------------------------------------------- */
  const createMyLocationMarker = (lat: number, lng: number) => {
    const { kakao } = window;
    const map = mapRefExternal.current;
    if (!map) return;

    const position = new kakao.maps.LatLng(lat, lng);

    const content = `
      <span class="relative flex h-4 w-4">
        <span class="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#5FD59B] opacity-75"></span>
        <span class="relative inline-flex h-4 w-4 rounded-full bg-[#5FD59B]"></span>
      </span>
    `;

    if (myLocationMarkerRef.current) {
      myLocationMarkerRef.current.setMap(null);
    }

    const overlay = new kakao.maps.CustomOverlay({
      position,
      content,
      yAnchor: 0.5,
    });

    overlay.setMap(map);
    myLocationMarkerRef.current = overlay;
  };

  /* -------------------------------------------------------------
    4) 내 위치가 준비되면 지도 이동 + 내 위치 마커 표시
  -------------------------------------------------------------- */
  useEffect(() => {
    if (!myLocation || !mapRefExternal.current) return;

    const { kakao } = window;
    const map = mapRefExternal.current;

    map.panTo(new kakao.maps.LatLng(myLocation.lat, myLocation.lng));
    createMyLocationMarker(myLocation.lat, myLocation.lng);
  }, [myLocation]);

  /* -------------------------------------------------------------
    5) 기관 마커 생성 함수
  -------------------------------------------------------------- */
  const createPlaceMarker = (place: Place) => {
    const { kakao } = window;
    const map = mapRefExternal.current;
    if (!map) return;

    const typeImgUrl = markerType(selectedCategory);

    // normal marker image
    const normalMarkerImg = typeImgUrl ? new kakao.maps.MarkerImage(typeImgUrl, new kakao.maps.Size(40, 40)) : undefined;

    // selected marker image
    const selectedMarkerImg = typeImgUrl ? new kakao.maps.MarkerImage(typeImgUrl, new kakao.maps.Size(50, 50)) : undefined;

    const marker = new kakao.maps.Marker({
      position: new kakao.maps.LatLng(place.latitude, place.longitude),
      image: normalMarkerImg,
    });

    marker.setMap(map);
    markersRef.current.push(marker);
    markersRefExternal.current = markersRef.current;

    // 클릭 이벤트
    kakao.maps.event.addListener(marker, 'click', () => {
      // 기존 모든 마커를 normal 이미지로
      markersRef.current.forEach((m) => {
        m.setImage(normalMarkerImg || '');
      });

      // 현재 클릭된 마커만 selected 이미지로
      marker.setImage(selectedMarkerImg || '');

      map.panTo(marker.getPosition());

      setSelectedPlace(place);
      setShowBottomSheet(false);
    });
  };

  /* -------------------------------------------------------------
    6) category + myLocation 변경 시 API 호출 + 마커 재생성
  -------------------------------------------------------------- */
  useEffect(() => {
    if (!myLocation) return;

    const isValidCategory = selectedCategory === '동행 산책' || selectedCategory === '유기견 산책';

    if (!isValidCategory) {
      // ❗ 카테고리가 다른 값이면 마커 삭제만 하고 종료
      markersRef.current.forEach((m) => m.setMap(null));
      markersRef.current = [];
      markersRefExternal.current = [];
      setPlaces([]);
      return;
    }

    const params = {
      lat: myLocation.lat,
      lng: myLocation.lng,
      radius: 10000,
      type: keywordType(selectedCategory),
    };

    const fetchPlaces = async () => {
      try {
        const res = await getNearbyPlaces(params);
        const data = res?.data || [];

        // 리스트 저장
        setPlaces(data);

        // 기존 마커 제거
        markersRef.current.forEach((m) => m.setMap(null));
        markersRef.current = [];
        markersRefExternal.current = [];

        // 새 마커 생성
        data.forEach((place) => createPlaceMarker(place));
      } catch (err) {
        console.error('기관 데이터 로드 오류:', err);
      }
    };

    fetchPlaces();
  }, [myLocation, selectedCategory]);

  /* -------------------------------------------------------------
    7) UI
  -------------------------------------------------------------- */
  return (
    <div className='relative w-full h-[calc(100dvh-48px)]'>
      <div ref={mapContainerRef} className='w-full h-full' />
    </div>
  );
};

export default KakaoMap;
