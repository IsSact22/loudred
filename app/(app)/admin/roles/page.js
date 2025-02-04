"use client"

import { useForm, FormProvider } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"
import { useData } from "@/src/hooks/useData"
import * as Yup from "yup"
import { DataTable } from "@/components/ui/data-table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Modal } from "@/components/ui/modal"
import { toast } from "react-hot-toast"
import { useState, useEffect } from "react"

// Esquema de validación para rol
const roleSchema = Yup.object().shape({
  name: Yup.string().required("El nombre es obligatorio"),
})

export default function RolesPage() {
  const {
    data: roles = [],
    isLoading,
    error,
    createData,
    updateData,
    deleteData,
  } = useData("/admin/roles", {});

  // Formulario para crear rol
  const methods = useForm({
    resolver: yupResolver(roleSchema),
    mode: "onChange",
  });
  const { handleSubmit, register, reset } = methods;

  const onSubmit = async (data) => {
    await createData(data);
    toast.success("Rol creado exitosamente");
    reset();
  };

  const onError = (errors) => {
    const mensajes = Object.values(errors)
      .map((error) => error.message)
      .join(", ");
    toast.error(`Error: ${mensajes}`);
  };

  // Estados y formulario para editar rol
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRole, setEditingRole] = useState(null);
  const editMethods = useForm({
    resolver: yupResolver(roleSchema),
    mode: "onChange",
    defaultValues: { name: "" }
  });
  const { handleSubmit: handleSubmitEdit } = editMethods;

  // Al abrir el modal, precargar datos del rol
  useEffect(() => {
    if (editingRole) {
      editMethods.reset({
        name: editingRole.name || ""
      });
    }
  }, [editingRole, editMethods]);

  // Abre el modal y define el rol a editar
  const openEditModal = (role) => {
    setEditingRole(role);
    setIsModalOpen(true);
  };

  // Llamado al actualizar rol (patch)
  const onSubmitEdit = async (data) => {
    const payload = { ...editingRole, ...data };
    await updateData(payload, editingRole.id);
    toast.success("Rol actualizado exitosamente");
    setIsModalOpen(false);
    setEditingRole(null);
  };

  // Acción para eliminar rol
  const handleDelete = async (role) => {
    await deleteData(role.id);
    toast.success("Rol eliminado exitosamente");
  };

  // Columnas para el DataTable
  const columns = [
    { header: "Nombre", accessor: "name" },
  ];

  // Acciones en cada fila de rol
  const actions = (role) => (
    <div className="flex space-x-2">
      <Button variant="outline" size="sm" onClick={() => openEditModal(role)}>
        Editar
      </Button>
      <Button variant="destructive" size="sm" onClick={() => handleDelete(role)}>
        Eliminar
      </Button>
    </div>
  );

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Gestión de Roles</h1>

      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(onSubmit, onError)} className="mb-8 space-y-4">
          <div>
            <Label htmlFor="name">Nombre</Label>
            <Input id="name" {...register("name")} required />
          </div>
          <Button type="submit">Crear Rol</Button>
        </form>
      </FormProvider>

      <DataTable data={roles} columns={columns} actions={actions} />

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Editar Rol"
      >
        {editingRole && (
          <FormProvider {...editMethods}>
            <form onSubmit={handleSubmitEdit(onSubmitEdit)} className="space-y-4">
              <div>
                <Label htmlFor="edit-name">Nombre</Label>
                <Input id="edit-name" {...editMethods.register("name")} required />
              </div>
              <div className="flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>
                  Cancelar
                </Button>
                <Button type="submit">Guardar Cambios</Button>
              </div>
            </form>
          </FormProvider>
        )}
      </Modal>
    </div>
  );
}