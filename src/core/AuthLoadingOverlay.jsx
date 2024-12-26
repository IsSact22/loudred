import { motion, AnimatePresence } from "framer-motion";

export const AuthLoadingOverlay = ({ show, TransitionComponent }) => {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="flex justify-center items-center text-center min-w-screen min-h-screen z-50 fixed inset-0 bg-white"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
        >
          <TransitionComponent />
        </motion.div>
      )}
    </AnimatePresence>
  );
};
