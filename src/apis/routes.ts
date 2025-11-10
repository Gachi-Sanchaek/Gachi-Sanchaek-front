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
  const { minutes, currentLat, currentLng, orgId } = params;

  const res = await axiosInstance.get("/api/v1/routes/recommend", {
    params: { minutes, currentLat, currentLng, orgId },
  });

  const data = res.data?.data as RecommendResponse;
  return data;
}
