import { useEffect, useRef, useState } from "react";
import axios from "axios";
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

type LatLng = { lat: number; lng: number };

type MapRealtimeProps = {
  tracking: boolean;
  onStatsChange?: (s: { distanceKm: number }) => void;
  onPathUpdate?: (path: { lat: number; lng: number }[]) => void;
  width?: string | number;
  height?: string | number;
  aiRoute?: LatLng[] | null; //AI 추천 경로
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
  const lineRef = useRef<kakao.maps.Polyline | null>(null); // 실시간 이동 경로
  const markerHandleRef = useRef<ReturnType<typeof createCurrentMarker> | null>(
    null
  );

  const watchId = useRef<number | null>(null);
  const pathRef = useRef<kakao.maps.LatLng[]>([]);
  const alertShownRef = useRef(false);

  const aiLineRef = useRef<kakao.maps.Polyline | null>(null); //AI 경로 선
  const [mapReady, setMapReady] = useState(false); 

  //지도 초기화
  useEffect(() => {
    if (!el.current || mapRef.current) return;

    const { kakao } = window;
    if (!kakao || !kakao.maps) return;

    kakao.maps.load(() => {
      if (!el.current || mapRef.current) return;

      //가톨릭대
      const fallback = new kakao.maps.LatLng(
        37.485993139336074,
        126.80448486831264
      );

      const map = new kakao.maps.Map(el.current, {
        center: fallback,
        level: 3,
      });
      mapRef.current = map;

      //실시간 경로 polyline
      const line = new kakao.maps.Polyline({
        path: [],
        strokeWeight: 6,
        strokeColor: "#4ACF9A",
        strokeOpacity: 0.85,
        strokeStyle: "solid",
      });
      line.setMap(map);
      lineRef.current = line;

      //현재 위치 마커
      markerHandleRef.current = createCurrentMarker(map, fallback);

      setMapReady(true);
    });

    //언마운트
    return () => {
      if (watchId.current !== null) {
        navigator.geolocation.clearWatch(watchId.current);
      }
      if (markerHandleRef.current) {
        removeCurrentMarker(markerHandleRef.current);
        markerHandleRef.current = null;
      }
      if (aiLineRef.current) {
        aiLineRef.current.setMap(null);
        aiLineRef.current = null;
      }
    };
  }, []);

  //AI 경로 표시
  useEffect(() => {
    const { kakao } = window;
    if (!mapReady || !mapRef.current || !kakao || !kakao.maps) return;
    if (!aiRoute || aiRoute.length < 2) return;

    const REST_KEY = import.meta.env.VITE_KAKAO_REST_API_KEY as
      | string
      | undefined;
    if (!REST_KEY) {
      console.warn("Kakao REST API KEY 없음");
      return;
    }

    const start = aiRoute[0];
    const end = aiRoute[aiRoute.length - 1];
    const mids = aiRoute.slice(1, -1);

    const body = {
      origin: { x: start.lng, y: start.lat },
      destination: { x: end.lng, y: end.lat },
      waypoints: mids.map((p) => ({ x: p.lng, y: p.lat })),
      priority: "TIME",
    };

    let cancelled = false;

    (async () => {
      try {
        const res = await axios.post(
          "https://apis-navi.kakaomobility.com/v1/waypoints/directions",
          body,
          {
            headers: {
              Authorization: `KakaoAK ${REST_KEY}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (cancelled) return;

        const route = res.data?.routes?.[0];
        if (!route) return;

        const path: kakao.maps.LatLng[] = [];

        route.sections?.forEach((sec: { roads?: { vertexes: number[] }[] }) => {
          sec.roads?.forEach((r: { vertexes: number[] }) => {
            const v = r.vertexes;
            for (let i = 0; i < v.length; i += 2) {
              path.push(new kakao.maps.LatLng(v[i + 1], v[i]));
            }
          });
        });

        if (path.length < 2) return;

        if (aiLineRef.current) {
          aiLineRef.current.setMap(null);
        }

        aiLineRef.current = new kakao.maps.Polyline({
          path,
          strokeWeight: 6,
          strokeColor: "#BEF4D6",
          strokeOpacity: 0.8,
          strokeStyle: "solid",
        });
        aiLineRef.current.setMap(mapRef.current);
      } catch (e) {
        console.warn("AI 경로 가져오기 실패", e);
      }
    })();

    return () => {
      cancelled = true;
      if (aiLineRef.current) {
        aiLineRef.current.setMap(null);
        aiLineRef.current = null;
      }
    };
  }, [aiRoute, mapReady]);

  //실시간 위치 추적
  useEffect(() => {
    const { kakao } = window;
    if (!mapReady || !kakao || !kakao.maps) return;
    if (!mapRef.current) return;

    const startWatch = () => {
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

    const stopWatch = () => {
      if (watchId.current !== null) {
        navigator.geolocation.clearWatch(watchId.current);
        watchId.current = null;
      }
    };

    if (tracking) startWatch();
    else stopWatch();

    return () => stopWatch();
  }, [tracking, mapReady, onStatsChange, onPathUpdate]);

  return <div ref={el} style={{ width, height }} />;
}

export default MapRealtime;