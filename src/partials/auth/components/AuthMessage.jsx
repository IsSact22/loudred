const AuthMessage = ({ action }) => {
  return (
    <div className="flex flex-col justify-center items-end p-8 rounded-lg">
      <p className="text-6xl font-semibold text-purple-800 mb-6">
        Disfruta del mejor
      </p>
      <p className="text-6xl font-semibold text-purple-800 mb-6">contenido</p>
      <p className="text-6xl text-red-600">
        {action === "login" ? "Inicia sesión ya" : "Regístrate ahora"}
      </p>
    </div>
  );
};

export default AuthMessage;
