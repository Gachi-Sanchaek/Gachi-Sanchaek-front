import { axiosInstance } from "./axios";

//추천 경로 선택 저장
export type Waypoint = { lat: number; lng: number };

export async function postRouteSelect(params: {
  orgId: number;
  groupId: string;
  selectedRoute: {
    id: number;
    description: string;
    estimatedTime: number;
    waypoints: Waypoint[];
  };
}) {
  const res = await axiosInstance.post("/api/v1/routes/select", params);
  return res.data;
}
