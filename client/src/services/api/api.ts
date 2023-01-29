import { apiBaseUrl } from "../../utils/config";
import { CustomeError } from "../../utils/error";

type Method = "GET" | "SEARCH" | "POST" | "PUT" | "DELETE";

type ApiResponse<T> = {
  GET: { data: T };
  SEARCH: { data: T[] };
  POST: { data: T };
  PUT: { data: T };
  DELETE: { data: T } | null;
};

export type TRequestInfo = {
  url: string;
  isPublic?: boolean; // to specify if the route require authorization header 
}

type HttpMethod = {
  GET: "GET";
  SEARCH: "GET";
  POST: "POST";
  PUT: "PUT";
  DELETE: "DELETE";
};

type ResponseType<M extends Method, T> = ApiResponse<T>[M];

export async function fetcher<M extends Method, T>(
  input: TRequestInfo,
  init?: RequestInit & { method: HttpMethod[M] }
) {
  const token = window.localStorage.getItem("authToken") || "";

  let response: Response;
  let headers: HeadersInit = {
    "Content-Type": "application/json",
    ...init?.headers,
  };

  if(!input.isPublic) {
    headers = {
      ...headers,
      Authorization: `Bearer ${token}`,
    }
  }

  response = await fetch(input.url, {
    ...init,
    headers,
  });

  if (response.ok) {
    return (await response.json()) as ResponseType<M, T>;
  } else {
    const result = await response.json();
    const error = new CustomeError(
      response.status,
      result.errors[0]?.message,
      result.errors
    );
    console.log(result);
    return Promise.reject(result);
    // throw error;
  }
}

/*export async function fetcher<M extends Method, T>(
  input: RequestInfo,
  init?: RequestInit & { method: HttpMethod[M] }
) {
  const token = window.localStorage.getItem("authToken") || "";

  const response = await fetch(`${apiBaseUrl}${input}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      ...init?.headers,
    },
  });

  if (response.ok) {
    return (await response.json()) as ResponseType<M, T>;
  } else {
    const result = await response.json();
    const error = new CustomeError(
      response.status,
      result.errors[0]?.message,
      result.errors
    );
    throw error;
  }
}*/


