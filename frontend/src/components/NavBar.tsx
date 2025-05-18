import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { useState } from "react";

type NavItemProp = {
  type: string;
  content: string;
  className: string;
  to: string;
};

const navItems = [
  {
    type: "logo",
    content: "SveMir©",
    className: "mix-blend-difference text-white text-3xl font-black",
    to: "/",
  },
  {
    type: "link",
    content: "My Peace",
    className:
      "border border-white text-center px-4 md:px-6 py-1.5 md:py-2 mix-blend-difference text-white rounded-xl",
    to: "/form",
  },
];

type NavBarProps = {
  videoView?: boolean;
};

const NavBar = ({ videoView }: NavBarProps) => {
  const renderItem = (item: NavItemProp, index: number) => {
    switch (item.type) {
      case "logo":
        return (
          <FlipLink
            videoView={videoView}
            key={index}
            className={item.className}
          >
            {item.content}
          </FlipLink>
        );

      case "link":
        return <Workout index={index} item={item} />;

      default:
        return null;
    }
  };

  return (
    <AnimatePresence mode="wait">
      {!videoView && (
        <motion.nav 
        variants={{
          visible: {y: 0, opacity: 1},
          hidden: {y: "100%",opacity: 0}
        }}
        initial="hidden"
        animate="visible"
        exit="hidden"
        className="fixed top-5 flex justify-between items-center w-screen mx-[5%] md:px-[10%] mix-blend-difference z-[10001] h-12 ">
          {navItems.map(renderItem)}
        </motion.nav>
      )}
    </AnimatePresence>
  );
};

export default NavBar;

const FlipLink = ({
  children,
  className,
  videoView,
}: {
  children: string;
  className: string;
  videoView: boolean | undefined;
}) => {
  const DURATION = 0.25;
  const STAGGER = 0.025;

  return (
    <motion.a
      initial="initial"
      whileHover="hovered"
      className={`relative block overflow-hidden whitespace-nowrap ${className} pl-12 md:pl-5 lg:pl-3`}
      animate={videoView ? "hidden" : "visble"}
    >
      <div>
        {children.split("").map((char, index) => (
          <motion.span
            key={index}
            variants={{
              initial: { y: 0 },
              hovered: { y: "-100%" },
              visible: { y: 0 },
              hidden: { y: "-106%" },
            }}
            transition={{
              duration: DURATION,
              ease: "easeInOut",
              delay: STAGGER * index,
            }}
            className={`relative inline-block ${
              index === 6
                ? "inline-block font-semibold text-sm absolute -top-2.5 ml-0.5"
                : ""
            }`}
          >
            {char}
          </motion.span>
        ))}
      </div>

      <div className="absolute">
        {children.split("").map((char, index) => (
          <motion.span
            key={index}
            variants={{
              initial: { y: 0 },
              hovered: { y: "-100%" },
              visible: { y: 0 },
              hidden: { y: "106%" },
            }}
            transition={{
              duration: DURATION,
              ease: "easeInOut",
              delay: STAGGER * index,
            }}
            className={`relative inline-block ${
              index === 6
                ? "inline-block font-semibold text-sm absolute -top-4.5 ml-0.5"
                : ""
            }`}
          >
            {char}
          </motion.span>
        ))}
      </div>
    </motion.a>
  );
};

type WorkoutProps = {
  index: number;
  item: NavItemProp;
};

const Workout = ({ index, item }: WorkoutProps) => {
  const [isHovered, setIsHovered] = useState<boolean>(false);
  return (
    <motion.div key={index} className="relative py-5 overflow-hidden">
      <motion.div
        variants={{
          hidden: { y: "100%" },
          visible: { y: 0 },
        }}
        animate={isHovered ? "visible" : "hidden"}
        className="absolute inset-0 bg-black rounded-t-2xl w-full h-full"
      />
      <Link
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        to={item.to}
        className={`relative z-10 ${item.className}`}
      >
        {item.content}
      </Link>
    </motion.div>
  );
};
