import {
  motion,
  useScroll,
  useTransform,
  useMotionTemplate,
} from "motion/react";
import { useRef } from "react";

// clip-path: polygon(18% 19%, 95% 19%, 85% 84%, 7% 84%);

const Video = () => {
  const ref = useRef<HTMLDivElement | null>(null);

  const { scrollYProgress } = useScroll({
    target: ref,
  });

  const clip1 = useTransform(scrollYProgress, [0, 0.6], [18, 0]);
  const clip2 = useTransform(scrollYProgress, [0, 0.6], [19, 0]);

  const clip3 = useTransform(scrollYProgress, [0, 0.6], [85, 100]);
  const clip4 = useTransform(scrollYProgress, [0, 0.6], [84, 100]);

  const clip5 = useTransform(scrollYProgress, [0.6, 1], [95, 100]);
  const clip6 = useTransform(scrollYProgress, [0.6, 1], [19, 0]);

  const clip7 = useTransform(scrollYProgress, [0.6, 1], [7, 0]);
  const clip8 = useTransform(scrollYProgress, [0.6, 1], [84, 100]);

  const clipPath = useMotionTemplate`polygon(${clip1}% ${clip2}%,${clip5}% ${clip6}%,${clip3}% ${clip4}%,${clip7}% ${clip8}%)`;

  return (
    <div ref={ref} className="w-screen h-[200vh] relative">
      <motion.div style={{clipPath}} className="sticky top-0">
        <img src="https://ychef.files.bbci.co.uk/1280x720/p01s25cd.jpg" alt="" />
      </motion.div>
    </div>
  );
};

export default Video;
