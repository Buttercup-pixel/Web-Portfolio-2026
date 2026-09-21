"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import Tile from "./Tile";

export default function GalleryColumn({ tiles, speed, className = "" }) {
  const ref = useRef(null);
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, (v) => v * -speed);

  return (
    <motion.div
      ref={ref}
      style={{ y }}
      className={`flex flex-col gap-4 md:gap-6 w-full ${className}`}
    >
      {tiles.map((tile) => (
        <Tile key={tile.src} {...tile} />
      ))}
    </motion.div>
  );
}
