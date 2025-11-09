import type { QrAuthResponse } from '../types/walk-auth';
import { axiosInstance } from './axios';

export const postQrAuth = async (qrToken: string): Promise<QrAuthResponse> => {
  const { data } = await axiosInstance.post(`/api/v1/walk/qr`, null, {
    params: { qrToken },
  });

  return data;
};
