import type { CommonAuthResponse } from './common';

export type QrAuth = {
  walkId: number;
  status: string;
  walkType: string;
  verificationMethod: string;
  startTime: Date;
};

export type QrAuthResponse = CommonAuthResponse<QrAuth>;

export type PloggingAuthRequest = {
  walkId: string;
  image: File;
};

export type PloggingAuthResponse = CommonAuthResponse<{
  walkId: number;
  status: string;
}>;
