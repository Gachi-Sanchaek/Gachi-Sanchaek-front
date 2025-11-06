import type { CommonResponse } from './common';

export type Place = {
  kakaoId: number;
  name: string;
  phone: string;
  address: string;
  latitude: number;
  longitude: number;
  distance: number;
};

export type PlaceMarkerRequest = {
  lat: number;
  lng: number;
  radius: number;
  keyword: string;
};

export type PlaceMarkerResponse = CommonResponse<{
  places: Place[];
}>;
