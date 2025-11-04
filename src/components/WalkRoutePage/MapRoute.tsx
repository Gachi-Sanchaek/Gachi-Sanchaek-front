import { useEffect, useRef } from "react";

type LatLng = { lat: number; lng: number };

interface MapRouteProps {
  waypoints: LatLng[];
  height?: number;
}

function MapRoute({ waypoints, height = 360 }: MapRouteProps) {
  const mapRef = useRef<HTMLDivElement | null>(null);
  const kakaoMapRef = useRef<any>(null);
  const polylineRef = useRef<any>(null);
  const startMarkerRef = useRef<any>(null);

  useEffect(() => {
    const { kakao } = window as any;
    if (!mapRef.current || !kakao) return;

    kakao.maps.load(() => {
      const center = new kakao.maps.LatLng(37.5665, 126.978); // 초기 중심(서울 시청)
      kakaoMapRef.current = new kakao.maps.Map(mapRef.current, {
        center,
        level: 5,
      });
    });
  }, []);

  useEffect(() => {
    const { kakao } = window as any;
    const map = kakaoMapRef.current;
    if (!map || !waypoints || waypoints.length < 2) return;

    if (polylineRef.current) polylineRef.current.setMap(null);
    if (startMarkerRef.current) startMarkerRef.current.setMap(null);

    const path = waypoints.map((p) => new kakao.maps.LatLng(p.lat, p.lng));

    startMarkerRef.current = new kakao.maps.Marker({
      position: path[0],
    });
    startMarkerRef.current.setMap(map);

    polylineRef.current = new kakao.maps.Polyline({
      path,
      strokeWeight: 6,
      strokeColor: "#5FD59B",
      strokeOpacity: 0.9,
      strokeStyle: "solid",
    });
    polylineRef.current.setMap(map);

    const bounds = new kakao.maps.LatLngBounds();
    path.forEach((pos: any) => bounds.extend(pos));
    map.setBounds(bounds, 24, 24, 24, 24);
  }, [waypoints]);

  return <div ref={mapRef} className="w-full" style={{ height }} />;
}

export default MapRoute;
