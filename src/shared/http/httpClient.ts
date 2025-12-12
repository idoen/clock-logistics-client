import axios from "axios";
import { ApiError, type ApiErrorPayload } from "./types";

const httpClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:3000",
});

httpClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const payload: ApiErrorPayload | undefined = error?.response?.data;
    if (payload && typeof payload.error === "string") {
      return Promise.reject(new ApiError(payload.error, error?.response?.status));
    }
    return Promise.reject(new ApiError("Request failed", error?.response?.status));
  },
);

export default httpClient;
