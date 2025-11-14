import { useEffect, useRef, useState } from "react";
import axios from "axios";

import {
  createCurrentMarker,
  updateCurrentMarker,
  removeCurrentMarker,
  type CurrentMarkerHandle,
} from "../../utils/map/current-marker";

type LatLng = { lat: number; lng: number };

interface MapRouteProps {
  waypoints: LatLng[]; //백엔드에서 받은 경유지
  height?: string | number; // 지도 높이
}

type Road = {
  vertexes: number[];
};

type Section = {
  roads?: Road[];
};

function MapRoute({ waypoints, height = 400 }: MapRouteProps) {
  const mapEl = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<kakao.maps.Map | null>(null); //지도객체 저장
  const lineRef = useRef<kakao.maps.Polyline | null>(null); //그려진 폴리라인 객체 저장

  const currentRef = useRef<CurrentMarkerHandle | null>(null);
  const watchIdRef = useRef<number | null>(null); //위치만 갱신

  const [mapReady, setMapReady] = useState(false);
  const restKeyRef = useRef(import.meta.env.VITE_KAKAO_REST_API_KEY);

  //현재위치 받아오기
  const getCurrentLatLng = (): Promise<LatLng> =>
    new Promise((resolve) => {
      if (!navigator.geolocation) {
        return resolve({ lat: 37.485993139336074, lng: 126.80448486831264 });
      }
      navigator.geolocation.getCurrentPosition(
        (pos) =>
          resolve({
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
          }),
        () => resolve({ lat: 37.485993139336074, lng: 126.80448486831264 })
      );
    });

  //지도 초기화
  useEffect(() => {
    if (!mapEl.current) return;
    if (typeof kakao === "undefined") return;

    kakao.maps.load(async () => {
      const cur = await getCurrentLatLng();

      const center = new kakao.maps.LatLng(cur.lat, cur.lng);

      const map = new kakao.maps.Map(mapEl.current!, {
        center,
        level: 4,
      });
      mapRef.current = map;
      setMapReady(true);

      const pos = new kakao.maps.LatLng(cur.lat, cur.lng);
      currentRef.current = createCurrentMarker(map, pos);

      if (navigator.geolocation) {
        watchIdRef.current = navigator.geolocation.watchPosition(
          (p) => {
            const latlng = new kakao.maps.LatLng(
              p.coords.latitude,
              p.coords.longitude
            );
            if (currentRef.current) {
              updateCurrentMarker(currentRef.current, latlng);
            }
          },
          () => {},
          { enableHighAccuracy: true, maximumAge: 0, timeout: 10000 }
        );
      }
    });

    //언마운트 정리
    return () => {
      if (watchIdRef.current !== null) {
        navigator.geolocation.clearWatch(watchIdRef.current);
      }
      if (currentRef.current) {
        removeCurrentMarker(currentRef.current);
      }
    };
  }, []);

  //경로 그리기
  useEffect(() => {
    if (!mapReady) return;
    if (!waypoints || waypoints.length < 2) return;

    const map = mapRef.current;
    if (!map) return;

    //기존 polyline 제거
    if (lineRef.current) {
      lineRef.current.setMap(null);
      lineRef.current = null;
    }

    //다중 경유지 길찾기 호출
    const REST_KEY = restKeyRef.current;
    const fetchRoute = async () => {
      if (!REST_KEY) return null;

      const start = waypoints[0];
      const dest = waypoints[waypoints.length - 1];
      const mids = waypoints.slice(1, -1);

      const body = {
        origin: { x: start.lng, y: start.lat },
        destination: { x: dest.lng, y: dest.lat },
        waypoints: mids.map((p) => ({ x: p.lng, y: p.lat })),
        priority: "TIME",
      };

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

        const route = res.data?.routes?.[0];
        if (!route) return null;

        const path: kakao.maps.LatLng[] = [];
        route.sections?.forEach((sec: Section) => {
          sec.roads?.forEach((r: Road) => {
            const v = r.vertexes;
            for (let i = 0; i < v.length; i += 2) {
              path.push(new kakao.maps.LatLng(v[i + 1], v[i]));
            }
          });
        });

        return path.length >= 2 ? path : null;
      } catch {
        return null;
      }
    };

    const draw = (path: kakao.maps.LatLng[]) => {
      lineRef.current = new kakao.maps.Polyline({
        path,
        strokeWeight: 6,
        strokeColor: "#5FD59B",
        strokeOpacity: 0.9,
        strokeStyle: "solid",
      });
      lineRef.current?.setMap(map);

      //전체확인용 지도 영역 맞추기
      const bounds = new kakao.maps.LatLngBounds();
      path.forEach((p) => bounds.extend(p));
      map.relayout();//지도 크기 다시 계산
      map.setBounds(bounds, 24, 24, 24, 24); //상하좌우 여백
    };

    (async () => {
      const route = await fetchRoute();

      if (route) draw(route);
      else {
        const fallback = waypoints.map(
          (p) => new kakao.maps.LatLng(p.lat, p.lng)
        );
        draw(fallback);
      }
    })();
  }, [mapReady, waypoints]);

  return <div ref={mapEl} className="w-full" style={{ height }} />;
}

export default MapRoute;
