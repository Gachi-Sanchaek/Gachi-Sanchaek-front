export type CommonResponse<T> = {
  isSuccess: boolean;
  code: string;
  message: string;
  result: T;
};

export type CommonWalkResponse<T> = {
  status: number;
  message: string;
  data: T;
};
