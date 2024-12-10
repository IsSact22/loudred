import { format } from "date-fns";
import { es } from "date-fns/locale";

/* Función para formatear fechas y horas */
export const formatDateTime = (dateString) => {
  if (!dateString) return '';
  return format(new Date(dateString), 'PPpp', { locale: es });
};


/* Saludo de Bienvenida */
export const getGreeting = () => {
  // VARIABLES
  /* Hora Actual */
  let horas = new Date().getHours();

  // CONDICIONAL
  /* Comprobación de la Hora Actual Mayor que Cuatro y Menor o Igual que Doce */
  if (horas > 4 && horas <= 12) return "Buenos días";

  // CONDICIONAL
  /* Comprobación de la Hora Actual Mayor que Doce y Menor o Igual que Diecinueve */
  if (horas > 12 && horas <= 19) return "Buenas tardes";

  // RETORNO
  return "Buenas noches";
};

/* Ordenamiento de un Resultado de un Response */
export const orderDesc = (array) =>
  array.sort((a, b) => {
    // CONDICIONAL
    /* Comprobación del id del Primer Argumento Mayor que el id del Segundo Argumento */
    if (a.id > b.id) return -1;

    // CONDICIONAL
    /* Comprobación del id del Primer Argumento Menor que el id del Segundo Argumento */
    if (a.id < b.id) return 1;

    // RETORNO
    return 0;
  });

/* Obtención de un Rango de Elementos de un Arreglo */
export const range = (start, end) => {
  // VARIABLES
  /* Tamaño del Rango */
  let length = end - start + 1;

  // RETORNO
  return Array.from({ length }, (_, index) => index + start);
};

/* Ponerle mayusculas a la primera letra de una palabra */
export const capitalize = (word) => {
  if (word) {
    return word
      .split(/(\s|-|\/)/g)
      .map((word) =>
        word.match(/(\s|-|\/)/g)
          ? word
          : word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
      )
      .join("");
  }
};

/* Función para convertir un color hexadecimal a RGB */
export const hexToRgb = (hex) => {
  hex = hex?.replace(/^#/, "");
  const bigint = parseInt(hex, 16);
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;
  return `${r}, ${g}, ${b}`;
};

/* Evento para evitar la tecla Enter */
export const handleKeyDown = (event) => {
  if (event.key === "Enter") {
    event.preventDefault();
  }
};

export const  IDENTIFICATION_TYPES = [
  { id: 'V', name: 'V' },
  { id: 'E', name: 'E' },
  { id: 'J', name: 'J' },
  { id: 'G', name: 'G' },
  { id: 'P', name: 'P' },
];