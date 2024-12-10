import useSWR from "swr";
import { apiClient } from "@/src/services/apiClient";

const fetcher = (url) => apiClient.get(url).then((res) => res.data.data);

export function useManifestData({ id = null, remove_pagination = false, params = {} } = {}) {
    const endpoint = id ? `/manifests/${id}` : "/manifests";
    const combinedParams = { remove_pagination, ...params };
    const { data, error, isLoading } = useSWR([endpoint, combinedParams], fetcher);

    return {
        data,
        error,
        isLoading,
    };
}

export function useAirlineData({ id = null, remove_pagination = false, params = {} } = {}) {
    const endpoint = id ? `/airlines/${id}` : "/airlines";
    const combinedParams = { remove_pagination, ...params };
    const { data, error, isLoading } = useSWR([endpoint, combinedParams], fetcher);

    return {
        data,
        error,
        isLoading,
    };
}

export function useFlightData({ id = null, remove_pagination = false, params = {} } = {}) {
    const endpoint = id ? `/flights/${id}` : "/flights";
    const combinedParams = { remove_pagination, ...params };
    const { data, error, isLoading } = useSWR([endpoint, combinedParams], fetcher);

    return {
        data,
        error,
        isLoading,
    };
}
