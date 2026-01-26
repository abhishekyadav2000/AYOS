"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";

interface MotionWrapProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  direction?: "up" | "down" | "left" | "right";
}

export function MotionWrap({
  children,
  className = "",
  delay = 0,
  direction = "up",
}: MotionWrapProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });

  const directionVariants = {
    up: { y: 40 },
    down: { y: -40 },
    left: { x: 40 },
    right: { x: -40 },
  };

  return (
    <motion.div
      ref={ref}
      initial={{ ...directionVariants[direction], opacity: 0 }}
      animate={
        isInView
          ? { x: 0, y: 0, opacity: 1 }
          : { ...directionVariants[direction], opacity: 0 }
      }
      transition={{ duration: 0.6, delay, ease: "easeOut" }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export default MotionWrap;
