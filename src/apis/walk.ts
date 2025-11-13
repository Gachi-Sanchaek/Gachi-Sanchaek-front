import type { WalkFinishReponse, WalkFinishRequest, WalkStartRequest, WalkStartResponse, walkStateChangeResponse } from '../types/walk';
import { axiosInstance } from './axios';

export const postWalkStart = async (body: WalkStartRequest): Promise<WalkStartResponse> => {
  const { data } = await axiosInstance.post(`/api/v1/walk/start`, body);

  return data;
};

export const patchWalkFinish = async (body: WalkFinishRequest): Promise<WalkFinishReponse> => {
  const { data } = await axiosInstance.patch(`/api/v1/walk/end`, body);

  return data;
};

export const postWalkStateChange = async (walkId: number): Promise<walkStateChangeResponse> => {
  const { data } = await axiosInstance.post(
    `/api/v1/walk/connect`,
    {},
    {
      params: { walkId },
    }
  );

  return data;
};
