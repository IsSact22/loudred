import {
  Dialog,
  DialogPanel,
  DialogTitle,
  Description,
} from "@headlessui/react";
import { AnimatePresence, motion } from "framer-motion";
import { TbX } from "react-icons/tb";
import React from "react";

export default function BasicsModal2({
  isOpen,
  onClose,
  title,
  description,
  children,
  isCentered = false,
  icon,
}) {
  return (
    <AnimatePresence>
      {isOpen && (
        <Dialog
          static
          open={isOpen}
          onClose={onClose}
          className="relative z-50"
        >
          {/* Fondo oscuro con Framer Motion */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/30"
          />
          {/* Contenedor que centra el contenido del modal */}
          <div className="fixed inset-0 flex w-screen items-center justify-center">
            {/* Panel del diálogo con animaciones de entrada y salida */}
            <DialogPanel
              as={motion.div}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="min-w-h-80 max-w-[480px] space-y-4 rounded-xl bg-indigo-50 px-6 pb-6 pt-4 shadow-xl relative"
            >
              {/* Botón de cierre en la esquina superior derecha */}
              <button
                onClick={onClose}
                className="absolute top-2 right-2 text-gray-500 hover:text-red-rusty duration-300"
                aria-label="Close modal"
              >
                <TbX size={24} />
              </button>
              {/* Título del modal */}
              <DialogTitle
                className={`flex items-center gap-2 text-transparent font-semibold bg-gradient-to-t bg-clip-text from-lavender to-purple-dark 
                ${isCentered ? "justify-center" : ""}`}
              >
                {icon}
                {title}
              </DialogTitle>
              {/* Descripción opcional */}
              {description && (
                <Description
                  className={`text-gray-700 font-normal ${
                    isCentered ? "text-center" : ""
                  }`}
                >
                  {description}
                </Description>
              )}
              {/* Contenido del modal */}
              <div>{children}</div>
            </DialogPanel>
          </div>
        </Dialog>
      )}
    </AnimatePresence>
  );
}
