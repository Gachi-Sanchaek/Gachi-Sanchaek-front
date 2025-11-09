import { axiosInstance } from "./axios"; 

export const postWalkTime = async (minutes: number) => {
  try {
    const body = {
      recommendationId: 0, 
      walkType: "NORMAL",
      desiredTime: minutes,
    };

    const res = await axiosInstance.post("/api/v1/walk/start", body);
    return res.data;
  } catch (error) {
    console.error("산책 시간 전송 실패:", error);
    throw error;
  }
};
