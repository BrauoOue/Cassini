import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

const text = [
  "Inner peace starts with outer comfort. So you always know where to go to feel good.",
  "We match your personal weather needs with real-time Earth insights",
  "So you always know where to go to feel good.",
];

const Footer = () => {
  const containerRef = useRef<HTMLDivElement | null>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "center center"], // or adjust offset as needed
  });

  // Use viewport height units vh instead of %
  const y = useTransform(scrollYProgress, [0, 1], ["-100vh", "0vh"]);
  const opacity = useTransform(scrollYProgress, [0, 1], [0.2, 1]);

  return (
    <div
      ref={containerRef}
      className="w-screen h-screen bg-black text-5xl px-[20%] tracking-tighter overflow-hidden flex items-center justify-center"
    >
      <motion.div style={{ y, opacity }} className="flex flex-col gap-10 text-white text-center">
        {text.map((item, index) => (
          <h1 key={index}>{item}</h1>
        ))}
      </motion.div>
    </div>
  );
};

export default Footer;
