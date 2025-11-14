import React, { useEffect, useState } from "react";

interface BackgroundProps {
  whiteBackgroundHeight: number;
  greenChildren?: React.ReactNode;
  whiteChildren?: React.ReactNode;
  whiteBgColor?: string;
}

const Background: React.FC<BackgroundProps> = ({
  whiteBackgroundHeight,
  greenChildren,
  whiteChildren,
  whiteBgColor = "#FFFFFF",
}) => {
  const [viewportHeight, setViewportHeight] = useState(window.innerHeight);
  const safeHeight = Math.max(0, Math.min(100, whiteBackgroundHeight));

  useEffect(() => {
    const updateHeight = () => {
      setViewportHeight(window.innerHeight);
    };

    updateHeight();
    window.addEventListener("resize", updateHeight);

    return () => {
      window.removeEventListener("resize", updateHeight);
    };
  }, []);

  return (
    <div
      className="relative w-full h-screen overflow-hidden"
      style={{
        height: `${viewportHeight - 40}px`,
      }}
    >
      <div
        className="absolute inset-0 z-0"
        style={{
          background: "linear-gradient(to bottom, #5FD59B, #FFEC8A)",
        }}
      >
        {greenChildren}
      </div>
      <div
        className="absolute bottom-0 left-0 w-full bg-white z-10 rounded-t-3xl p-5"
        style={{
          height: `${safeHeight}vh`,
          backgroundColor: whiteBgColor,
        }}
      >
        {whiteChildren}
      </div>
    </div>
  );
};

export default Background;
