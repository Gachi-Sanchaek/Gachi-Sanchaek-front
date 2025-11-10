import type { CommonWalkResponse } from './common';

export type WalkStartRequest = {
  recommendationId: number;
  walkType: string;
  desiredTime: number;
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

export type WalkFinishData = {
  walkId: number;
  totalDistance: number;
  totalMin: number;
  pointsEarned: number;
  message: string;
};

export type WalkFinishReponse = CommonWalkResponse<WalkFinishData>;
