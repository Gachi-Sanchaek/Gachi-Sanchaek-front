import type { PloggingAuthRequest, PloggingAuthResponse, QrAuthResponse } from '../types/walk-auth';
import { axiosInstance } from './axios';

export const postQrAuth = async (qrToken: string): Promise<QrAuthResponse> => {
  const { data } = await axiosInstance.post(`/api/v1/walk/qr`, null, {
    params: { qrToken },
  });

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
