import { axiosInstance } from "./axios";
import { postWalkStart } from "./walk";
import { walkType as toWalkType } from "../utils/walkType";

//추천 경로 선택 저장
export type Waypoint = { lat: number; lng: number };

export async function postRouteSelect(params: {
  orgId: number | null;
  groupId: string; // = recommendationGroupId
  selectedRoute: {
    id: number;
    description: string;
    estimatedTime: number;
    waypoints: Waypoint[];
  };
}) {
  const res = await axiosInstance.post("/api/v1/routes/select", {
    orgId: params.orgId,
    groupId: params.groupId,
    selectedRoute: params.selectedRoute,
  });
  return res.data;
}

//현재 진행중인 산책ID
const WALK_ID_KEY = "walkId";
export const setWalkId = (id: number) =>
  localStorage.setItem(WALK_ID_KEY, String(id));

//선택 저장 + 산책 시작
export async function startWalkAndSelect(params: {
  category: "산책" | "동행 산책" | "유기견 산책" | "플로깅";
  orgId: number | null;
  groupId: string; // 빈 문자열 금지
  selectedRoute: {
    id: number;
    description: string;
    estimatedTime: number;
    waypoints: Waypoint[];
  };
}) {
  //선택 저장
  await postRouteSelect({
    orgId: params.orgId,
    groupId: params.groupId,
    selectedRoute: params.selectedRoute,
  });

  //산책 시작
  const walkStart = await postWalkStart({
    recommendationId: params.selectedRoute.id,
    walkType: toWalkType(params.category)!,
  });

  const walkId = walkStart.data.walkId;
  setWalkId(walkId);
  return walkId;
}
