// /src/hooks/useData.js
import { useState } from "react";
import useSWR, { mutate } from "swr";
import { fetcher } from "@/src/services/fetcher";

/**
 * Hook personalizado para manejar operaciones de datos (GET, POST, PUT, DELETE) con SWR y Axios.
 *
 * @param {string} endpoint - La ruta base de la API.
 * @param {object} options - Opciones para la solicitud.
 * @param {string|null} options.id - ID del recurso específico.
 * @param {boolean} options.pagination - Indicador de paginación.
 * @param {object} options.params - Parámetros adicionales para la solicitud GET.
 *
 * @returns {object} - Contiene data, error, isLoading, y funciones de mutación con sus respectivos estados.
 */
export function useData(
  endpoint,
  { id = null, pagination = false, params = {} } = {}
) {
  const url = id ? `${endpoint}/${id}` : endpoint;
  const combinedParams = { pagination, ...params };
  const serializedParams = JSON.stringify(combinedParams);
  const key = [url, combinedParams];

  // Hook de obtención de datos con SWR
  const {
    data,
    error,
    isLoading,
    mutate: swrMutate,
  } = useSWR(key, ([url, params]) => fetcher(url, params), {
    revalidateOnFocus: false, // Opcional: Evita revalidar al enfocar la ventana
  });

  // Estados para operaciones de creación
  const [createLoading, setCreateLoading] = useState(false);
  const [createError, setCreateError] = useState(null);

  // Estados para operaciones de actualización
  const [updateLoading, setUpdateLoading] = useState(false);
  const [updateError, setUpdateError] = useState(null);

  // Estados para operaciones de eliminación
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteError, setDeleteError] = useState(null);

  /**
   * Función para crear un nuevo recurso (POST).
   *
   * @param {object} newData - Datos del nuevo recurso.
   *
   * @returns {Promise} - Promesa que resuelve con la respuesta de la API.
   */
  const create = async (newData) => {
    setCreateLoading(true);
    setCreateError(null);
    try {
      const response = await fetcher.post(endpoint, newData);
      // Actualizar la caché de SWR tras la creación
      swrMutate();
      setCreateLoading(false);
      return response;
    } catch (error) {
      setCreateError(error);
      setCreateLoading(false);
      throw error;
    }
  };

  /**
   * Función para actualizar un recurso existente (PUT).
   *
   * @param {string|number} id - ID del recurso a actualizar.
   * @param {object} updatedData - Datos actualizados del recurso.
   *
   * @returns {Promise} - Promesa que resuelve con la respuesta de la API.
   */
  const update = async (id, updatedData) => {
    setUpdateLoading(true);
    setUpdateError(null);
    try {
      const response = await fetcher.put(`${endpoint}/${id}`, updatedData);
      // Actualizar la caché de SWR tras la actualización
      swrMutate();
      setUpdateLoading(false);
      return response;
    } catch (error) {
      setUpdateError(error);
      setUpdateLoading(false);
      throw error;
    }
  };

  /**
   * Función para eliminar un recurso (DELETE).
   *
   * @param {string|number} id - ID del recurso a eliminar.
   *
   * @returns {Promise} - Promesa que resuelve con la respuesta de la API.
   */
  const remove = async (id) => {
    setDeleteLoading(true);
    setDeleteError(null);
    try {
      const response = await fetcher.delete(`${endpoint}/${id}`);
      // Actualizar la caché de SWR tras la eliminación
      swrMutate();
      setDeleteLoading(false);
      return response;
    } catch (error) {
      setDeleteError(error);
      setDeleteLoading(false);
      throw error;
    }
  };

  return {
    data,
    error,
    isLoading,
    create,
    createLoading,
    createError,
    update,
    updateLoading,
    updateError,
    remove,
    deleteLoading,
    deleteError,
  };
}
