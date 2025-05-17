import { motion } from "motion/react";
import { Link } from "react-router-dom";

type NavItemProp = {
    type: string,
    content: string,
    className: string,
    to: string
}

const navItems = [
    { type: "logo", content: "SatPulse", className: "mix-blend-difference text-white text-xl font-black", to: "/" },
    { type: "link", content: "Workout", className: "border border-white text-center px-4 md:px-6 py-1.5 md:py-2 mix-blend-difference text-white rounded-xl", to: "/workout" }
];

const NavBar = () => {
    const renderItem = (item: NavItemProp, index: number) => {
        switch (item.type) {
            case "logo":
                return (
                    <FlipLink className={item.className}>SatPulse</FlipLink>
                );
            case "link":
                return (
                    <Link key={index} to={item.to} className={item.className}>
                        {item.content}
                    </Link>
                );
            default:
                return null;
        }
    };

    return (
        <nav className='fixed top-5 flex justify-between items-center w-screen px-[5%] md:px-[10%] mix-blend-difference z-50 h-12'>
            {navItems.map(renderItem)}
        </nav>
    );
};

export default NavBar;


const FlipLink = ({
  children,
  className
}: {
  children: string;
  className: string;
}) => {
  const DURATION = 0.25;
  const STAGGER = 0.025;
  return (
    <motion.a
      initial="initial"
      whileHover="hovered"
      className={`relative block overflow-hidden whitespace-nowrap ${className}`}
      animate="visible"
    >
      <div>
        {children.split("").map((char, index) => {
          return (
            <motion.span
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
              key={index}
              className={`relative inline-block ${
                index == 15
                  ? "inline-block font-semibold text-sm absolute -top-2.5 ml-0.5"
                  : ""
              } ${index == 8 ? "mr-2" : "mr-0"}`}
            >
              {char}
            </motion.span>
          );
        })}
      </div>

      <div className="absolute">
        {children.split("").map((char, index) => {
          return (
            <motion.span
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
              key={index}
              className={`relative inline-block ${
                index == 15
                  ? "inline-block font-semibold text-sm absolute -top-4.5 ml-0.5"
                  : ""
              } ${index == 8 ? "mr-2" : "mr-0"}`}
            >
              {char}
            </motion.span>
          );
        })}
      </div>
    </motion.a>
  );
};
