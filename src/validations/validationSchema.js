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
      "El usuario debe comenzar con una letra mayúscula, luego minúsculas y al menos un número"
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
  title: yup
    .string()
    .required("El nombre de la canción es obligatorio")
    .min(1, "El nombre debe tener al menos 1 caracter"),

  category: yup.object().nullable().required("Debes seleccionar una categoría"),

  audio: yup
    .mixed()
    .required("Sube la canción")
    .test("fileSize", "El archivo de la canción supera los 10 MB.", (value) => {
      // value es un array de archivos (por ejemplo, value[0] es el primer archivo)
      return value && value[0] && value[0].size <= 10 * 1024 * 1024;
    }),
  cover: yup
    .mixed()
    .required("Sube la portada")
    .test("fileSize", "La portada supera los 10 MB.", (value) => {
      return value && value[0] && value[0].size <= 10 * 1024 * 1024;
    }),
});


// Esquema de validación para ajustes de usuario
export const updateSchema = yup.object().shape({
  name: yup.string()
    .matches(/^[a-zA-Z\s]+$/, "El nombre solo puede contener letras y espacios")
    .min(3, "El nombre debe tener al menos 3 caracteres"),

  lastname: yup.string()
    .matches(/^[a-zA-Z\s]+$/, "El apellido solo puede contener letras y espacios")
    .min(3, "El apellido debe tener al menos 3 caracteres"),

  password: yup.string()
    .min(8, "La contraseña debe tener al menos 8 caracteres")
    .matches(/[A-Z]/, "La contraseña debe incluir al menos una letra mayúscula")
    .matches(/[a-z]/, "La contraseña debe incluir al menos una letra minúscula")
    .matches(/\d/, "La contraseña debe incluir al menos un número"),

  confirmPassword: yup.string()
    .oneOf([yup.ref("password")], "Las contraseñas no coinciden"),
  
});
