// Components
import BasicsModal from "@/src/components/modals/BasicsModal";
import TextIconButton from "@/src/components/buttons/TextIconButton";
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
      onClose={handleHome}
      icon={<TbExclamationCircle className="text-red-rusty" />}
      title="¿Qué desea hacer?"
      description={"¿Desea restaurar su sesión o ir a inicio?"}
      isCentered
    >
      <div className="flex items-center justify-center gap-2 ">
        <TextIconButton
          margin="my"
          padding="py-1 px-3"
          text="Restaurar"
          type="button"
          onClick={handleRestore}
          bgColor="bg-white"
          bgColorHover="hover:bg-lavender"
          shadowAndColor="shadow-lg shadow-lavender/50"
          shadowAndColorHover="hover:shadow-md hover:shadow-lavender"
          scale="hover:scale-105"
          textColor="text-lavender"
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
          shadowAndColor="shadow-lg shadow-red-rusty/20"
          shadowAndColorHover="hover:shadow-md hover:shadow-red-rusty"
          scale="hover:scale-105"
          textColor="text-red-rusty"
          textWeight="font-medium"
        />
      </div>
    </BasicsModal>
  );
};