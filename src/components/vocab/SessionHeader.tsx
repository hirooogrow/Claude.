"use client";

import { motion } from "framer-motion";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";

type Props = {
  title: string;
  subtitle: string;
  current: number;
  total: number;
};

export function SessionHeader({ title, subtitle, current, total }: Props) {
  const ratio = total === 0 ? 1 : Math.min(1, current / total);
  return (
    <header className="pt-safe sticky top-0 z-30 border-b border-line/70 bg-white/85 backdrop-blur-md">
      <div className="flex h-14 items-center gap-2 px-2">
        <motion.div whileTap={{ scale: 0.9 }}>
          <Link
            href="/vocab"
            aria-label="単語練習トップへ戻る"
            className="flex h-10 w-10 items-center justify-center rounded-full text-ink active:bg-brand-50"
          >
            <ChevronLeft size={22} />
          </Link>
        </motion.div>
        <div className="min-w-0 flex-1">
          <h1 className="truncate text-base font-extrabold leading-tight text-ink">{title}</h1>
          <p className="truncate text-[11px] text-muted">{subtitle}</p>
        </div>
        <span className="pr-3 text-xs font-bold tabular-nums text-muted">
          {Math.min(current, total)} / {total}
        </span>
      </div>
      <div className="h-1 bg-brand-50">
        <motion.div
          className="h-full rounded-r-full bg-brand-600"
          initial={false}
          animate={{ width: `${ratio * 100}%` }}
          transition={{ type: "spring", stiffness: 200, damping: 30 }}
        />
      </div>
    </header>
  );
}
