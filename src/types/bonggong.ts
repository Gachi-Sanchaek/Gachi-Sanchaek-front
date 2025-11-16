import type { CommonWalkResponse } from './common';

export interface Bonggong {
  id: number;
  name: string;
  imageUrl: string;
  price: number;
  isActive: boolean;
}

export type BonggongResponse = CommonWalkResponse<Bonggong[]>;
