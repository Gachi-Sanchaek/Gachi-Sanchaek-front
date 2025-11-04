export type Waypoint = { lat: number; lng: number };

// 백엔드 스키마와 동일
export type Route = {
  id: number; // 1,2,3 ... 슬라이드 번호 느낌
  description: string; // RouteInfoCard의 title
  waypoints: Waypoint[]; // 지도에서 사용(지금은 무시)
  estimatedTime: number; // 분 → RouteInfoCard의 minutes
};

// API 오기 전까지 사용할 목데이터
export const walkRoutes: Route[] = [
  {
    id: 1,
    description: "프레쉬한 공기를 맡는 길",
    waypoints: [
      { lat: 37.566, lng: 126.978 },
      { lat: 37.569, lng: 126.982 },
      { lat: 37.566, lng: 126.978 },
    ],
    estimatedTime: 43,
  },
  {
    id: 2,
    description: "강변 산책 루트",
    waypoints: [
      { lat: 37.565, lng: 126.976 },
      { lat: 37.567, lng: 126.98 },
      { lat: 37.565, lng: 126.976 },
    ],
    estimatedTime: 38,
  },
  {
    id: 3,
    description: "도심 힐링 코스",
    waypoints: [
      { lat: 37.564, lng: 126.975 },
      { lat: 37.568, lng: 126.983 },
      { lat: 37.564, lng: 126.975 },
    ],
    estimatedTime: 45,
  },
];
