import { FormProvider } from "react-hook-form";
import { Modal } from "@/components/ui/modal";
import UserForm from "./UserForm";

export default function EditUserModal({ isOpen, onClose, editMethods, onSubmitEdit }) {
  const { handleSubmit } = editMethods;
  
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Editar Usuario">
      <FormProvider {...editMethods}>
        <UserForm
          register={editMethods.register}
          handleSubmit={handleSubmit}
          onSubmit={onSubmitEdit}
          isEditing={true}
          buttonText="Guardar Cambios"
        />
      </FormProvider>
    </Modal>
  );
}