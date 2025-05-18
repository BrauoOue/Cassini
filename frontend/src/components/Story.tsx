import { motion, useScroll, useTransform, MotionValue } from "framer-motion";
import { useRef } from "react";

const text =
  "SveMir helps you find your perfect inner space using your preferences and live satellite data. We combine smart data mapping and environmental insights to recommend places for your peace and wellbeing. Our platform blends human-centered design with Copernicus geospatial tech to guide your journey to calm. Not just locations — personalized escapes powered by data, designed for you.";

const Story = () => {
  return (
    <div className="w-screen h-screen bg-white flex">
      <div className="flex-1 flex items-center justify-center">
        <motion.h1
          className="text-gray-400 italic font-normal text-3xl"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ amount: 0.8, margin: "-100px", once: true }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          The gist of it
        </motion.h1>
      </div>
      <div className="text-[1.7em] text-black font-thin flex-1 px-[5%] flex flex-col justify-center">
        <Sentence line={text} />
      </div>
    </div>
  );
};

type SentenceProps = {
  line: string;
};

const Sentence = ({ line }: SentenceProps) => {
  const element = useRef<HTMLDivElement | null>(null);
  const words = line.split(" ");

  const { scrollYProgress } = useScroll({
    target: element,
    offset: ["start end", "end 0.4"],
  });

  const breakAtWe = 15;
  const breakAtNot = words.findIndex((w) => w === "Not");

  const firstLine = words.slice(0, breakAtWe);
  const secondLine = words.slice(breakAtWe, breakAtNot);
  const thirdLine = words.slice(breakAtNot);

  return (
    <div ref={element}>
      <div className="mb-4">
        {firstLine.map((word, idx) => {
          const rangeStart = idx / words.length;
          const rangeEnd = rangeStart + 1 / words.length;
          return (
            <Word
              key={idx}
              text={word}
              range={[rangeStart, rangeEnd]}
              progress={scrollYProgress}
              index={idx}
            />
          );
        })}
      </div>
      <div className="mb-4">
        {secondLine.map((word, idx) => {
          const globalIdx = idx + breakAtWe;
          const rangeStart = globalIdx / words.length;
          const rangeEnd = rangeStart + 1 / words.length;
          return (
            <Word
              key={globalIdx}
              text={word}
              range={[rangeStart, rangeEnd]}
              progress={scrollYProgress}
              index={globalIdx}
            />
          );
        })}
      </div>
      <div>
        {thirdLine.map((word, idx) => {
          const globalIdx = idx + breakAtNot;
          const rangeStart = globalIdx / words.length;
          const rangeEnd = rangeStart + 1 / words.length;
          return (
            <Word
              key={globalIdx}
              text={word}
              range={[rangeStart, rangeEnd]}
              progress={scrollYProgress}
              index={globalIdx}
            />
          );
        })}
      </div>
    </div>
  );
};

type WordProps = {
  text: string;
  range: [number, number];
  progress: MotionValue<number>;
  index: number;
};

const Word = ({ text, range, progress }: WordProps) => {
  const opacity = useTransform(progress, range, [0.4, 1]);

  return (
    <motion.span style={{ opacity }} className="inline-block pr-2">
      {text}
    </motion.span>
  );
};

export default Story;
