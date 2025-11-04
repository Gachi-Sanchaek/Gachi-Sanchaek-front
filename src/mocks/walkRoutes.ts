export type LatLng = { lat: number; lng: number };

export type RouteItem = {
  id: number;
  description: string;
  waypoints: LatLng[];
  estimatedTime: number;
};

export type WalkApiResult = {
  recommendationGroupId: string;
  routes: RouteItem[];
};

export type WalkApiResponse = {
  isSuccess: boolean;
  code: string;
  message: string;
  result: WalkApiResult;
};

const ROUTE_1: RouteItem = {
  id: 101,
  description: "부천시청 뒤편 공원을 중심으로 한 30분 왕복 코스입니다.",
  waypoints: [
    { lat: 37.566, lng: 126.978 },
    { lat: 37.5672, lng: 126.981 },
    { lat: 37.569, lng: 126.982 },
    { lat: 37.5684, lng: 126.979 },
    { lat: 37.566, lng: 126.978 }, // 시작점으로 복귀(루프)
  ],
  estimatedTime: 30,
};

const ROUTE_2: RouteItem = {
  id: 102,
  description: "도심을 가볍게 순회하는 평탄한 산책 코스입니다.",
  waypoints: [
    { lat: 37.565, lng: 126.976 },
    { lat: 37.5665, lng: 126.9785 },
    { lat: 37.5678, lng: 126.98 },
    { lat: 37.5668, lng: 126.982 },
    { lat: 37.565, lng: 126.976 },
  ],
  estimatedTime: 28,
};

const ROUTE_3: RouteItem = {
  id: 103,
  description: "하천변을 따라 바람을 느끼며 걷는 경치 좋은 코스입니다.",
  waypoints: [
    { lat: 37.5642, lng: 126.975 },
    { lat: 37.5658, lng: 126.9775 },
    { lat: 37.5662, lng: 126.9805 },
    { lat: 37.5649, lng: 126.9815 },
    { lat: 37.5642, lng: 126.975 },
  ],
  estimatedTime: 32,
};

export const WALK_ROUTES_MOCK: WalkApiResponse = {
  isSuccess: true,
  code: "OK",
  message: "Success",
  result: {
    recommendationGroupId: "String",
    routes: [ROUTE_1, ROUTE_2, ROUTE_3],
  },
};

export async function mockFetchWalkRecommendations(): Promise<WalkApiResponse> {
  await new Promise((r) => setTimeout(r, 300));
  return WALK_ROUTES_MOCK;
}
