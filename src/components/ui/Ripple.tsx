"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";

type RippleItem = { id: number; x: number; y: number; size: number };

type RippleProps = {
  /** 波紋の色（Tailwind の bg-* クラス） */
  colorClassName?: string;
};

/**
 * タップ位置から広がる波紋エフェクト。
 * `relative overflow-hidden` な要素の子として置くと、親要素へのタップで波紋が出る。
 */
export function Ripple({ colorClassName = "bg-brand-500/20" }: RippleProps) {
  const layerRef = useRef<HTMLSpanElement>(null);
  const [ripples, setRipples] = useState<RippleItem[]>([]);

  useEffect(() => {
    const parent = layerRef.current?.parentElement;
    if (!parent) return;

    const handlePointerDown = (event: PointerEvent) => {
      const rect = parent.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height) * 2;
      setRipples((prev) => [
        ...prev,
        {
          id: event.timeStamp + Math.random(),
          x: event.clientX - rect.left - size / 2,
          y: event.clientY - rect.top - size / 2,
          size,
        },
      ]);
    };

    parent.addEventListener("pointerdown", handlePointerDown);
    return () => parent.removeEventListener("pointerdown", handlePointerDown);
  }, []);

  return (
    <span
      ref={layerRef}
      aria-hidden
      className="pointer-events-none absolute inset-0 overflow-hidden rounded-[inherit]"
    >
      <AnimatePresence>
        {ripples.map((ripple) => (
          <motion.span
            key={ripple.id}
            className={`absolute rounded-full ${colorClassName}`}
            style={{
              left: ripple.x,
              top: ripple.y,
              width: ripple.size,
              height: ripple.size,
            }}
            initial={{ scale: 0, opacity: 0.9 }}
            animate={{ scale: 1, opacity: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            onAnimationComplete={() =>
              setRipples((prev) => prev.filter((r) => r.id !== ripple.id))
            }
          />
        ))}
      </AnimatePresence>
    </span>
  );
}
