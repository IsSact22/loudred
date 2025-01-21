// /src/hooks/useData.js
import useSWR from "swr";
import { fetcher } from "@/src/services/fetcher";
import { useState } from "react";

export function useData(
  endpoint,
  { id = null, pagination = false, params = {} } = {},
  shouldFetch = true // true por defecto, si no lo pasas, hace fetch automático
) {
  // URL base (si viene un id, se añade a la URL)
  const url = id ? `${endpoint}/${id}` : endpoint;

  // Unir paginación y otros parámetros
  const combinedParams = { pagination, ...params };

  // Clave que SWR usará para el caché (o null para no fetchear)
  const key = shouldFetch ? [url, JSON.stringify(combinedParams)] : null;

  // Hook de SWR para el GET (solo funciona si key no es null)
  const { data, error, isLoading, mutate } = useSWR(key, ([url, params]) =>
    fetcher(url, JSON.parse(params))
  );

  // Estados para mutaciones
  const [isMutating, setIsMutating] = useState(false);
  const [mutationError, setMutationError] = useState(null);

  // Función para crear datos (POST)
  const createData = async (newData) => {
    setIsMutating(true);
    setMutationError(null);
    try {
      const response = await fetcher.post(url, newData);
      mutate(); // Revalidar datos después de la mutación
      return response;
    } catch (error) {
      setMutationError(error);
      throw error;
    } finally {
      setIsMutating(false);
    }
  };

  // Función para actualizar datos (PUT)
  const updateData = async (updatedData, overrideId = null) => {
    setIsMutating(true);
    setMutationError(null);
    const putUrl = overrideId ? `${endpoint}/${overrideId}` : url;

    try {
      const response = await fetcher.patch(putUrl, updatedData);
      mutate();
      return response;
    } catch (error) {
      setMutationError(error);
      throw error;
    } finally {
      setIsMutating(false);
    }
  };

  // Función para eliminar datos (DELETE)
  const deleteData = async (overrideId = null) => {
    setIsMutating(true);
    setMutationError(null);
    const deleteUrl = overrideId ? `${endpoint}/${overrideId}` : url;

    try {
      const response = await fetcher.delete(deleteUrl);
      mutate();
      return response;
    } catch (error) {
      setMutationError(error);
      throw error;
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
