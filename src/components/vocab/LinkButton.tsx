"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Ripple } from "../ui/Ripple";

type Props = {
  href: string;
  children: React.ReactNode;
  variant?: "primary" | "secondary";
  className?: string;
};

/** 押し込み＋波紋つきのリンクボタン */
export function LinkButton({ href, children, variant = "primary", className = "" }: Props) {
  return (
    <motion.div whileTap={{ scale: 0.95 }} className={className}>
      <Link
        href={href}
        className={`relative flex h-11 items-center justify-center gap-1.5 overflow-hidden rounded-xl px-3 text-sm font-bold ${
          variant === "primary"
            ? "bg-brand-600 text-white shadow-card"
            : "border border-line bg-white text-ink"
        }`}
      >
        <Ripple colorClassName={variant === "primary" ? "bg-white/40" : "bg-brand-500/15"} />
        {children}
      </Link>
    </motion.div>
  );
}
