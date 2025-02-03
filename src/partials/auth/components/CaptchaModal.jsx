// Components
import BasicsModal from "@/src/components/modals/BasicsModal";
import Captcha from "@/src/components/Captcha";
// Icons
import { TbExclamationCircle } from "react-icons/tb";
// Store
import { useCaptchaStore } from "@/src/stores/captchaStore";
// Toast
import { toast } from "react-hot-toast";

export default function CaptchaModal({ isOpen }) {
  const { setShowModal } = useCaptchaStore();

  // Función que previene el cierre del modal
  const handlePreventClose = () => {
    toast.error("¡Debes resolver el captcha para continuar!");
  };

  return (
    <BasicsModal
      isOpen={isOpen}
      onClose={handlePreventClose} // Bloqueamos el cierre tradicional
      icon={<TbExclamationCircle className="text-red-rusty" />}
      title="¿Eres un robot?"
      description={"Resuelva el captcha para continuar"}
      isCentered
      closeOnOverlayClick={false} // Deshabilitar clic fuera
      closeOnEsc={false} // Deshabilitar tecla ESC
    >
      <div className="flex items-center justify-center gap-2 ">
        <Captcha onSuccess={() => setShowModal(false)} />
      </div>
    </BasicsModal>
  );
}
