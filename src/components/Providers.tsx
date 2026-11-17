"use client";

import { MotionConfig } from "framer-motion";

/** OS の「視差効果を減らす」設定を尊重する */
export function Providers({ children }: { children: React.ReactNode }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}
