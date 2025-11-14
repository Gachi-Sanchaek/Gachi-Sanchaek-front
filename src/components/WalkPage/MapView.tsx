import { useEffect, useRef } from "react";
import {
  createCurrentMarker,
  updateCurrentMarker,
  removeCurrentMarker,
  type CurrentMarkerHandle,
} from "../../utils/map/current-marker";

export default function MapView() {
  const mapRef = useRef<HTMLDivElement | null>(null);
  const markerRef = useRef<CurrentMarkerHandle | null>(null);
  const watchIdRef = useRef<number | null>(null);
  const alertShownRef = useRef(false); //위치권한 없음 알림

  useEffect(() => {
    const { kakao } = window;
    if (!mapRef.current || !kakao) return;

    kakao.maps.load(() => {
      //기본 중심으로맵 생성
      const defaultCenter = new kakao.maps.LatLng(
        37.485993139336074,
        126.80448486831264
      );
      const map = new kakao.maps.Map(mapRef.current!, {
        center: defaultCenter,
        level: 3,
      });
      //현재 위치 마커 맵에 올리기 + 위치 갱신
      const setAt = (lat: number, lng: number) => {
        const pos = new kakao.maps.LatLng(lat, lng);
        if (!markerRef.current) {
          markerRef.current = createCurrentMarker(map, pos); //생성
        } else {
          updateCurrentMarker(markerRef.current, pos); //위치만 갱신
        }
        map.setCenter(pos);
      };

      //위치 허용시 현재 위치로 센터 이동 + 추적
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (p) => setAt(p.coords.latitude, p.coords.longitude),
          () => {
            if (!alertShownRef.current) {
              alert("현재 위치를 불러올 수 없어 기본 위치로 표시됩니다.");
              alertShownRef.current = true;
            }
            setAt(defaultCenter.getLat(), defaultCenter.getLng());
          }
        );
        watchIdRef.current = navigator.geolocation.watchPosition((p) =>
          setAt(p.coords.latitude, p.coords.longitude)
        );
      } else {
        setAt(defaultCenter.getLat(), defaultCenter.getLng());
      }
    });

    return () => {
      if (watchIdRef.current !== null)
        navigator.geolocation.clearWatch(watchIdRef.current);
      if (markerRef.current) removeCurrentMarker(markerRef.current);
    };
  }, []);

  return <div ref={mapRef} className="w-full h-full" />;
}
