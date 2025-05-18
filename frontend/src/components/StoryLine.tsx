import { useState, useEffect, useRef } from "react";
import { motion, useInView } from "framer-motion";

const text =
  "“Transforming data into decisions, and visions into reality – that’s the Atomic Health difference.”";

const team = ["Team BrauOue,", "BlaBla,", "POMOZITE MI DRUGOVI"];

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.15,
    },
  },
};

const wordVariants = {
  hidden: {
    opacity: 0,
    y: 30,
    filter: "blur(4px)",
  },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: {
      duration: 0.6,
      ease: "easeOut",
    },
  },
};

const StoryLine = () => {
  const containerRef = useRef(null);
  const isInView = useInView(containerRef, { amount: 0.5, once: true });

  const [quoteAnimated, setQuoteAnimated] = useState(false);
  const [teamAnimated, setTeamAnimated] = useState(false);

  useEffect(() => {
    if (isInView) {
      setQuoteAnimated(true);
    }
  }, [isInView]);

  const quoteWords = text.split(" ");

  return (
    <div
      ref={containerRef}
      className="w-screen h-[80vh] flex flex-col items-center justify-center bg-white px-4 gap-12"
    >
      {/* Quote on first line */}
      <motion.div
        className="text-black text-5xl font-thin flex flex-wrap justify-center max-w-4xl"
        variants={containerVariants}
        initial="hidden"
        animate={quoteAnimated ? "visible" : "hidden"}
        onAnimationComplete={() => setTeamAnimated(true)}
      >
        {quoteWords.map((word, index) => (
          <motion.span
            key={index}
            variants={wordVariants}
            style={{ marginRight: "0.3em" }}
          >
            {word}
          </motion.span>
        ))}
      </motion.div>

      {/* Team on new line with margin-top */}
      <motion.div
        className="flex flex-wrap justify-center max-w-4xl gap-1.5 mt-8"
        variants={containerVariants}
        initial="hidden"
        animate={teamAnimated ? "visible" : "hidden"}
      >
        {team.map((line, idx) => (
          <motion.span
            key={idx}
            variants={wordVariants}
            style={{ marginRight: "0.3em" }}
            className="text-gray-500 text-[19px] font-normal"
          >
            {line}
          </motion.span>
        ))}
      </motion.div>
    </div>
  );
};

export default StoryLine;
