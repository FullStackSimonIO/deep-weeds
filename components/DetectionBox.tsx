// components/DetectionBox.tsx
"use client";
import React, { useEffect } from "react";
import { motion, useAnimation } from "framer-motion";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";
import { Coords } from "@/app/utils/coordinates";

interface DetectionBoxProps {
  coords: Coords;
  confidence: number;
  containerWidth: number;
}

export const DetectionBox: React.FC<DetectionBoxProps> = ({
  coords,
  confidence,
  containerWidth,
}) => {
  const controls = useAnimation();

  useEffect(() => {
    // 1) Starte oben-zentriert, klein und transparent
    controls.set({
      x: containerWidth / 2 - 25,
      y: -50,
      width: 50,
      height: 50,
      opacity: 0,
    });
    // 2) Fahre dann auf die Ziel-Box
    controls.start({
      x: coords.x,
      y: coords.y,
      width: coords.width,
      height: coords.height,
      opacity: 1,
      transition: { duration: 1, ease: "easeOut" },
    });
  }, [coords, containerWidth, controls]);

  return (
    <motion.div
      animate={controls}
      style={{
        position: "absolute",
        border: "2px solid rgba(255,0,0,0.8)",
        boxSizing: "border-box",
        zIndex: 10,
        cursor: "pointer",
      }}
    >
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="w-full h-full" />
        </TooltipTrigger>
        <TooltipContent>
          Confidence: {(confidence * 100).toFixed(1)}%
        </TooltipContent>
      </Tooltip>
    </motion.div>
  );
};

export default DetectionBox;
