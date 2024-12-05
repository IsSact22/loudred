import * as yup from "yup";

export const validationSchema = yup.object().shape({
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
  });