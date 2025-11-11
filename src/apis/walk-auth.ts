import type { PloggingAuthRequest, PloggingAuthResponse, QrAuthRequest, QrAuthResponse } from '../types/walk-auth';
import { axiosInstance } from './axios';

export const postQrAuth = async (params: QrAuthRequest): Promise<QrAuthResponse> => {
  const { data } = await axiosInstance.post(`/api/v1/walk/qr`, params);

  return data;
};

export const postPloggingAuth = async ({ walkId, image }: PloggingAuthRequest): Promise<PloggingAuthResponse> => {
  const { data } = await axiosInstance.post(
    `/api/v1/walk/plogging`,
    { image },
    {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      params: walkId,
    }
  );

  return data;
};
