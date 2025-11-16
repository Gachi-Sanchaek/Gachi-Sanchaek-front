import { axiosInstance } from './axios';
import type { BonggongResponse } from '../types/bonggong';

export const getBonggongs = async (): Promise<BonggongResponse> => {
  const { data } = await axiosInstance.get(`/api/v1/stamps`);

  return data;
};
