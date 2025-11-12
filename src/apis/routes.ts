//api/v1/routes/recommend
import { axiosInstance } from "./axios";
type LatLng = { lat: number; lng: number };

export type RecommendedRoute = {
  id: number;
  description: string;
  estimatedTime: number;
  waypoints: LatLng[];
};

export type RecommendResponse = {
  recommendationGroupId: string;
  orgId?: number;
  routes: RecommendedRoute[];
};

export async function getRecommendedRoutes(params: {
  minutes: number;
  currentLat: number;
  currentLng: number;
  orgId?: number;
}) {
  const res = await axiosInstance.get("/api/v1/routes/recommend", {
    params: {
      orgId: params.orgId ?? null,
      minutes: params.minutes,
      currentLat: params.currentLat,
      currentLng: params.currentLng,
    },
  });
  return res.data?.data as RecommendResponse;
}
