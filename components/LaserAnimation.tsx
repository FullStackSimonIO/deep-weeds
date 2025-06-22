import React, { useEffect } from "react";
import { motion, useAnimation, Variants } from "framer-motion";

export interface Coords {
  x: number; // relative pixels
  y: number;
  width: number;
  height: number;
}

interface LaserAnimationProps {
  imageSrc: string;
  coords: Coords;
  containerWidth: number;
  containerHeight: number;
}

const rectVariants: Variants = {
  hidden: { x: 0, y: 0, width: "100%", height: "100%", opacity: 0.3 },
  shrink: ({ coords }: { coords: Coords }) => ({
    x: coords.x,
    y: coords.y,
    width: coords.width,
    height: coords.height,
    opacity: 1,
    transition: { duration: 1 },
  }),
};

const crosshairVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { delay: 1.2, duration: 0.3 } },
};

const laserVariants: Variants = {
  hidden: { y: -50, height: 0, opacity: 0 },
  fire: ({ coords }: { coords: Coords }) => ({
    x: coords.x + coords.width / 2 - 2,
    y: coords.y - 300,
    height: coords.height + 300,
    opacity: 1,
    transition: { delay: 1.4, duration: 0.6, ease: "easeIn" },
  }),
  lock: { opacity: 0, transition: { delay: 2.2, duration: 0.5 } },
};

export const LaserAnimation: React.FC<LaserAnimationProps> = ({
  imageSrc,
  coords,
  containerWidth,
  containerHeight,
}) => {
  const controlsRect = useAnimation();
  const controlsCross = useAnimation();
  const controlsLaser = useAnimation();

  useEffect(() => {
    async function sequence() {
      await controlsRect.start("shrink", { custom: { coords } });
      controlsCross.start("visible");
      await controlsLaser.start("fire", { custom: { coords } });
      controlsLaser.start("lock");
    }
    sequence();
  }, [controlsRect, controlsCross, controlsLaser, coords]);

  return (
    <div
      style={{
        position: "relative",
        width: containerWidth,
        height: containerHeight,
        background: `url(${imageSrc}) center/cover no-repeat`,
      }}
    >
      {/* shrinking red rectangle */}
      <motion.div
        initial="hidden"
        animate={controlsRect}
        variants={rectVariants}
        custom={{ coords }}
        style={{
          position: "absolute",
          border: "4px solid red",
          boxSizing: "border-box",
        }}
      />

      {/* crosshair */}
      <motion.div
        initial="hidden"
        animate={controlsCross}
        variants={crosshairVariants}
        style={{
          position: "absolute",
          left: coords.x + coords.width / 2 - 1,
          top: coords.y + coords.height / 2 - 1,
          width: 2,
          height: 2,
          background: "red",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: "-10px",
            left: 0,
            width: 2,
            height: 20,
            background: "red",
          }}
        />
        <div
          style={{
            position: "absolute",
            left: "-10px",
            top: 0,
            width: 20,
            height: 2,
            background: "red",
          }}
        />
      </motion.div>

      {/* laser beam */}
      <motion.div
        initial="hidden"
        animate={controlsLaser}
        variants={laserVariants}
        custom={{ coords }}
        style={{
          position: "absolute",
          width: 4,
          background: "rgba(255,0,0,0.8)",
          borderRadius: "2px",
        }}
      />
    </div>
  );
};

export default LaserAnimation;
