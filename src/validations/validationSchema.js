import * as yup from "yup";

// Esquema de validación para el Login
export const loginSchema = yup.object().shape({
  username: yup.string()
    .required("El usuario es obligatorio"),
  password: yup.string()
    .required("La contraseña es obligatoria"),
});

// Esquema de validación para el Registro
export const registerSchema = yup.object().shape({
  name: yup.string()
    .required("El nombre es obligatorio")
    .matches(/^[a-zA-Z\s]+$/, "El nombre solo puede contener letras y espacios")
    .min(3, "El nombre debe tener al menos 3 caracteres"),
  lastname: yup.string()
    .required("El apellido es obligatorio")
    .matches(/^[a-zA-Z\s]+$/, "El apellido solo puede contener letras y espacios")
    .min(3, "El apellido debe tener al menos 3 caracteres"),
  username: yup.string()
    .required("El usuario es obligatorio")
    .matches(
      /^[A-Z][a-zA-Z0-9]*$/,
      "El usuario debe comenzar con una letra mayúscula, contener solo letras y números, y tener al menos un número"
    )
    .matches(/\d/, "El usuario debe incluir al menos un número"),
  password: yup.string()
    .required("La contraseña es obligatoria")
    .min(8, "La contraseña debe tener al menos 8 caracteres")
    .matches(/[A-Z]/, "La contraseña debe incluir al menos una letra mayúscula")
    .matches(/[a-z]/, "La contraseña debe incluir al menos una letra minúscula")
    .matches(/\d/, "La contraseña debe incluir al menos un número")
    .matches(
      /^[A-Za-z0-9]*$/,
      "La contraseña no debe contener caracteres especiales"
    ),
  confirmPassword: yup.string()
    .required("Debe confirmar la contraseña")
    .oneOf([yup.ref("password")], "Las contraseñas no coinciden"),
  termsAccepted: yup.boolean()
    .oneOf([true], "Los términos y condiciones son obligatorios"),
  userAccepted: yup.boolean()
    .oneOf([true], "Aceptar este término es obligatorio"),
});

// Esquema de validación para formulario de canción
export const songsSchema = yup.object().shape({
  title: yup.string()
    .required("El nombre de la canción es obligatorio")
    .min(1, "El nombre debe tener al menos 1 caracter"),

  artist: yup.string()
    .required("El nombre del artista es obligatorio")
    .matches(/^[a-zA-Z\s]+$/, "El nombre solo puede contener letras y espacios")
    .min(2, "El nombre debe tener al menos 2 caracteres"),
  
  audioFile: yup
    .mixed()
    .test('fileType', 'Solo se permiten archivos MP3', (value) => value?.[0]?.type === 'audio/mp3')
    .test('fileSize', 'El archivo debe ser menor a 10MB', (value) => value?.[0]?.size <= 10 * 1024 * 1024),

  imageFile: yup
    .mixed()
    .test('fileType', 'Solo se permiten imágenes PNG', (value) => value?.[0]?.type === 'image/png')
    .test('fileSize', 'El archivo debe ser menor a 10MB', (value) => value?.[0]?.size <= 10 * 1024 * 1024),
  
  category: yup
    .object()
    .nullable()
    .required('Debes seleccionar una categoría'),
});
