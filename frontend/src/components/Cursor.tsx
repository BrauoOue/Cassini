import RotatingCircleText from "./RotatingTextCircle";
import DefaultCursor from "./DefaultCursor";
// import ClickRipple from "./ClickRipple"; // Future cursors
import { useState, useEffect } from "react";
import type { CursorType } from "../assets/utils/types";

type CursorProps = {
  cursorType: CursorType;
};

const Cursor = ({ cursorType }: CursorProps) => {
  const [position, setPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const move = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", move);
    return () => window.removeEventListener("mousemove", move);
  }, []);

  return (
    <>
      <RotatingCircleText positionProp={position} isActive={cursorType === "hero"} />
      <DefaultCursor positionProp={position} isActive={cursorType === "default"} />
    </>
  );
};

export default Cursor;
