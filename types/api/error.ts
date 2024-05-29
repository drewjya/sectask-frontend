export type ApiError = {
  message: string;
  error: Object;
};
export function isApiError<T>(obj: any): obj is ApiError {
  return (
    typeof obj === "object" &&
    obj !== null &&
    typeof obj.message === "string" &&
    typeof obj.error === "object"
  );
}
