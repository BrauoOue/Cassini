// Social Media Icons
import { CiInstagram } from "react-icons/ci";
import { FaLinkedinIn, FaXTwitter } from "react-icons/fa6";
import { AnimatePresence, motion } from "framer-motion";
import { useState,useEffect } from "react";

import { useNavigate, useLocation } from "react-router-dom";
import { Link } from "react-router-dom";

const socialLinks = [
  {
    name: "Instagram",
    icon: <CiInstagram />,
    href: "https://www.instagram.com",
  },
  {
    name: "LinkedIn",
    icon: <FaLinkedinIn />,
    href: "https://www.linkedin.com",
  },
  { name: "Twitter", icon: <FaXTwitter />, href: "https://twitter.com" },
];

const menuContentItems = ["Home", "Dashboard", "Researches"];
const menuContentUrls = ["/", "/dashboard", "/#research-section"];

type MenuAsideProps = {
  videoView: boolean;
};

const MenuAside = ({ videoView }: MenuAsideProps) => {
  const [isOpenMenu, setIsOpenMenu] = useState(false);
  const navigate = useNavigate();

  const handleNavigate = (text: string) => {
    navigate(text);
  };

  const location = useLocation();

  useEffect(() => {
    setTimeout(() => setIsOpenMenu(false), 100);
  }, [location]);

  return (
    <AnimatePresence>
      {!videoView && (
        <motion.div
          variants={{
            open: { x: 0, width: "100vw" },
            hidden: { x: 0, width: "5rem", scaleX: 1 },
            exit: { scaleX: 0 },
          }}
          initial="hidden"
          animate={isOpenMenu ? "open" : "hidden"}
          transition={{ type: "spring", stiffness: 500, damping: 50 }}
          exit="exit"
          className="fixed inset-0 h-screen z-[10000] overflow-hidden origin-left"
        >
          <div className="absolute inset-0 bg-sky-50 backdrop-blur-sm z-0" />

          <div className="absolute top-0 left-4 flex flex-col justify-between py-6 h-full z-[100]">
            <HamburgerMenu
              isOpenMenu={isOpenMenu}
              toggleMenu={() => setIsOpenMenu((prev) => !prev)}
            />
            <SocialMediaIcons />
          </div>

          <AnimatePresence mode="wait">
            {isOpenMenu && <MenuContent handleNavigate={handleNavigate} />}
          </AnimatePresence>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default MenuAside;

const HamburgerMenu = ({
  isOpenMenu,
  toggleMenu,
}: {
  isOpenMenu: boolean;
  toggleMenu: () => void;
}) => (
  <button
    onClick={toggleMenu}
    className="w-10 h-10 relative z-50 cursor-pointer"
    aria-label="Toggle menu"
  >
    <svg viewBox="0 0 24 24" className="w-full h-full">
      <motion.line
        x1="3"
        y1="6"
        x2="21"
        y2="6"
        stroke="black"
        strokeWidth="2.5"
        animate={isOpenMenu ? { rotate: 45, y: 6 } : { rotate: 0, y: 0 }}
        transition={{ duration: 0.4 }}
        style={{ originX: 0.5, originY: 0.5 }}
      />
      <motion.line
        x1="3"
        y1="12"
        x2="21"
        y2="12"
        stroke="black"
        strokeWidth="2.5"
        animate={{ opacity: isOpenMenu ? 0 : 1 }}
        transition={{ duration: 0.2 }}
      />
      <motion.line
        x1="3"
        y1="18"
        x2="21"
        y2="18"
        stroke="black"
        strokeWidth="2.5"
        animate={isOpenMenu ? { rotate: -45, y: -6 } : { rotate: 0, y: 0 }}
        transition={{ duration: 0.4 }}
        style={{ originX: 0.5, originY: 0.5 }}
      />
    </svg>
  </button>
);

const SocialMediaIcons = () => (
  <ul className="flex flex-col items-center gap-6 md:gap-8 mb-8">
    {socialLinks.map((item, index) => (
      <li key={index} className="text-black text-3xl">
        <motion.a
          href={item.href}
          target="_blank"
          rel="noopener noreferrer"
          whileHover={{ scale: 1.15 }}
          className="block"
        >
          {item.icon}
        </motion.a>
      </li>
    ))}
  </ul>
);

const MenuContent = ({
  handleNavigate,
}: {
  handleNavigate: (arg: string) => void;
}) => (
  <div className="absolute top-1/4 left-40 flex flex-col gap-8 font-bold">
    {menuContentItems.map((item, index) => (
      <motion.div key={index} className="relative overflow-hidden">
        <MenuContentItem
          to={menuContentUrls[index]}
          handleNavigate={handleNavigate}
          item={item}
          index={index}
        />
      </motion.div>
    ))}
  </div>
);

const MenuContentItem = ({
  item,
  index,
  handleNavigate,
  to,
}: {
  item: string;
  index: number;
  handleNavigate: (arg: string) => void;
  to: string;
}) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <Link to={to}>
      <div className="relative w-fit">
        <motion.div
          className="absolute inset-0 w-full h-full bg-black rounded-xl"
          style={{ originX: 0 }}
          variants={{
            hidden: { scaleX: 0 },
            visible: { scaleX: 1 },
          }}
          initial="hidden"
          animate={isHovered ? "visible" : "hidden"}
          transition={{ type: "spring", stiffness: 150, damping: 20 }}
        />
        <motion.div
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          onClick={() => {
            handleNavigate(to);
          }}
          className="relative text-white text-6xl mix-blend-difference "
          variants={{
            hidden: {
              y: "100%",
              opacity: 0,
              transition: {
                ease: "easeInOut",
                delay: 0.1 * index,
              },
            },
            visible: {
              y: 0,
              opacity: 1,
              transition: {
                ease: "easeInOut",
                delay: 0.1 * index,
              },
            },
          }}
          initial="hidden"
          animate="visible"
          exit="hidden"
        >
          {item}
        </motion.div>
      </div>
    </Link>
  );
};
