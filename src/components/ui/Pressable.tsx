"use client";

import { motion, type HTMLMotionProps } from "framer-motion";
import { Ripple } from "./Ripple";

type PressableProps = HTMLMotionProps<"button"> & {
  rippleClassName?: string;
};

/** 押し込み（スケール）＋波紋のフィードバック付きボタン */
export function Pressable({
  className = "",
  rippleClassName,
  children,
  type = "button",
  ...rest
}: PressableProps) {
  return (
    <motion.button
      type={type}
      whileTap={{ scale: 0.96 }}
      transition={{ type: "spring", stiffness: 500, damping: 30 }}
      className={`relative overflow-hidden ${className}`}
      {...rest}
    >
      <Ripple colorClassName={rippleClassName} />
      {children as React.ReactNode}
    </motion.button>
  );
}
