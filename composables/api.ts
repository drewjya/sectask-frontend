import type { ApiError } from "~/types/api/error";
import type { ApiParam } from "~/types/api/param";
import { isResponse, type SResponse } from "~/types/api/response";
const request = async <T>(params: {
  url: string;
  baseUrl: string;
  param: {
    method: "GET" | "POST" | "PUT" | "DELETE";
    body?: ApiParam;
    headers?: Record<string, string>;
  };
}): Promise<SResponse<T>> => {
  try {
    console.log(params.param.headers);

    const data: SResponse<T> = await $fetch(params.url, {
      baseURL: params.baseUrl,
      method: params.param.method,
      body: params.param.body,
      headers: params.param.headers,
    });
    return data;
  } catch (error) {
    const data = (error as any).data;

    if (isResponse(data)) {
      const err: ApiError = {
        error: data.error,
        message: data.message,
      };
      throw err;
    }
    const err: ApiError = {
      error: {
        "@root": "unknown",
      },
      message: "unknown",
    };
    throw err;
  }
};

export const usePrivateApi = () => {
  const app = useApp();
  const config = useRuntimeConfig();

  const get = async <T>(url: string) => {
    const response = await request<T>({
      url: url,
      baseUrl: config.public.API_BASE_URL,
      param: {
        method: "GET",
        headers: {
          Authorization: app.getAuthorization,
        },
      },
    });
    return response;
  };
  const post = async <T>(url: string, param?: ApiParam) => {
    const response = await request<T>({
      url: url,
      baseUrl: config.public.API_BASE_URL,
      param: {
        method: "POST",
        headers: {
          Authorization: app.getAuthorization,
        },
        body: param?.body,
      },
    });
    return response;
  };
  const put = async <T>(url: string, param?: ApiParam) => {
    const response = await request<T>({
      url: url,
      baseUrl: config.public.API_BASE_URL,
      param: {
        method: "PUT",
        headers: {
          Authorization: app.getAuthorization,
        },
        body: param?.body,
      },
    });
    return response;
  };
  const remove = async <T>(url: string, param?: ApiParam) => {
    const response = await request<T>({
      url: url,
      baseUrl: config.public.API_BASE_URL,
      param: {
        method: "DELETE",
        headers: {
          Authorization: app.getAuthorization,
        },
        body: param?.body,
      },
    });
    return response;
  };
  return {
    get,
    post,
    put,
    remove,
  };
};

export const usePublicApi = () => {
  const config = useRuntimeConfig();
  const get = async <T>(url: string, headers?: Record<string, string>) => {
    const response = await request<T>({
      url: url,
      baseUrl: config.public.API_BASE_URL,
      param: {
        method: "GET",
        headers: headers,
      },
    });
    return response;
  };
  const post = async <T>(
    url: string,
    param?: ApiParam,
    headers?: Record<string, string>
  ) => {
    const response = await request<T>({
      url: url,
      baseUrl: config.public.API_BASE_URL,
      param: {
        method: "POST",
        headers: headers,
        body: param?.body,
      },
    });
    return response;
  };
  const put = async <T>(
    url: string,
    param?: ApiParam,
    headers?: Record<string, string>
  ) => {
    const response = await request<T>({
      url: url,
      baseUrl: config.public.API_BASE_URL,
      param: {
        method: "PUT",
        headers: headers,
        body: param?.body,
      },
    });
    return response;
  };
  const remove = async <T>(
    url: string,
    param?: ApiParam,
    headers?: Record<string, string>
  ) => {
    const response = await request<T>({
      url: url,
      baseUrl: config.public.API_BASE_URL,
      param: {
        method: "DELETE",
        headers: headers,
        body: param?.body,
      },
    });
    return response;
  };
  return {
    get,
    post,
    put,
    remove,
  };
};
