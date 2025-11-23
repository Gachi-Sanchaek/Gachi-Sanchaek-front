import { axiosInstance } from "./axios";
import type {
  UserProfileRequest,
  UserProfileResponse,
  UserRankingResponse,
  UserRankingItem,
  CheckNicknameResponse,
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

  const response = await axiosInstance.patch("/api/v1/users/me", payload);

  return response.data.data;
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

export const checkNickname = async (
  nickname: string
): Promise<CheckNicknameResponse> => {
  const response = await axiosInstance.get("/api/v1/users/check-nickname", {
    params: { nickname },
  });
  console.log(response);

  return response.data?.data;
};

export const deleteUser = async () => {
  try {
    await axiosInstance.delete("/api/v1/users/me");

    useUserStore.setState({ profile: null });
    localStorage.removeItem("accessToken");

    window.location.assign("/goodbye");
  } catch (error) {
    console.error("회원 탈퇴 실패:", error);
    alert("탈퇴 중 오류가 발생했습니다.");
  }
};
