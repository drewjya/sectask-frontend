import type { ApiError } from "~/types/api/error";
import type { ApiParam } from "~/types/api/param";
import { isResponse, type SResponse } from "~/types/api/response";
import type { VFile } from "~/types/data/file";
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

export const downloadAs = (file: VFile) => {
  const url = useRuntimeConfig().public.FILE_URL + file.name;
  const notif = useNotification();
  fetch(url)
    .then((response) => {
      if (!response.ok) {
        notif.error({
          title: "Error",
          message: "Failed to download the file",
        });
        throw new Error("Network response was not ok");
      }
      return response.blob();
    })
    .then((blob) => {
      // Create a link element
      const link = document.createElement("a");
      // Create a URL for the blob
      const blobUrl = window.URL.createObjectURL(blob);
      // Set the href of the link to the blob URL
      link.href = blobUrl;
      // Set the download attribute to the new file name
      link.download = file.originalName ?? file.name;
      // Append the link to the body (necessary for Firefox)
      document.body.appendChild(link);
      // Simulate a click on the link to start the download
      link.click();
      // Remove the link from the document
      document.body.removeChild(link);
      // Release the blob URL
      window.URL.revokeObjectURL(blobUrl);
    })
    .catch((error) => console.error("Download failed:", error));
};
