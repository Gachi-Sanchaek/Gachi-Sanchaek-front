import { useEffect, useRef } from "react";
import axios from "axios";
import CurrentMarker from "/src/assets/current-marker.svg";

type LatLng = { lat: number; lng: number };

interface MapRouteProps {
  waypoints: LatLng[]; //백엔드에서 받은 경유지
  height?: string | number; // 지도 높이
}

function MapRoute({ waypoints, height = 400 }: MapRouteProps) {
  const mapEl = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<kakao.maps.Map | null>(null); //지도객체 저장
  const lineRef = useRef<kakao.maps.Polyline | null>(null); //그려진 폴리라인 객체 저장
  const markerRef = useRef<kakao.maps.Marker | null>(null);

  //현재위치 받아오기
  const getCurrentLatLng = (): Promise<{ lat: number; lng: number }> =>
    new Promise((resolve) => {
      if (!navigator?.geolocation) {
        return resolve({ lat: 37.4863, lng: 126.825 }); //가톨릭대 정문
      }
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          resolve({
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
          });
        },
        () => resolve({ lat: 37.4863, lng: 126.825 }) // 권한 거부/오류
      );
    });

  //지도 초기화
  useEffect(() => {
    if (typeof kakao === "undefined" || !mapEl.current) return;

    const container = mapEl.current as HTMLDivElement;
    kakao.maps.load(async () => {
      const cur = await getCurrentLatLng();

      const center = new kakao.maps.LatLng(
        waypoints?.[0]?.lat || cur.lat,
        waypoints?.[0]?.lng || cur.lng
      );

      const map = new kakao.maps.Map(container, {
        center,
        level: 5,
      });
      mapRef.current = map;

      const imageSrc = CurrentMarker;
      const imageSize = new kakao.maps.Size(54, 54);
      const imageOption: kakao.maps.MarkerImageOptions = {
        offset: new kakao.maps.Point(27, 27),
      };
      const markerImage = new kakao.maps.MarkerImage(
        imageSrc,
        imageSize,
        imageOption
      );
      const markerPosition = new kakao.maps.LatLng(cur.lat, cur.lng);

      markerRef.current = new kakao.maps.Marker({
        position: markerPosition,
        image: markerImage,
      });
      markerRef.current?.setMap(map);
    });
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  //경로 그리기
  useEffect(() => {
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

    //다중 경유지 길찾기 호출
    const fetchRoute = async () => {
      if (!REST_KEY) throw new Error("NO_REST_KEY");

      const start = waypoints[0];
      const dest = waypoints[waypoints.length - 1];
      const mids = waypoints.slice(1, -1); //가운데 점들 경유지

      //x=lng y=lat
      const body = {
        origin: { x: start.lng, y: start.lat },
        destination: { x: dest.lng, y: dest.lat },
        waypoints: mids.map((p) => ({ x: p.lng, y: p.lat })),
        priority: "TIME",
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

      const path: kakao.maps.LatLng[] = [];
      route.sections?.forEach((sec: { roads?: { vertexes: number[] }[] }) => {
        sec.roads?.forEach((r: { vertexes: number[] }) => {
          const v = r.vertexes;
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
      map.setBounds(bounds, 24, 24, 24, 24); //상하좌우 여백
    };

    (async () => {
      try {
        const roadPath = await fetchRoute();
        draw(roadPath);
      } catch (e) {
        console.warn("KakaoMobility 실패 → 직선 폴백", e);

        //연결실패시 단순 웨이포인트 연결(임시)
        const straight = waypoints.map(
          (p) => new kakao.maps.LatLng(p.lat, p.lng)
        );
        draw(straight);
      }
    })();
  }, [waypoints]);

  return <div ref={mapEl} className="w-full" style={{ height }} />;
}

export default MapRoute;
