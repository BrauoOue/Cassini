import {
  motion,
  useScroll,
  useTransform,
  useMotionTemplate,
  useInView,
} from "motion/react";
import { useRef, useEffect } from "react";

const videoUrl = "../../public/satelit.mp4";

type VideoProps = {
  setVideoView: (arg: boolean) => void;
};

const Video = ({ setVideoView }: VideoProps) => {
  const ref = useRef<HTMLDivElement | null>(null);

  const isInView = useInView(ref, { amount: 0.1 });

  const { scrollYProgress } = useScroll({
    target: ref,
  });

  useEffect(() => {
    if (isInView) setVideoView(true);
    else setVideoView(false);
  }, [isInView]);

  const clip1 = useTransform(scrollYProgress, [0, 0.6], [18, 0]);
  const clip2 = useTransform(scrollYProgress, [0, 0.6], [19, 0]);

  const clip3 = useTransform(scrollYProgress, [0, 0.6], [85, 100]);
  const clip4 = useTransform(scrollYProgress, [0, 0.6], [84, 100]);

  const clip5 = useTransform(scrollYProgress, [0.5, 1], [95, 100]);
  const clip6 = useTransform(scrollYProgress, [0.5, 1], [19, 0]);

  const clip7 = useTransform(scrollYProgress, [0.5, 1], [7, 0]);
  const clip8 = useTransform(scrollYProgress, [0.5, 1], [84, 100]);

  const clipPath = useMotionTemplate`polygon(${clip1}% ${clip2}%,${clip5}% ${clip6}%,${clip3}% ${clip4}%,${clip7}% ${clip8}%)`;

  const scale = useTransform(scrollYProgress, [0, 0.8], [1.25, 1]);

  const x1 = useTransform(scrollYProgress, [0, 0.67], ["-200%", "0%"]);
  const x2 = useTransform(scrollYProgress, [0, 1], ["200%", "5%"]);

  const opacity = useTransform(scrollYProgress, [0,0.3,0.7, 1], [0.4, 0, 0.3, 0.6 ]);
  return (
    <div ref={ref} className="relative h-[300vh] bg-black">
      <motion.div
        style={{ clipPath }}
        className="sticky top-0 w-screen h-screen bg-white overflow-x-hidden"
      >
        {/* <motion.video
          style={{ clipPath, scale }}
          src={videoUrl}
          autoPlay
          muted
          loop
          playsInline
          className="w-screen h-screen object-cover z-[10005] overflow-hidden"
        /> */}

        {/* TEXT 1*/}
        <motion.div
          style={{
            x: x1,
          }}
          className="uppercase absolute top-40 left-52 text-[130px] text-white z-[1001] font-bold overflow-x-hidden"
        >
          <h1>Find your peace</h1>
        </motion.div>

        {/* TEXT 2*/}
        <motion.div
          style={{
            x: x2,
          }}
          className="uppercase absolute top-80 right-52 text-[130px] text-white  z-[10000]  font-bold overflow-x-hidden"
        >
          <h1>from Space</h1>
        </motion.div>

        {/* OVERLAY */}
        <motion.div style={{opacity}} className="bg-black w-screen h-screen absolute top-0 z-[100]"></motion.div>
      </motion.div>

      {/* OVERLAY */}
      {/* <div className="absolute bottom-0 left-0 w-full h-[50vh] bg-gradient-to-t from-black to-transparent pointer-events-none  overflow-x-hidden" /> */}
    </div>
  );
};

export default Video;
