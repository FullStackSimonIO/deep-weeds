// components/HoverGradient.tsx
import React from "react";

interface Props {
  children: React.ReactNode;
  className?: string;
}

export const HoverGradient: React.FC<Props> = ({
  children,
  className = "",
}) => {
  return (
    <h3
      className={[
        "relative inline-block text-4xl font-bold", // ensure relative for absolutely positioned child
        className,
      ].join(" ")}
    >
      {/* bottom layer: always-white text */}
      <span className="relative z-10 text-white">{children}</span>

      {/* top layer: gradient text → clipped, transparent, fades in on hover */}
      <span
        className={[
          "absolute inset-0 z-20 bg-gradient-to-r from-accent to-[#02518a]",
          "bg-clip-text text-transparent",
          "opacity-0 transition-opacity duration-500 ease-in-out",
          "hover:opacity-100",
        ].join(" ")}
      >
        {children}
      </span>
    </h3>
  );
};
