export interface FormError<T extends string = string> {
  path: T;
  message: string;
}

export interface UFormApi {
  validate: <T>(path: string, opts: { silent?: boolean }) => Promise<T>;
  clear: (path?: string) => void;
  getErrors: (path?: string) => FormError[];
  setErrors: (errors: FormError[], path?: string) => void;
  errors: Ref<FormError[]>;
}

export type FormSubmitEvent<T> = SubmitEvent & { data: T };
