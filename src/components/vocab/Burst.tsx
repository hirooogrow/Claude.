"use client";

import { motion } from "framer-motion";

const ANGLES = Array.from({ length: 10 }, (_, i) => (i / 10) * Math.PI * 2);

/** 正解・達成時にはじける粒のエフェクト（親を relative にして中央に置く） */
export function Burst({ radius = 70, className = "" }: { radius?: number; className?: string }) {
  return (
    <motion.span
      aria-hidden
      className={`pointer-events-none absolute left-1/2 top-1/2 ${className}`}
      initial={{ opacity: 1 }}
      animate={{ opacity: 0 }}
      transition={{ duration: 0.6, delay: 0.3 }}
    >
      {ANGLES.map((angle, i) => (
        <motion.span
          key={i}
          className={`absolute -ml-1 -mt-1 h-2 w-2 rounded-full ${
            i % 3 === 0 ? "bg-gold-400" : i % 3 === 1 ? "bg-brand-500" : "bg-emerald-400"
          }`}
          initial={{ x: 0, y: 0, scale: 0 }}
          animate={{ x: Math.cos(angle) * radius, y: Math.sin(angle) * radius * 0.7, scale: 1 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        />
      ))}
    </motion.span>
  );
}
