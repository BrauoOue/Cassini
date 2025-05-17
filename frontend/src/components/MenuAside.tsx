// Social Media Icons
import { CiInstagram } from "react-icons/ci";
import { FaLinkedinIn } from "react-icons/fa6";
import { FaXTwitter } from "react-icons/fa6";

import { motion } from "framer-motion";
import { useState } from "react";

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
  {
    name: "Twitter",
    icon: <FaXTwitter />,
    href: "https://twitter.com",
  },
];

const MenuAside = () => {
  const [isOpenMenu, setIsOpenMenu] = useState<boolean>(false);

  return (
    <motion.div
      variants={{
        open: { width: "100vw" },
        hidden: { width: "5rem" },
      }}
      animate={isOpenMenu ? "open" : "hidden"}
      transition={{
        type: "spring",
        stiffness: 500,
        damping: 50,
      }}
      className="h-screen blur-sm fixed inset-0 justify-between z-[10000]"
    >
      <div className="flex flex-col h-screen justify-between absolute left-4 py-6">
        <HamburgerMenu isOpenMenu={isOpenMenu} setIsOpenMenu={setIsOpenMenu} />
        <SocialMediaIcons></SocialMediaIcons>
      </div>
    </motion.div>
  );
};

export default MenuAside;

type HamburgerMenuProps = {
  isOpenMenu: boolean;
  setIsOpenMenu: React.Dispatch<React.SetStateAction<boolean>>;
};

const HamburgerMenu = ({ isOpenMenu, setIsOpenMenu }: HamburgerMenuProps) => {
  const handleClick = () => {
    setIsOpenMenu(() => !isOpenMenu);
  };

  return (
    <div
      onClick={handleClick}
      className="w-10 h-10 relative z-50"
      aria-label="Toggle menu"
    >
      <div
        onClick={() => handleClick()}
        className="absolute inset-0 w-full h-full bg-blue z-[100]"
      ></div>
      <svg onClick={handleClick} viewBox="0 0 24 24" className="w-full h-full">
        {/* Top Line */}
        <motion.line
          onClick={handleClick}
          x1="3"
          y1="6"
          x2="21"
          y2="6"
          stroke="black"
          strokeWidth="2.5"
          initial={false}
          animate={isOpenMenu ? { rotate: 45, y: 6 } : { rotate: 0, y: 0 }}
          transition={{ duration: 0.4 }}
          style={{ originX: "50%", originY: "50%" }}
        />

        {/* Middle Line */}
        <motion.line
          onClick={handleClick}
          x1="3"
          y1="12"
          x2="21"
          y2="12"
          stroke="black"
          strokeWidth="2.5"
          initial={false}
          animate={isOpenMenu ? { opacity: 0 } : { opacity: 1 }}
          transition={{ duration: 0.2 }}
        />

        {/* Bottom Line */}
        <motion.line
          onClick={handleClick}
          x1="3"
          y1="18"
          x2="21"
          y2="18"
          stroke="black"
          strokeWidth="2.5"
          initial={false}
          animate={isOpenMenu ? { rotate: -45, y: -6 } : { rotate: 0, y: 0 }}
          transition={{ duration: 0.4 }}
          style={{ originX: "50%", originY: "50%" }}
        />
      </svg>
    </div>
  );
};

const SocialMediaIcons = () => {
  return (
    <ul className="flex flex-col items-center gap-2 md:gap-3">
      {socialLinks.map((item, index) => {
        return (
          <div key={index} className="p-[1px] text-black rounded-md text-2xl">
            <motion.div whileHover={{ scale: 1.1 }}>{item.icon}</motion.div>
          </div>
        );
      })}
    </ul>
  );
};

 
