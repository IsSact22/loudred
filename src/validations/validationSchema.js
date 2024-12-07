import * as yup from "yup";

export const validationSchema = yup.object().shape({
  
  name: yup.string()
    .required("El nombre es obligatorio")
    .matches(/^[a-zA-Z\s]+$/, "El nombre solo puede contener letras y espacios")
    .min(3, "El nombre debe tener al menos 3 caracteres"),

  lastname: yup.string()
    .required("El apellido es obligatorio")
    .matches(/^[a-zA-Z\s]+$/, "El apellido solo puede contener letras y espacios")
    .min(3, "El apellido debe tener al menos 3 caracteres"),

  usuario: yup.string()
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
  
  });