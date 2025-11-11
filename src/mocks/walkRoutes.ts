export type Waypoint = { lat: number; lng: number };

// 백엔드 스키마와 동일
export type Route = {
  id: number; // 1,2,3슬라이드 번호 느낌
  description: string; // RouteInfoCard의 title
  waypoints: Waypoint[]; // 지도에서 사용(지금은 무시)
  estimatedTime: number; // 분 → RouteInfoCard의 minutes
};

// API 오기 전까지 사용할 목데이터
export const walkRoutes: Route[] = [
  {
    id: 1,
    description: "가톨릭대 정문 앞 30분 산책 코스",
    waypoints: [
      { lat: 37.4845, lng: 126.8018 }, // 가톨릭대 정문
      { lat: 37.4868, lng: 126.8049 }, // 부천둘레길 입구 근처
      { lat: 37.4882, lng: 126.8072 }, // 부천시립상동도서관 뒤편 산책로
      { lat: 37.4845, lng: 126.8018 }, // 돌아오는 길
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
    description: "부산 광안리 해변 산책 코스",
    waypoints: [
      { lat: 35.1532, lng: 129.1187 }, // 광안리 해수욕장 입구
      { lat: 35.1551, lng: 129.1209 }, // 광안대교 전망 포인트
      { lat: 35.1564, lng: 129.1178 }, // 해변 산책로 끝지점
      { lat: 35.1532, lng: 129.1187 }, // 되돌아오는 길
    ],
    estimatedTime: 45,
  },
];
