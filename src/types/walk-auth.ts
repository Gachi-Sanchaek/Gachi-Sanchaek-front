import type { CommonWalkResponse } from './common';

export type QrAuth = {
  walkId: number;
  status: string;
  walkType: string;
  verificationMethod: string;
  startTime: Date;
};

export type QrAuthResponse = CommonWalkResponse<QrAuth>;

export type PloggingAuthRequest = {
  walkId: string;
  image: File;
};

export type PloggingAuthResponse = CommonWalkResponse<{
  walkId: number;
  status: string;
}>;
