"use client"

import { useForm, FormProvider } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"
import { useData } from "@/src/hooks/useData"
import { registerSchema } from "@/src/validations/validationSchema"
import { DataTable } from "@/components/ui/data-table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Modal } from "@/components/ui/modal"
import { toast } from "react-hot-toast"
import { useState, useEffect } from "react"

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
    resolver: yupResolver(registerSchema),
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

  // Llamado al actualizar usuario (patch)
  const onSubmitEdit = async (data) => {
    // Enviar solo los cambios; si los campos de contraseña están vacíos, no se envían
    const payload = { ...editingUser, ...data };
    if (!data.password && !data.confirmPassword) {
      delete payload.password;
      delete payload.confirmPassword;
    }
    await updateData(payload, editingUser.id);
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

      <FormProvider {...methods}>
        <form
          onSubmit={handleSubmit(onSubmit, onError)}
          className="mb-8 space-y-4"
        >
          <div>
            <Label htmlFor="name">Nombre</Label>
            <Input id="name" {...register("name")} required />
          </div>
          <div>
            <Label htmlFor="lastname">Apellido</Label>
            <Input id="lastname" {...register("lastname")} required />
          </div>
          <div>
            <Label htmlFor="username">Usuario</Label>
            <Input id="username" {...register("username")} required />
          </div>
          <div>
            <Label htmlFor="password">Contraseña</Label>
            <Input
              id="password"
              type="password"
              {...register("password")}
              required
            />
          </div>
          <div>
            <Label htmlFor="confirmPassword">Confirmar Contraseña</Label>
            <Input
              id="confirmPassword"
              type="password"
              {...register("confirmPassword")}
              required
            />
          </div>
          <Button type="submit">Crear Usuario</Button>
        </form>
      </FormProvider>

      <DataTable data={users} columns={columns} actions={actions} />

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Editar Usuario"
      >
        {editingUser && (
          <FormProvider {...editMethods}>
            <form
              onSubmit={handleSubmitEdit(onSubmitEdit)}
              className="space-y-4"
            >
              <div>
                <Label htmlFor="edit-name">Nombre</Label>
                <Input
                  id="edit-name"
                  {...editMethods.register("name")}
                  required
                />
              </div>
              <div>
                <Label htmlFor="edit-lastname">Apellido</Label>
                <Input
                  id="edit-lastname"
                  {...editMethods.register("lastname")}
                  required
                />
              </div>
              <div>
                <Label htmlFor="edit-username">Usuario</Label>
                <Input
                  id="edit-username"
                  {...editMethods.register("username")}
                  required
                />
              </div>
              <div>
                <Label htmlFor="edit-password">Contraseña</Label>
                <Input
                  id="edit-password"
                  type="password"
                  {...editMethods.register("password")}
                  placeholder="Dejar en blanco para no cambiar"
                />
              </div>
              <div>
                <Label htmlFor="edit-confirmPassword">
                  Confirmar Contraseña
                </Label>
                <Input
                  id="edit-confirmPassword"
                  type="password"
                  {...editMethods.register("confirmPassword")}
                  placeholder="Dejar en blanco para no cambiar"
                />
              </div>
              <div className="flex justify-end space-x-2">
                <Button
                  className="mt-2"
                  type="button"
                  variant="outline"
                  onClick={() => setIsModalOpen(false)}
                >
                  Cancelar
                </Button>
                <Button className="mt-2" type="submit">
                  Guardar Cambios
                </Button>
              </div>
            </form>
          </FormProvider>
        )}
      </Modal>
    </div>
  );
}