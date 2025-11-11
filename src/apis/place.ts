import type { PlaceMarkerRequest, PlaceMarkerResponse, PlaceStoreRequest, PlaceStoreResponse } from '../types/place';
import { axiosInstance } from './axios';

export const getNearbyPlaces = async (params: PlaceMarkerRequest): Promise<PlaceMarkerResponse> => {
  const { data } = await axiosInstance.get(`/api/v1/organizations/nearby`, {
    params,
  });

  return data;
};

export const postPlaceStore = async (body: PlaceStoreRequest, keyword: string): Promise<PlaceStoreResponse> => {
  const { data } = await axiosInstance.post(`/api/v1/organizations/select`, body, {
    params: keyword,
  });

  return data;
};
