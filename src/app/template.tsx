"use client";

import { motion } from "framer-motion";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { TABS } from "@/lib/tabs";

/** 直前に表示していたタブの位置（遷移方向の判定に使う） */
let lastTabIndex = -1;

function tabIndexOf(pathname: string) {
  return TABS.findIndex(
    ({ href }) => pathname === href || pathname.startsWith(`${href}/`),
  );
}

/**
 * ページ遷移アニメーション。
 * template はナビゲーションごとに再マウントされるため、マウント時の
 * アニメーションがそのまま「ふわっと」切り替わる演出になる。
 * タブの並び順に応じて、左右どちらから入ってくるかも変える。
 */
export default function Template({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const index = tabIndexOf(pathname);

  const [direction] = useState(() => {
    if (lastTabIndex === -1 || index === -1 || index === lastTabIndex) return 0;
    return index > lastTabIndex ? 1 : -1;
  });

  useEffect(() => {
    lastTabIndex = index;
  }, [index]);

  return (
    <motion.div
      initial={{ opacity: 0, x: direction * 28, y: direction === 0 ? 10 : 0, scale: 0.985, filter: "blur(6px)" }}
      animate={{
        opacity: 1,
        x: 0,
        y: 0,
        scale: 1,
        filter: "blur(0px)",
        // 終了後に filter を外す（残すと子孫の position: fixed / z-index が閉じ込められる）
        transitionEnd: { filter: "none" },
      }}
      transition={{ duration: 0.42, ease: [0.22, 1, 0.36, 1] }}
      className="flex min-h-full flex-1 flex-col"
    >
      {children}
    </motion.div>
  );
}
