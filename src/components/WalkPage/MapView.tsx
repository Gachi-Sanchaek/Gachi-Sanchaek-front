import { useEffect, useRef } from "react";

export default function MapView() {
  const mapRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const { kakao } = window;
    if (!mapRef.current || !kakao) return;

    kakao.maps.load(() => {
      // 기본 중심으로맵 생성
      const map = new kakao.maps.Map(mapRef.current!, {
        center: new kakao.maps.LatLng(37.5665, 126.978),
        level: 5,
      });

      // 위치 허용시 현재 위치로 센터 이동
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (pos) => {
            const lat = pos.coords.latitude;
            const lng = pos.coords.longitude;
            const current = new kakao.maps.LatLng(lat, lng);
            map.setCenter(current);
          },
          // 에러 시
          () => {}
        );
      }
    });
  }, []);

  return <div ref={mapRef} className="w-full h-full" />;
}
