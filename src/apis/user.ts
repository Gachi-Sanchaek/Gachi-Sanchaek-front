import { axiosInstance } from "./axios";
import type {
  UserProfileRequest,
  UserProfileResponse,
  UserRankingResponse,
  UserRankingItem,
} from "../types/user";
import { useUserStore } from "../store/UserStore";

export const getUserProfile = async (): Promise<UserProfileResponse> => {
  const response = await axiosInstance.get(`/api/v1/users/me`);
  console.log(response);

  return response.data.data;
};

export const updateUserProfile = async (data: Partial<UserProfileRequest>) => {
  const store = useUserStore.getState();

  if (!store.profile) {
    throw new Error("프로필 정보가 아직 로드되지 않았습니다.");
  }

  const payload: UserProfileRequest = {
    nickname: data.nickname ?? store.profile?.nickname,
    profileImageUrl: data.profileImageUrl ?? store.profile?.profileImageUrl,
  };

  const { data: response } = await axiosInstance.patch<UserProfileResponse>(
    "/api/v1/users/me",
    payload
  );

  return response;
};

export const getUserRanking = async (
  weekDate: string
): Promise<UserRankingResponse> => {
  const response = await axiosInstance.get(`/api/v1/rankings/my-ranking`, {
    params: { date: weekDate },
  });
  console.log(response);

  return response.data.data;
};

export const getTopRanking = async (
  weekDate: string
): Promise<UserRankingItem[]> => {
  const response = await axiosInstance.get(`/api/v1/rankings`, {
    params: { date: weekDate },
  });
  console.log(response);

  return response.data.data || [];
};
