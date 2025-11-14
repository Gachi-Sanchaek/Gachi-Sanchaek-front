import type { PointLogItem } from "../types/point";
import { axiosInstance } from "./axios";

export const getPointLog = async (): Promise<PointLogItem[]> => {
  const response = await axiosInstance.get(`/api/v1/pointLog`);
  console.log(response);

  if (Array.isArray(response.data.data)) {
    return response.data.data;
  }

  return [];
};
