import type { CommonWalkResponse } from './common';

export type WalkStartRequest = {
  recommendationId: number | null;
  walkType: 'NORMAL' | 'PLOGGING' | 'DOG' | 'SENIOR';
};

export type WalkStartData = {
  walkId: number;
  status: string;
  walkType: string;
  recommendationId: number;
  verificationMethod: string;
  startTime: Date;
};

export type WalkStartResponse = CommonWalkResponse<WalkStartData>;

export type WalkFinishRequest = {
  walkId: number;
  totalDistance: number;
  totalMinutes: number;
};

export type WalkFinishData = {
  walkId: number;
  status: string;
  nickname: string;
  totalDistance: number;
  totalMinutes: number;
  pointsEarned: number;
  walkingCount: number;
  message: string;
};

export type WalkFinishReponse = CommonWalkResponse<WalkFinishData>;

export type walkStateChange = {
  walkId: number;
  status: string;
  walkType: string;
  recommendationId: number | null;
  verificationMethod: string;
  startTime: Date;
};

export type walkStateChangeResponse = CommonWalkResponse<walkStateChange>;
