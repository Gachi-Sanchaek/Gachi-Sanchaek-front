export type CommonResponse<T> = {
  isSuccess: boolean;
  code: string;
  message: string;
  result: T;
};

export type CommonWalkResponse<T> = {
  success: boolean;
  message: string;
  data: T;
};
