import React from "react";
import {
  Transition,
  TransitionChild,
  Dialog,
  DialogPanel,
  DialogTitle,
} from "@headlessui/react";
import { IoIosClose } from "react-icons/io"; // Importación del icono faltante
import { Fragment } from "react"; // Importación de Fragment

export default function BasicsModal({ children, closeModal, handleKeyDown, icon, isOpen, item, title, titleCenter}) {
  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog
        as="div"
        className="relative z-50"
        onClose={closeModal}
        onKeyDown={handleKeyDown}
      >
        <TransitionChild
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/25" />
        </TransitionChild>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex items-center justify-center min-h-full p-4 text-center">
            <TransitionChild
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <DialogPanel className="min-w-80 max-w-[506px] transform rounded-xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                <button className="absolute top-1 right-2" onClick={closeModal}>
                  <IoIosClose className="w-7 h-7 hover:text-crimson" />
                </button>
                <DialogTitle
                  as="h3"
                  className="truncate text-lg font-medium leading-6 text-gray-900"
                >
                  <div className={`flex items-center ${titleCenter ? "justify-center" : ""} gap-2 bg-gradient-to-t bg-clip-text from-lavender to-purple-dark text-transparent 
                  font-bold text-lg`}>
                    {icon}
                    {title}
                    <span className="truncate text-emerald">{item?.name}</span>
                  </div>
                </DialogTitle>
                {children}
              </DialogPanel>
            </TransitionChild>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};
