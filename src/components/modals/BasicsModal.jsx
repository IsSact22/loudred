import {
  Dialog,
  DialogPanel,
  DialogTitle,
  Transition,
  TransitionChild,
} from "@headlessui/react";
import { IoIosClose } from "react-icons/io";

export default function BasicsModal({
  children,
  closeModal,
  handleKeyDown,
  icon,
  isOpen,
  item,
  title,
  titleCenter,
}) {
  return (
    <Transition appear show={isOpen}>
      <Dialog
        as="div"
        className="relative z-50"
        onClose={closeModal}
        onKeyDown={handleKeyDown}
      >
        {/* Backdrop */}
        <TransitionChild as="div">
          <div
            className="
              fixed inset-0 bg-black/25
              transition duration-300 
              data-[closed]:opacity-0
            "
          />
        </TransitionChild>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            {/* Panel del modal */}
            <TransitionChild as="div">
              <DialogPanel
                className="
                  min-w-80 max-w-[506px] transform rounded-xl bg-white p-6 
                  text-left align-middle shadow-xl 
                  transition duration-300 ease-out
                  data-[closed]:opacity-0
                  data-[closed]:scale-95
                "
              >
                {/* Botón de cerrar */}
                <button className="absolute top-1 right-2" onClick={closeModal}>
                  <IoIosClose className="w-7 h-7 hover:text-red-rusty" />
                </button>
                {/* Cabecera (ícono + título) */}
                <DialogTitle
                  as="h3"
                  className="relative truncate text-lg font-medium leading-6 text-gray-900"
                >
                  <div
                    className={`flex items-center ${
                      titleCenter ? "justify-center" : ""
                    } gap-2 bg-gradient-to-t bg-clip-text from-lavender to-purple-dark 
                    text-transparent font-bold text-lg`}
                  >
                    {icon}
                    {title}
                    <span className="truncate text-lavender">{item?.name}</span>
                  </div>
                </DialogTitle>

                {/* Contenido del modal */}
                {children}
              </DialogPanel>
            </TransitionChild>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
