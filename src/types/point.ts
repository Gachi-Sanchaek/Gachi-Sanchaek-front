export interface PointLogItem {
  amount: number;
  date: string;
  type: string;
  location: string;
}

export type PointLogResponse = PointLogItem[] | null;
