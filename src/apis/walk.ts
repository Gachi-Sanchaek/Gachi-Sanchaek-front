import type { WalkFinishReponse, WalkFinishRequest, WalkStartRequest, WalkStartResponse } from '../types/walk';
import { axiosInstance } from './axios';

export const postWalkStart = async (params: WalkStartRequest): Promise<WalkStartResponse> => {
  const { data } = await axiosInstance.post(`/api/v1/walk/start`, params);

  return data;
};

export const patchWalkFinish = async (params: WalkFinishRequest): Promise<WalkFinishReponse> => {
  const { data } = await axiosInstance.patch(`/api/v1/walk/end`, params);

  return data;
};
