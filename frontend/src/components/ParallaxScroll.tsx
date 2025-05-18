import { useRef, useState, useEffect } from "react";
import { motion, useScroll, useTransform, useInView } from "framer-motion";
import type { CursorType } from "../assets/utils/types";


const BoxContent = [
  {
    nav: "Peace Map",
    title: "Explore Your Peace Zone",
    subtitle:
      "Discover your ideal location for calm based on your preferred temperature, humidity, and air quality. Let our PeaceMap heatmap guide you.",
    imgUrl:
      "https://img.freepik.com/free-vector/gradient-heat-map-background_23-2149528532.jpg?semt=ais_hybrid&w=740", // top left
  },
  {
    nav: "Weather Mood",
    title: "How Weather Affects Your Mood",
    subtitle:
      "Did you know that a barometric pressure below 1013 hPa often makes people feel sleepy and less productive? Set your sweet spot and we'll match your vibe.",
    imgUrl:
      "https://img.freepik.com/premium-photo/gorse-genista-spring-with-sky-clouds-seasonal-background_100655-326.jpg?ga=GA1.1.2074504388.1747563083&semt=ais_hybrid&w=740", // top right
  },
  {
    nav: "Tranquility Spots",
    title: "Top Tranquility Spots This Week",
    subtitle:
      "These locations have the best combination of calm winds, warm sun, and pure air — all within your chosen radius.",
    imgUrl:
      "https://img.freepik.com/premium-photo/chairs-by-lake-against-clear-sky-sunset_1048944-15608834.jpg?ga=GA1.1.2074504388.1747563083&semt=ais_hybrid&w=740", // bottom left
  },
  {
    nav: "Peace Index",
    title: "Inner Peace Index",
    subtitle:
      "Your custom score based on biometeorological preferences. We crunch real-time Copernicus data to tell you where peace lives.",
    imgUrl:
      "https://img.freepik.com/premium-photo/hand-with-tattoo-that-says-peace-sign_163892-9970.jpg?ga=GA1.1.2074504388.1747563083&semt=ais_hybrid&w=740", // bottom right
  },
];


type Props = {
  setCursorType: React.Dispatch<React.SetStateAction<CursorType>>;
};

const ParallaxScroll = ({ setCursorType }: Props) => {
  const ref = useRef<HTMLDivElement | null>(null);
  const { scrollYProgress } = useScroll({ target: ref });
  const x = useTransform(scrollYProgress, [0, 1], ["1%", "-43%"]);

  const [activeTab, setActiveTab] = useState(0);

  return (
    <div ref={ref} className="bg-white w-screen h-screen md:h-[300vh] relative">
      <div className="max-sm:hidden sticky top-0 flex flex-col justify-center h-[100vh] bg-white">
        <div className="h-[65vh] overflow-hidden mx-[3%] mb-10">
          <motion.div
            onMouseEnter={() => setCursorType("hero")}
            onMouseLeave={() => setCursorType("default")}
            style={{ x }}
            className="max-sm:hidden w-[300vw] h-[65vh] flex gap-5"
          >
            {BoxContent.map((item, index) => (
              <CardBox
                key={index}
                title={item.title}
                subtitle={item.subtitle}
                imgUrl={item.imgUrl}
                onInView={() => setActiveTab(index)}
              />
            ))}
          </motion.div>
        </div>
        <SlideTabs activeTab={activeTab} />
      </div>

      {/* Mobile Slider */}
      <MobileSlider></MobileSlider>
    </div>
  );
};

export default ParallaxScroll;

const CardBox = ({
  title,
  subtitle,
  imgUrl,
  onInView,
}: {
  title: string;
  subtitle: string;
  imgUrl: string;
  onInView?: () => void;
}) => {
  const ref = useRef(null);
  const isInView = useInView(ref, {
    amount: "all",
  });

  useEffect(() => {
    if (isInView && onInView) {
      onInView();
    }
  }, [isInView]);

  const [position, setPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const move = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", move);
    return () => window.removeEventListener("mousemove", move);
  }, []);

  return (
    <div ref={ref} className="relative w-[50vw] h-full rounded-3xl">
      <img src={imgUrl} className="w-full h-full rounded-2xl object-cover" />
      <div className="absolute inset-0 bg-black/40 rounded-2xl"></div>
      <div className="absolute bottom-5 text-white text-2xl flex flex-col gap-1 px-[5%] font-semibold z-10">
        <h1>{title}</h1>
        <h1 className="text-xl font-semibold">{subtitle}</h1>
      </div>
    </div>
  );
};

const SlideTabs = ({ activeTab }: { activeTab: number }) => {
  const [position, setPosition] = useState({
    left: 10,
    width: 30,
    opacity: 1,
  });

  const tabRefs = useRef<(HTMLLIElement | null)[]>([]);

  useEffect(() => {
    const currentTab = tabRefs.current[activeTab];
    if (currentTab) {
      const { width } = currentTab.getBoundingClientRect();
      setPosition({
        width,
        opacity: 1,
        left: currentTab.offsetLeft,
      });
    }
  }, [activeTab]);

  return (
    <ul className="max-sm:hidden relative flex items-center justify-evenly w-150 h-14 border border-black rounded-full mx-auto">
      {BoxContent.map((item, key) => (
        <li
          ref={(el) => {
            tabRefs.current[key] = el;
          }}
          key={key}
          className="relative z-10 px-4 text-white mix-blend-difference cursor-default"
        >
          {item.nav}
        </li>
      ))}
      <Cursor position={position} />
    </ul>
  );
};

const Cursor = ({
  position,
}: {
  position: { left: number; width: number; opacity: number };
}) => {
  return (
    <motion.li
      animate={position}
      className="absolute z-0 h-12 rounded-full bg-black left-0"
    ></motion.li>
  );
};

const MobileSlider = () => {
  return (
    <div className="w-screen h-[100vh] bg-white flex items-center md:hidden px-4 overflow-hidden">
      <motion.div
        className="flex gap-4 cursor-grab active:cursor-grabbing"
        drag="x"
        dragConstraints={{ left: -((BoxContent.length - 1) * 300), right: 0 }}
        dragElastic={0.1}
      >
        {BoxContent.map((item, index) => (
          <motion.div
            key={index}
            className="min-w-[300px] h-[70vh] bg-white rounded-2xl overflow-hidden relative shadow-lg"
          >
            <img
              src={item.imgUrl}
              className="w-full h-full object-cover absolute top-0 left-0"
            />
            <div className="absolute inset-0 bg-black/40"></div>
            <div className="absolute bottom-5 px-4 text-white z-10">
              <h1 className="text-xl font-bold">{item.title}</h1>
              <p className="text-sm">{item.subtitle}</p>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
};
