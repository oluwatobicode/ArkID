import { motion } from "framer-motion";
import { useEffect } from "react";

interface PreloaderProps {
  onComplete: () => void;
}

const Preloader = ({ onComplete }: PreloaderProps) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onComplete();
    }, 2500);

    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div className="min-h-screen bg-black mx-auto max-w-7xl flex items-center justify-center overflow-hidden">
      <motion.div
        initial={{ x: 0, opacity: 1 }}
        animate={{
          x: "100vw",
          opacity: [1, 1, 0],
        }}
        transition={{
          duration: 2,
          ease: "easeInOut",
          times: [0, 0.7, 1],
        }}
        className=""
      >
        <img src="/Logo (2).png" alt="ArkID Logo" />
      </motion.div>
    </div>
  );
};
export default Preloader;
