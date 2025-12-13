export type ApiErrorPayload = { error: string };

export type ApiError = Error & { payload?: ApiErrorPayload };
