import { useEffect, useRef } from "react";
import {
  createCurrentMarker,
  updateCurrentMarker,
  removeCurrentMarker,
} from "../../utils/map/current-marker";

declare global {
  interface Window {
    kakao: typeof kakao;
  }
}

type MapRealtimeProps = {
  tracking: boolean;
  onStatsChange?: (s: { distanceKm: number }) => void;
  onPathUpdate?: (path: { lat: number; lng: number }[]) => void;
  width?: string | number;
  height?: string | number;
};

function MapRealtime({
  tracking,
  onStatsChange,
  onPathUpdate,
  width = "100%",
  height = 400,
}: MapRealtimeProps) {
  const el = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<kakao.maps.Map | null>(null);
  const lineRef = useRef<kakao.maps.Polyline | null>(null);
  const markerHandleRef = useRef<ReturnType<typeof createCurrentMarker> | null>(
    null
  );

  const watchId = useRef<number | null>(null);
  const pathRef = useRef<kakao.maps.LatLng[]>([]);

  useEffect(() => {
    if (!el.current || mapRef.current) return;

    const { kakao } = window;
    if (!kakao || !kakao.maps) return;

    kakao.maps.load(() => {
      if (!el.current || mapRef.current) return;

      const fallback = new kakao.maps.LatLng(37.4863, 126.825); //가톨릭대
      const map = new kakao.maps.Map(el.current, {
        center: fallback,
        level: 3,
      });
      mapRef.current = map;

      const line = new kakao.maps.Polyline({
        path: [],
        strokeWeight: 6,
        strokeColor: "#4ACF9A",
        strokeOpacity: 0.85,
        strokeStyle: "solid",
      });
      line.setMap(map);
      lineRef.current = line;

      markerHandleRef.current = createCurrentMarker(map, fallback);
    });

    //언마운트
    return () => {
      if (markerHandleRef.current) {
        removeCurrentMarker(markerHandleRef.current);
        markerHandleRef.current = null;
      }
    };
  }, []);

  //실시간 위치추적
  useEffect(() => {
    const { kakao } = window;
    if (!kakao || !kakao.maps) return;
    if (!mapRef.current) return;

    const start = () => {
      if (!("geolocation" in navigator)) return;

      watchId.current = navigator.geolocation.watchPosition(
        (pos) => {
          const { latitude, longitude } = pos.coords;
          const ll = new kakao.maps.LatLng(latitude, longitude);

          pathRef.current = [...pathRef.current, ll];
          lineRef.current?.setPath(pathRef.current);

          if (markerHandleRef.current) {
            updateCurrentMarker(markerHandleRef.current, ll);
          }

          mapRef.current?.setCenter(ll);

          const m = lineRef.current?.getLength() ?? 0;
          const km = Math.round((m / 1000) * 100) / 100;
          onStatsChange?.({ distanceKm: km });

          onPathUpdate?.(
            pathRef.current.map((p) => ({ lat: p.getLat(), lng: p.getLng() }))
          );
        },
        () => console.log("위치 권한이 필요합니다."),
        { enableHighAccuracy: true, maximumAge: 1000, timeout: 3000 }
      );
    };

    const stop = () => {
      if (watchId.current !== null) {
        navigator.geolocation.clearWatch(watchId.current);
        watchId.current = null;
      }
    };

    if (tracking) start();
    else stop();

    return () => stop();
  }, [tracking, onStatsChange, onPathUpdate]);

  return <div ref={el} style={{ width, height }} />;
}

export default MapRealtime;
