export type SResponse<T> = {
  status: number;
  message: string;
  data: T | undefined;
  error: Object;
};

export function isResponse<T>(obj: any): obj is SResponse<T> {
  return (
    typeof obj === 'object' &&
    obj !== null &&
    typeof obj.status === 'number' &&
    typeof obj.message === 'string' &&
    (typeof obj.data !== 'undefined' || obj.data === undefined) &&
    typeof obj.error === 'object'
  );
}