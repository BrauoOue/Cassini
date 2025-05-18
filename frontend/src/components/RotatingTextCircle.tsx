import { motion } from "framer-motion";

type Props = {
  positionProp: { x: number; y: number };
  isActive: boolean;
};

const RotatingCircleText = ({ positionProp, isActive }: Props) => {
  return (
    <motion.div
      className="pointer-events-none fixed top-0 left-0 z-[10001] mix-blend-difference"
      animate={{
        x: positionProp.x - 80,
        y: positionProp.y - 80,
        opacity: isActive ? 1 : 0,
        scale: isActive ? 1 : 0.9,
      }}
      transition={{ type: "spring", stiffness: 120, damping: 20 }}
    >
      <motion.div
        className="w-40 h-40"
        animate={{ rotate: 360 }}
        transition={{
          repeat: Infinity,
          duration: 10,
          ease: "linear",
        }}
      >
        <svg viewBox="0 0 100 100" className="w-full h-full">
          <defs>
            <path
              id="circlePath"
              d="
                M 50, 50
                m -45, 0
                a 45,45 0 1,1 90,0
                a 45,45 0 1,1 -90,0
              "
            />
          </defs>
          <text
            fill="white"
            fontSize="7.5"
            fontWeight="bold"
            letterSpacing="1.5"
          >
            <textPath href="#circlePath" startOffset="0%">
              {Array(8).fill(" SCROLL TO INTERACT •").join("")}
            </textPath>
          </text>
        </svg>
      </motion.div>
    </motion.div>
  );
};

export default RotatingCircleText;
