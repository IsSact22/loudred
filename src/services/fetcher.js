// /src/services/fetcher.js
import { apiClient } from "@/src/services/apiClient";

export const fetcher = (url, params) =>
  apiClient.get(url, { params }).then((res) => res.data);
