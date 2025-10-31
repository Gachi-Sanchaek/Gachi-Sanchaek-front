import { useEffect, useRef } from 'react';

interface KakaoMapProps {
  initialLat?: number;
  initialLng?: number;
  initialLevel?: number; //지도 확대 레벨
  // selectedCategory: '산책' | '동행 산책' | '유기견 산책' | '플로깅';
}

const KakaoMap = ({ initialLat = 37.485993139336074, initialLng = 126.80448486831264, initialLevel = 3 }: KakaoMapProps) => {
  const mapRef = useRef<HTMLDivElement>(null);

  // 내 위치 마커
  // let myLocationMarker: kakao.maps.Marker | null = null;

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
          },
          // 허용 안할 시, 초기값으로 위치 설정
          () => {
            createMyLocationMarker(initialLat, initialLng);
            map.setCenter(new kakao.maps.LatLng(initialLat, initialLng));
          }
        );
      }
      // 에러 발생 시, 초기값으로 위치 설정
      else {
        createMyLocationMarker(initialLat, initialLng);
        map.setCenter(new kakao.maps.LatLng(initialLat, initialLng));
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
  }, [initialLat, initialLng, initialLevel]);

  return <div ref={mapRef} className='w-full h-[calc(100dvh-48px)]' />;
};

export default KakaoMap;
