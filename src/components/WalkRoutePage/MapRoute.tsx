import { useEffect, useRef } from "react";
import axios from "axios";

type LatLng = { lat: number; lng: number };

interface MapRouteProps {
  waypoints: LatLng[]; //백엔드에서 받은 경유지
  priority?: "TIME" | "DISTANCE"; // 기본 TIME 거리는임시
  height?: number; // 지도 높이
}

function MapRoute({
  waypoints,
  priority = "TIME",
  height = 400,
}: MapRouteProps) {
  const mapEl = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<any>(null);
  const lineRef = useRef<any>(null);

  //지도 초기화
  useEffect(() => {
    const { kakao } = window as any;
    if (!kakao || !mapEl.current) return;

    kakao.maps.load(() => {
      // 초기 중심 -> 첫 웨이포인트가 있으면 그쪽 없으면 현재위치로 수정하기
      const center = waypoints?.length
        ? new kakao.maps.LatLng(waypoints[0].lat, waypoints[0].lng)
        : //지금은 시청
          new kakao.maps.LatLng(37.5665, 126.978);

      mapRef.current = new kakao.maps.Map(mapEl.current, {
        center,
        level: 5,
      });
    });
  }, []);

  //경로 그리기
  useEffect(() => {
    const { kakao } = window as any;
    const map = mapRef.current;
    if (!map || !waypoints || waypoints.length < 2) return;

    // 기존 선 제거
    if (lineRef.current) {
      lineRef.current.setMap(null);
      lineRef.current = null;
    }

    const REST_KEY = import.meta.env.VITE_KAKAO_REST_API_KEY as
      | string
      | undefined;

    //카카오모빌리티 다중 경유지 길찾기 호출
    const fetchRoute = async () => {
      if (!REST_KEY) throw new Error("NO_REST_KEY");

      const start = waypoints[0];
      const dest = waypoints[waypoints.length - 1];
      const mids = waypoints.slice(1, -1);

      // API x=lng, y=lat
      const body = {
        origin: { x: start.lng, y: start.lat },
        destination: { x: dest.lng, y: dest.lat },
        waypoints: mids.map((p) => ({ x: p.lng, y: p.lat })),
        priority, // "TIME" | "DISTANCE"
      };

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
      if (!route) throw new Error("NO_ROUTE");

      const path: any[] = [];
      route.sections?.forEach((sec: any) => {
        sec.roads?.forEach((r: any) => {
          const v = r.vertexes as number[];
          for (let i = 0; i < v.length; i += 2) {
            const lng = v[i];
            const lat = v[i + 1];
            path.push(new kakao.maps.LatLng(lat, lng)); // lat,lng로 뒤집기
          }
        });
      });

      if (path.length < 2) throw new Error("PARSE_FAIL");
      return path;
    };

    const draw = (path: any[]) => {
      const { kakao } = window as any;
      lineRef.current = new kakao.maps.Polyline({
        path,
        strokeWeight: 6,
        strokeColor: "#5FD59B",
        strokeOpacity: 0.9,
        strokeStyle: "solid",
      });
      lineRef.current.setMap(map);

      //전체확인 영역 맞추기
      const bounds = new kakao.maps.LatLngBounds();
      path.forEach((p) => bounds.extend(p));
      map.setBounds(bounds, 24, 24, 24, 24);
    };

    (async () => {
      try {
        const roadPath = await fetchRoute();
        draw(roadPath);
      } catch (e) {
        console.warn("[KakaoMobility] 실패 → 직선 폴백", e);

        //안되면 단순 웨이포인트 연결(임시)
        const straight = waypoints.map(
          (p) => new kakao.maps.LatLng(p.lat, p.lng)
        );
        draw(straight);
      }
    })();
  }, [waypoints, priority]);

  return <div ref={mapEl} className="w-full" style={{ height }} />;
}

export default MapRoute;
