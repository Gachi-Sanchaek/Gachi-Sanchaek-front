export interface PointLogItem {
  amount: number;
  date: string;
  title: string;
  location: string;
}

export type PointLogResponse = PointLogItem[] | null;
