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
  type: string;
};

export type PlaceMarkerResponse = CommonResponse<Place[]>;

export type PlaceStoreRequest = Place;

export type PlaceStoreResponse = CommonResponse<{
  id: number;
  kakaoId: number;
  name: string;
  phone: string;
  address: string;
  latitude: number;
  longitude: number;
  category: string;
  createdAt: Date;
}>;
