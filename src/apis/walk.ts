import type { WalkFinishReponse, WalkStartRequest, WalkStartResponse } from '../types/walk';
import { axiosInstance } from './axios';

export const postWalkStart = async ({ recommendationId, walkType, desiredTime }: WalkStartRequest): Promise<WalkStartResponse> => {
  const { data } = await axiosInstance.post(`/api/v1/walk/start`, {
    recommendationId,
    walkType,
    desiredTime,
  });

  return data;
};

export const patchWalkFinish = async (walk: number): Promise<WalkFinishReponse> => {
  const { data } = await axiosInstance.patch(`/api/v1/walk/end`, {
    walk,
  });

  return data;
};
