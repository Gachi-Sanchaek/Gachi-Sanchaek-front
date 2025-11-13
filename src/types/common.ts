export type CommonResponse<T> = {
  status: number;
  message: string;
  data: T;
};

export type CommonWalkResponse<T> = {
  status: number;
  message: string;
  data: T;
};
