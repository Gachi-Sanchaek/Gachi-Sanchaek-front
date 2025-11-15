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
  aiRoute?: { lat: number; lng: number }[] | null;//루트 표시용
};

function MapRealtime({
  tracking,
  onStatsChange,
  onPathUpdate,
  width = "100%",
  height = 400,
  aiRoute,
}: MapRealtimeProps) {
  const el = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<kakao.maps.Map | null>(null);
  const lineRef = useRef<kakao.maps.Polyline | null>(null);
  const markerHandleRef = useRef<ReturnType<typeof createCurrentMarker> | null>(
    null
  );

  const watchId = useRef<number | null>(null);
  const pathRef = useRef<kakao.maps.LatLng[]>([]);
  const alertShownRef = useRef(false);

  useEffect(() => {
    if (!el.current || mapRef.current) return;

    const { kakao } = window;
    if (!kakao || !kakao.maps) return;

    kakao.maps.load(() => {
      if (!el.current || mapRef.current) return;

      const fallback = new kakao.maps.LatLng( //위치권한 없을때 가톨릭대
        37.485993139336074,
        126.80448486831264
      );
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

  //AI 경로 표시
  useEffect(() => {
    if (!aiRoute || !aiRoute.length) return;
    if (!mapRef.current) return;

    const { kakao } = window;

    const path = aiRoute.map(
      (p: { lat: number; lng: number }) => new kakao.maps.LatLng(p.lat, p.lng)
    );

    const aiLine = new kakao.maps.Polyline({
      path,
      strokeWeight: 6,
      strokeColor: "#BEF4D6", // 연한 연두색
      strokeOpacity: 0.6,
      strokeStyle: "solid",
    });

    aiLine.setMap(mapRef.current);

    return () => aiLine.setMap(null);
  }, [aiRoute]);

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
        () => {
          if (!alertShownRef.current) {
            alert("현재 위치를 불러올 수 없어 기본 위치로 표시됩니다.");
            console.log("위치 권한이 필요합니다.");
            alertShownRef.current = true;
          }
        },

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
