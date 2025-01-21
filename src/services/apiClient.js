import axios from "axios";

/* Toast */
import toast from "react-hot-toast";

/* Utils */
import { broadcastLogout } from "@/src/utils/authChannel";

export const apiClient = axios.create({
  baseURL: "/api", // URL base de la API
});

const MAX_RETRIES = 2;

// Funciones manejadoras de errores
const handleUnauthorized = (errorMessage, error) => {
  toast.error(errorMessage || "No autorizado, autentíquese.");
  broadcastLogout("sessionExpired");
  return Promise.reject(error);
};

const handleForbidden = (errorMessage, error) => {
  toast.error(
    errorMessage || "Acceso denegado, no tienes permisos para esta acción."
  );
  window.history.back(); // Redirige a la ruta anterior
  return Promise.reject(error);
};

const handleNetworkError = (config, error) => {
  console.error("Error 0: Problema de red.");
  toast.error("Error de red. Verifica tu conexión.");

  config._retry = config._retry || 0;

  if (config._retry < MAX_RETRIES) {
    config._retry += 1;
    return apiClient(config);
  } else {
    return Promise.reject(error); // Rechaza la promesa después de agotar los reintentos
  }
};

const handleValidationErrors = (errorMessage, error) => {
  const data = error.response.data;
  if (data) {
    if (typeof data.error === "string") {
      toast.error(data.error);
    } else {
      const validationErrors = data.message || data.messages || data.error;
      Object.keys(validationErrors).forEach((field) => {
        validationErrors[field].forEach((msg) => {
          toast.error(msg);
        });
      });
    }
  } else {
    toast.error(errorMessage || "Error de validación.");
  }
  return Promise.reject(error);
};

const handleNotFound = (errorMessage, error) => {
  toast.error(errorMessage || "Recurso no encontrado.");
  return Promise.reject(error);
};

const handleServerError = (errorMessage, error) => {
  console.error("Error 500: Problema con el servidor.");
  toast.error(errorMessage || "Ocurrió un problema con el servidor.");
  return Promise.reject(error);
};

const handleDefaultError = (errorMessage, error) => {
  toast.error(errorMessage || "Ocurrió un error.");
  return Promise.reject(error);
};

// Mapeo de códigos de estado a funciones manejadoras
const errorHandlers = {
  401: handleUnauthorized,
  403: handleForbidden,
  400: handleValidationErrors,
  422: handleValidationErrors,
  404: handleNotFound,
  500: handleServerError,
};

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const { response, config } = error;

    // Extraer mensaje genérico
    const errorMessage =
      response?.data?.messages ||
      response?.data?.message ||
      response?.data?.error ||
      "Ocurrió un error.";

    // Manejo de problemas de red
    if (error.request?.status === 0) {
      return handleNetworkError(config, error);
    }

    // Si no hay respuesta del servidor
    if (!response) {
      toast.error("No se recibió respuesta del servidor.");
      return Promise.reject(error);
    }

    const handler = errorHandlers[response.status] || handleDefaultError;
    return handler(errorMessage, error);
  }
);
