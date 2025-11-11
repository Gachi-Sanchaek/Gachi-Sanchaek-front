import type { CommonWalkResponse } from './common';

export type QrAuthRequest = {
  walkId: number;
  qrToken: string;
};

export type QrAuth = {
  walkId?: number;
  verified?: boolean;
  message: string;
};

export type QrAuthResponse = CommonWalkResponse<QrAuth>;

export type PloggingAuthRequest = {
  walkId: string;
  image: File;
};

export type PloggingAuthResponse = CommonWalkResponse<{
  walkId: number;
  verified: boolean;
  message: string;
}>;
