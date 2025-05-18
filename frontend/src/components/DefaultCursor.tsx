import { motion } from "framer-motion";

type Props = {
  positionProp: { x: number; y: number };
  isActive: boolean;
};

const DefaultCursor = ({ positionProp, isActive }: Props) => {
  return (
    <motion.div
      className="w-5 h-5 rounded-full pointer-events-none fixed top-0 left-0 z-[10001] mix-blend-difference bg-white"
      animate={{
        x: positionProp.x - 12,
        y: positionProp.y - 12,
        opacity: isActive ? 1 : 0,
        scale: isActive ? 1 : 0.9,
      }}
      transition={{ type: "spring", stiffness: 500, damping: 50 }}
    />
  );
};

export default DefaultCursor;
