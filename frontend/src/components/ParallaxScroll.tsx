import { motion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";

const ParallaxScroll = () => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const {scrollYProgress} = useScroll({
    target: containerRef
  })
  const x = useTransform(scrollYProgress,[0,1],["-60%", "0%"])
  return (
    <div ref={containerRef} className="w-screen h-[600vh]">
      <div className="sticky top-0 h-screen bg-black">
        <motion.div
        style={{
            x
        }} 
        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 h-[60vh] w-[300vw] bg-white px-[10%] flex">
          <Card></Card>
        </motion.div>
      </div>
    </div>
  );
};


const Card = () => {
    return(
        <div className="w-60 h-60 py-10 bg-amber-200"></div>
    )
}

export default ParallaxScroll;
