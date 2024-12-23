// Components
import BasicsModal from "@/src/components/modals/BasicsModal";
import { TextIconButton } from "@/src/components/buttons/TextIconButton";
// Hooks
import { useSessionDecision } from "@/src/hooks/useSessionDecision";
// Icons
import { TbExclamationCircle } from "react-icons/tb";

export default function SessionModal ({
  isOpen,
}) {
  const { handleRestore, handleHome } = useSessionDecision();
  return (
    <BasicsModal
      isOpen={isOpen}
      closeModal={handleHome}
      icon={<TbExclamationCircle className="text-red-rusty" />}
      title="¿Qué desea hacer?"
      titleCenter
    >
      <div className="my-4 text-center">
        <p className="text-navy-dark text-md font-bold">
          ¿Desea restaurar su sesión
        </p>
        <p className="text-navy-dark text-md font-bold">o ir a inicio?</p>
      </div>
      <div className="flex items-center justify-center gap-2 ">
        <TextIconButton
          margin="my"
          padding="py-1 px-3"
          text="Restaurar"
          type="button"
          onClick={handleRestore}
          bgColor="bg-white"
          bgColorHover="hover:bg-purple-dark"
          shadowAndColor="shadow-sm shadow-lavender"
          shadowAndColorHover="hover:shadow-md hover:shadow-lavender"
          scale="hover:scale-105"
          textColor="text-purple-dark"
          textWeight="font-bold"
        />
        <TextIconButton
          margin="my-"
          padding="py-1 px-2"
          text="Inicio"
          type="button"
          onClick={handleHome}
          bgColor="bg-white"
          bgColorHover="hover:bg-red-rusty"
          shadowAndColor="shadow-sm shadow-red-rusty"
          shadowAndColorHover="hover:shadow-md hover:shadow-red-rusty"
          scale="hover:scale-105"
          textColor="text-red-rusty"
          textWeight="font-medium"
        />
      </div>
    </BasicsModal>
  );
};