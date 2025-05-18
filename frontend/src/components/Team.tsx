import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";

const teamItems = [
  { name: "Cassini", image: "/sponsors/cassini_.jpg" },
  { name: "Copernicus", image: "/sponsors/copernicus.jpg" },
  { name: "Netaville", image: "/sponsors/netaville.png" },
  { name: "Netcetera", image: "/sponsors/netcetera.png" },
];

const Team = () => {
  const [idx, setIdx] = useState<number | null>(null);

  return (
    <div className="bg-white w-screen">
      <div className="mx-[10%] h-auto">
        <motion.h1
          className="text-gray-400 italic font-normal text-3xl mb-5"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ amount: 0.8, margin: "-100px", once: true }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          What we do
        </motion.h1>

        <hr className="border-t border-black mb-5" />

        {teamItems.map((item, index) => (
          <div key={index} className="relative">
            <div className="px-[5%] text-black text-[8em] text-center select-none">
              {item.name}
            </div>
            <div
              onMouseEnter={() => setIdx(index)}
              onMouseLeave={() => setIdx(null)}
              className="absolute inset-0 w-full h-full cursor-pointer"
            />
            <hr className="border-t border-black" />
          </div>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {idx !== null && <PictureSlider idx={idx} />}
      </AnimatePresence>
    </div>
  );
};

export default Team;

const IMAGE_HEIGHT = 208;

const PictureSlider = ({ idx }: { idx: number }) => {
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
      animate={{ x: position.x - 104, y: position.y - 104 }}
      exit={{ scaleY: 0, opacity: 0, transition: {duration: 0.45} }}
      transition={{ type: "spring", stiffness: 500, damping: 50 }}
      className="w-68 h-62 rounded-md overflow-hidden fixed top-0 left-0 origin-center shadow-lg bg-white pointer-events-none flex"
    >
      <motion.div
        animate={{ translateY: -idx * IMAGE_HEIGHT }}
        transition={{ ease: "easeInOut", duration: 0.5 }}
        className="flex flex-col"
      >
        {teamItems.map((item, index) => (
          <img
            key={index}
            src={item.image}
            alt={item.name}
            className="w-full h-52 object-cover select-none pointer-events-none"
            draggable={false}
          />
        ))}
      </motion.div>
    </motion.div>
  );
};
