import type { CommonWalkResponse } from './common';

export type QrAuth = {
  walkId: number;
  status: string;
  walkType: string;
  verificationMethod: string;
  startTime: Date;
};

export type QrAuthResponse = CommonWalkResponse<QrAuth>;
