export type SResponse<T> = {
  status: number;
  message: string;
  data: T | undefined;
  error: Object;
};
