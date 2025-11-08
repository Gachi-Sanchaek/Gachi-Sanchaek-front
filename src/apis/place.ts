import type { PlaceMarkerRequest, PlaceMarkerResponse } from '../types/place';
import { axiosInstance } from './axios';

export const getNearbyPlaces = async (params: PlaceMarkerRequest): Promise<PlaceMarkerResponse> => {
  const { data } = await axiosInstance.get(`/api/v1/organizations/nearby`, {
    params,
  });

  return data;
};
