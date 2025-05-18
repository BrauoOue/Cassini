import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const sponsorsList = [
  { name: "Cassini", image: "/sponsors/cassini_.jpg" },
  { name: "Copernicus", image: "/sponsors/copernicus.jpg" },
  { name: "Netaville", image: "/sponsors/netaville.png" },
  { name: "Netcetera", image: "/sponsors/netcetera.png" },
];

const shuffleArray = (array: typeof sponsorsList) => {
  return [...array].sort(() => Math.random() - 0.5);
};

const SponsorLabel = () => {
  const [sponsors, setSponsors] = useState(sponsorsList);

  useEffect(() => {
    const interval = setInterval(() => {
      setSponsors(shuffleArray(sponsorsList));
    }, 5000); 

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full flex flex-wrap justify-center items-center gap-25 p-8">
      <AnimatePresence mode="wait">
        {sponsors.map((sponsor, index) => (
          <motion.div
            key={sponsor.name + index}
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -100 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="flex items-center justify-center"
          >
            <img
              src={sponsor.image}
              alt={sponsor.name}
              className="h-16 object-contain grayscale hover:grayscale-0 transition duration-300"
            />
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

export default SponsorLabel;
