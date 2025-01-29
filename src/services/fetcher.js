// /src/services/fetcher.js
import { apiClient } from "@/src/services/apiClient";

/**
 * Función fetcher para realizar solicitudes GET.
 *
 * @param {string} url - La URL de la solicitud.
 * @param {object} params - Parámetros de consulta.
 *
 * @returns {Promise} - Promesa que resuelve con los datos de la respuesta.
 */
export const fetcher = (url, params) =>
  apiClient.get(url, { params }).then((res) => res.data);

/**
 * Extensión del fetcher para soportar métodos POST, PUT y DELETE.
 */
fetcher.post = (url, data) => apiClient.post(url, data).then((res) => res.data);

fetcher.put = (url, data) => apiClient.put(url, data).then((res) => res.data);

fetcher.patch = (url, data) => apiClient.patch(url, data).then((res) => res.data);

fetcher.delete = (url, data) => apiClient.delete(url, { data }).then((res) => res.data);

