"use client"

import { useForm, FormProvider } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"
import { useData } from "@/src/hooks/useData"
import { registerSchema } from "@/src/validations/validationSchema"
import { updateSchema } from "@/src/validations/validationSchema"
import { DataTable } from "@/components/ui/data-table"
import { Button } from "@/components/ui/button"
import { toast } from "react-hot-toast"
import { useState, useEffect } from "react"
import UserForm from "@/src/partials/admin/components/UserForm"
import EditUserModal from "@/src/partials/admin/components/EditUserModal"

export default function UsersPage() {
  const {
    data: users = [],
    isLoading,
    error,
    createData,
    updateData,
    deleteData,
  } = useData("/admin/users");

  // Formulario para crear un usuario
  const methods = useForm({
    resolver: yupResolver(registerSchema),
    mode: "onChange",
  });
  const { handleSubmit, register, reset } = methods;

  const onSubmit = async (data) => {
    await createData(data);
    toast.success("Usuario creado exitosamente");
    reset();
  };

  const onError = (errors) => {
    const mensajes = Object.values(errors)
      .map((error) => error.message)
      .join(", ");
    toast.error(`Error: ${mensajes}`);
  };

  // Estados y formulario para editar usuario
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const editMethods = useForm({
    resolver: yupResolver(updateSchema),
    mode: "onChange",
    defaultValues: {
      name: "",
      lastname: "",
      username: "",
      password: "",
      confirmPassword: ""
    }
  });
  const { handleSubmit: handleSubmitEdit } = editMethods;

  // Cuando se abre el modal, precargar datos del usuario (excepto contraseña)
  useEffect(() => {
    if (editingUser) {
      editMethods.reset({
        name: editingUser.name || "",
        lastname: editingUser.lastname || "",
        username: editingUser.username || "",
        password: "",
        confirmPassword: ""
      });
    }
  }, [editingUser, editMethods]);

  // Abre el modal y define el usuario a editar
  const openEditModal = (user) => {
    setEditingUser(user);
    setIsModalOpen(true);
  };

  // Llamado al actualizar usuario (post que emula patch usando FormData y sin enviar campos vacíos)
  const onSubmitEdit = async (data) => {
    // Combinar editingUser y data en un objeto
    const merged = { ...editingUser, ...data };
  
    // Crear un objeto FormData y agregar solo valores no vacíos
    const formData = new FormData();
    for (const key in merged) {
      if (merged[key] === "" || merged[key] === null || merged[key] === undefined) {
        continue;
      }
      formData.append(key, merged[key]);
    }
  
    await createData(formData, editingUser.id);
    toast.success("Usuario actualizado exitosamente");
    setIsModalOpen(false);
    setEditingUser(null);
  };

  // Acción para eliminar usuario
  const handleDelete = async (user) => {
    await deleteData(user.id);
    toast.success("Usuario eliminado exitosamente");
  };

  // Columnas para el DataTable
  const columns = [
    { header: "Nombre", accessor: "name" },
    { header: "Apellido", accessor: "lastname" },
    { header: "Usuario", accessor: "username" },
  ];

  // Acciones en cada fila de usuario
  const actions = (user) => (
    <div className="flex space-x-2">
      <Button variant="outline" size="sm" onClick={() => openEditModal(user)}>
        Editar
      </Button>
      <Button variant="destructive" size="sm" onClick={() => handleDelete(user)}>
        Eliminar
      </Button>
    </div>
  );

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Gestión de Usuarios</h1>
      <div className="grid grid-cols-2 gap-10">
        <FormProvider {...methods}>
          <UserForm
            register={register}
            handleSubmit={handleSubmit}
            onSubmit={onSubmit}
            onError={onError}
          />
        </FormProvider>
        <div className="mt-3">
          <DataTable data={users} columns={columns} actions={actions} />
        </div>
      </div>

      <EditUserModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        editMethods={editMethods}
        onSubmitEdit={onSubmitEdit}
      />
    </div>
  );
}