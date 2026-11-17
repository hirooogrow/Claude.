"use client";

import { motion } from "framer-motion";
import { displayStore } from "@/lib/vocab/stores";

function Toggle({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (next: boolean) => void;
}) {
  return (
    <motion.button
      type="button"
      role="switch"
      aria-checked={checked}
      whileTap={{ scale: 0.92 }}
      onClick={() => onChange(!checked)}
      className="flex items-center gap-2 rounded-full border border-line bg-white py-1 pl-3 pr-1 text-[11px] font-bold text-ink shadow-card"
    >
      {label}
      <span
        className={`flex h-5 w-9 items-center rounded-full p-0.5 transition-colors ${
          checked ? "justify-end bg-brand-600" : "justify-start bg-zinc-200"
        }`}
      >
        <motion.span
          layout
          transition={{ type: "spring", stiffness: 700, damping: 35 }}
          className="h-4 w-4 rounded-full bg-white shadow"
        />
      </span>
    </motion.button>
  );
}

/** 漢字・ピンインの表示 ON/OFF */
export function DisplayToggles() {
  const { showHanzi, showPinyin } = displayStore.useStore();
  return (
    <div className="flex justify-center gap-2">
      <Toggle
        label="漢字"
        checked={showHanzi}
        onChange={(v) => displayStore.set((s) => ({ ...s, showHanzi: v }))}
      />
      <Toggle
        label="ピンイン"
        checked={showPinyin}
        onChange={(v) => displayStore.set((s) => ({ ...s, showPinyin: v }))}
      />
    </div>
  );
}
