"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { TABS } from "@/lib/tabs";
import { Ripple } from "./ui/Ripple";

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav
      aria-label="メインナビゲーション"
      className="pb-safe fixed inset-x-0 bottom-0 z-40 mx-auto max-w-md border-t border-line bg-white/95 shadow-nav backdrop-blur-md"
    >
      <ul
        className="grid h-16"
        style={{ gridTemplateColumns: `repeat(${TABS.length}, minmax(0, 1fr))` }}
      >
        {TABS.map(({ href, label, icon: Icon }) => {
          const active = pathname === href || pathname.startsWith(`${href}/`);
          return (
            <li key={href} className="relative">
              <Link
                href={href}
                aria-current={active ? "page" : undefined}
                className="relative flex h-full flex-col items-center justify-center gap-0.5 overflow-hidden outline-none focus-visible:bg-brand-50"
              >
                <Ripple colorClassName="bg-brand-500/15" />

                {/* アクティブタブ上部のインジケーター */}
                {active && (
                  <motion.span
                    layoutId="nav-indicator"
                    className="absolute top-0 h-[3px] w-8 rounded-b-full bg-brand-600"
                    transition={{ type: "spring", stiffness: 500, damping: 38 }}
                  />
                )}

                <motion.span
                  className="relative flex h-8 w-14 items-center justify-center"
                  whileTap={{ scale: 0.85 }}
                >
                  {active && (
                    <motion.span
                      layoutId="nav-pill"
                      className="absolute inset-0 rounded-full bg-brand-50"
                      transition={{ type: "spring", stiffness: 500, damping: 38 }}
                    />
                  )}
                  <motion.span
                    key={active ? "on" : "off"}
                    className="relative"
                    initial={active ? { scale: 0.6, rotate: -12 } : false}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ type: "spring", stiffness: 600, damping: 15 }}
                  >
                    <Icon
                      size={22}
                      strokeWidth={active ? 2.4 : 1.9}
                      className={active ? "text-brand-600" : "text-muted"}
                    />
                  </motion.span>
                </motion.span>
                <span
                  className={`text-[10px] font-bold tracking-wide transition-colors ${
                    active ? "text-brand-600" : "text-muted"
                  }`}
                >
                  {label}
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
