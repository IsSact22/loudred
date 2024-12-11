// /src/hooks/useData.js
import useSWR from "swr";
import { fetcher } from "@/src/services/fetcher";

export function useData(
  endpoint,
  { id = null, pagination = false, params = {} } = {}
) {
  const url = id ? `${endpoint}/${id}` : endpoint;
  const combinedParams = { pagination, ...params };
  const { data, error, isLoading } = useSWR(
    [url, combinedParams],
    ([url, params]) => fetcher(url, params)
  );

  return {
    data,
    error,
    isLoading,
  };
}
