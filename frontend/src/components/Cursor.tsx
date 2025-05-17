import { motion } from "motion/react";
import { useState, useEffect } from "react";

const Cursor = () => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  useEffect(() => {
    const move = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", move);

    return () => window.removeEventListener("mousemove", move);
  }, []);
  return (
    <motion.div
      initial={{ opacity: 1 }}
      className="w-5 h-5 rounded-full pointer-events-none fixed top-0 left-0  z-[10001] mix-blend-difference bg-white"
      animate={{x: position.x - 12, y: position.y - 12}}
      transition={{type:"spring", stiffness: 500, damping:50}}
    />
  );
};

export default Cursor;
