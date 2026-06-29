const TRANSACTION_API_URL =
  process.env.NEXT_PUBLIC_TRANSACTION_API_URL || "/backend-api/api";
const CSRF_URL =
  process.env.NEXT_PUBLIC_CSRF_URL || "/backend-api/sanctum/csrf-cookie";
type ApiRequestBody = BodyInit | Record<string, unknown> | unknown[];

type ApiClientOptions = Omit<RequestInit, "body" | "credentials"> & {
  body?: ApiRequestBody;
  skipCsrf?: boolean;
  retryOnCsrfMismatch?: boolean;
};

const stateChangingMethods = new Set(["POST", "PUT", "PATCH", "DELETE"]);

function buildApiUrl(path: string): string {
  if (path.startsWith("http://") || path.startsWith("https://")) {
    return path;
  }

  return `${TRANSACTION_API_URL}${path.startsWith("/") ? path : `/${path}`}`;
}

function getCookieValue(name: string): string | null {
  if (typeof document === "undefined") return null;

  const cookie = document.cookie
    .split("; ")
    .find((row) => row.startsWith(`${name}=`));

  if (!cookie) return null;

  return decodeURIComponent(cookie.slice(name.length + 1));
}

function normalizeBody(
  body: ApiRequestBody | undefined,
  headers: Headers,
): BodyInit | undefined {
  if (!body) return undefined;

  if (
    typeof body === "string" ||
    body instanceof FormData ||
    body instanceof URLSearchParams ||
    body instanceof Blob ||
    body instanceof ArrayBuffer
  ) {
    return body;
  }

  if (!headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  return JSON.stringify(body);
}

export async function fetchCsrfCookie(): Promise<void> {
  const response = await fetch(CSRF_URL, {
    method: "GET",
    credentials: "include",
    cache: "no-store",
    headers: {
      Accept: "application/json",
    },
  });

  if (!response.ok) {
    throw new Error("Unable to initialize CSRF protection.");
  }
}

export async function apiFetch(
  path: string,
  options: ApiClientOptions = {},
): Promise<Response> {
  const method = (options.method || "GET").toUpperCase();
  const headers = new Headers(options.headers);
  const shouldSendCsrf = !options.skipCsrf && stateChangingMethods.has(method);

  headers.set("Accept", headers.get("Accept") || "application/json");

  if (shouldSendCsrf) {
    await fetchCsrfCookie();
    const xsrfToken = getCookieValue("XSRF-TOKEN");

    if (xsrfToken) {
      headers.set("X-XSRF-TOKEN", xsrfToken);
    }
  }

  const body = normalizeBody(options.body, headers);

  const request = {
    ...options,
    method,
    headers,
    body,
    credentials: "include",
  } satisfies RequestInit;

  const response = await fetch(buildApiUrl(path), request);

  if (
    response.status === 419 &&
    shouldSendCsrf &&
    options.retryOnCsrfMismatch !== false
  ) {
    await fetchCsrfCookie();
    const retryHeaders = new Headers(headers);
    const xsrfToken = getCookieValue("XSRF-TOKEN");

    if (xsrfToken) {
      retryHeaders.set("X-XSRF-TOKEN", xsrfToken);
    }

    return fetch(buildApiUrl(path), {
      ...request,
      headers: retryHeaders,
    });
  }

  return response;
}

export { CSRF_URL, TRANSACTION_API_URL };
