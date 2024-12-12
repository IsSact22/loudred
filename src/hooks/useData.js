// /src/hooks/useData.js
import useSWR from "swr";
import { fetcher } from "@/src/services/fetcher";
import { useState } from "react";

export function useData(
  endpoint,
  { id = null, pagination = false, params = {} } = {}
) {
  const url = id ? `${endpoint}/${id}` : endpoint;
  const combinedParams = { pagination, ...params };
  const key = [url, JSON.stringify(combinedParams)];

  const { data, error, isLoading, mutate } = useSWR(
    key,
    ([url, params]) => fetcher(url, JSON.parse(params))
  );

  // Estados para mutaciones
  const [isMutating, setIsMutating] = useState(false);
  const [mutationError, setMutationError] = useState(null);

  // Función para crear datos (POST)
  const createData = async (newData) => {
    setIsMutating(true);
    setMutationError(null);
    try {
      await fetcher.post(url, newData);
      mutate(); // Revalidar datos después de la mutación
    } catch (error) {
      setMutationError(error);
    } finally {
      setIsMutating(false);
    }
  };

  // Función para actualizar datos (PUT)
  const updateData = async (updatedData) => {
    setIsMutating(true);
    setMutationError(null);
    try {
      await fetcher.put(url, updatedData);
      mutate();
    } catch (error) {
      setMutationError(error);
    } finally {
      setIsMutating(false);
    }
  };

  // Función para eliminar datos (DELETE)
  const deleteData = async () => {
    setIsMutating(true);
    setMutationError(null);
    try {
      await fetcher.delete(url);
      mutate();
    } catch (error) {
      setMutationError(error);
    } finally {
      setIsMutating(false);
    }
  };

  return {
    data,
    error,
    isLoading,
    mutate,
    isMutating,
    mutationError,
    createData,
    updateData,
    deleteData,
  };
}