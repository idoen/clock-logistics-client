import axios from 'axios'
import type { AxiosError } from 'axios'
import type { ApiErrorPayload } from './types'

const baseURL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000'

export const httpClient = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
})

export function normalizeError(error: unknown): Error {
  const axiosError = error as AxiosError<ApiErrorPayload>
  const message = axiosError.response?.data?.error || 'Request failed'
  return new Error(message)
}
