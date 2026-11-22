export type ApiMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

export type ApiRequest = {
  method: ApiMethod;
  path: string;
  body?: unknown;
  signal?: AbortSignal;
};

export type ApiTransport = {
  request<T>(request: ApiRequest): Promise<T>;
};

export class ApiRequestError extends Error {
  readonly status?: number;
  readonly responseBody?: unknown;

  constructor(message: string, options: { status?: number; responseBody?: unknown } = {}) {
    super(message);
    this.name = "ApiRequestError";
    this.status = options.status;
    this.responseBody = options.responseBody;
  }
}

export function createFetchTransport(baseUrl: string): ApiTransport {
  const normalizedBaseUrl = new URL(baseUrl);

  return {
    async request<T>({ method, path, body, signal }: ApiRequest): Promise<T> {
      let response: Response;

      try {
        response = await fetch(new URL(path, normalizedBaseUrl), {
          method,
          headers: body === undefined ? undefined : { "Content-Type": "application/json" },
          body: body === undefined ? undefined : JSON.stringify(body),
          signal,
        });
      } catch (error) {
        const message = error instanceof Error ? error.message : "The API request could not be completed.";
        throw new ApiRequestError(message);
      }

      const responseBody = await readResponseBody(response);

      if (!response.ok) {
        throw new ApiRequestError(`API request failed with status ${response.status}.`, {
          status: response.status,
          responseBody,
        });
      }

      return responseBody as T;
    },
  };
}

export function createMockTransport<T>(handler: (request: ApiRequest) => Promise<T> | T): ApiTransport {
  return {
    async request<R>(request: ApiRequest): Promise<R> {
      return (await handler(request)) as R;
    },
  };
}

async function readResponseBody(response: Response): Promise<unknown> {
  if (response.status === 204) return undefined;

  const contentType = response.headers.get("content-type");
  if (contentType?.includes("application/json")) {
    try {
      return await response.json();
    } catch {
      throw new ApiRequestError("The API returned invalid JSON.", { status: response.status });
    }
  }

  return response.text();
}
