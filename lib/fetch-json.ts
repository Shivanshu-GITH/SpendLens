export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public data?: unknown,
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

export async function fetchJson<T>(
  url: string,
  init?: RequestInit,
): Promise<{ data: T; response: Response }> {
  const response = await fetch(url, init);
  const contentType = response.headers.get('content-type') ?? '';

  if (!contentType.includes('application/json')) {
    const preview = (await response.text()).replace(/\s+/g, ' ').slice(0, 160);
    throw new ApiError(
      response.ok
        ? 'Unexpected response from server.'
        : `Server error (${response.status}). Check API configuration and server logs.`,
      response.status,
      preview,
    );
  }

  const data = (await response.json()) as T;

  if (!response.ok) {
    const message =
      typeof data === 'object' &&
      data !== null &&
      'message' in data &&
      typeof (data as { message: unknown }).message === 'string'
        ? (data as { message: string }).message
        : typeof data === 'object' &&
            data !== null &&
            'error' in data &&
            typeof (data as { error: unknown }).error === 'string'
          ? (data as { error: string }).error
          : `Request failed (${response.status})`;
    throw new ApiError(message, response.status, data);
  }

  return { data, response };
}
