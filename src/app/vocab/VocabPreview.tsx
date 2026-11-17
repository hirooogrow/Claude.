"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";

type ToggleProps = {
  label: string;
  checked: boolean;
  onChange: (next: boolean) => void;
};

function Toggle({ label, checked, onChange }: ToggleProps) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className="flex items-center gap-2 rounded-full border border-line bg-white py-1.5 pl-3 pr-1.5 text-xs font-bold text-ink shadow-card active:scale-95"
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
    </button>
  );
}

/** スワイプ単語カードのプレビュー（漢字・ピンインの表示切替） */
export function VocabPreview() {
  const [showHanzi, setShowHanzi] = useState(true);
  const [showPinyin, setShowPinyin] = useState(true);

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="flex gap-2">
        <Toggle label="漢字" checked={showHanzi} onChange={setShowHanzi} />
        <Toggle label="ピンイン" checked={showPinyin} onChange={setShowPinyin} />
      </div>

      {/* 重なったカードの束 */}
      <div className="relative h-56 w-full max-w-[18rem]">
        <div className="absolute inset-x-6 top-4 h-full rounded-3xl border border-line bg-white/60" />
        <div className="absolute inset-x-3 top-2 h-full rounded-3xl border border-line bg-white/80" />
        <motion.div
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.6}
          whileDrag={{ rotate: 4, scale: 1.02 }}
          className="absolute inset-0 flex cursor-grab touch-pan-y flex-col items-center justify-center gap-1 rounded-3xl border border-brand-100 bg-white shadow-card active:cursor-grabbing"
        >
          <AnimatePresence mode="popLayout" initial={false}>
            {showPinyin && (
              <motion.p
                key="pinyin"
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                className="text-lg font-semibold text-brand-600"
              >
                xuéxí
              </motion.p>
            )}
            {showHanzi && (
              <motion.p
                key="hanzi"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                lang="zh-CN"
                className="text-5xl font-bold text-ink"
              >
                学习
              </motion.p>
            )}
            {!showHanzi && !showPinyin && (
              <motion.p
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-sm text-muted"
              >
                意味から思い出してみよう
              </motion.p>
            )}
          </AnimatePresence>
          <p className="mt-2 text-sm text-muted">学ぶ・勉強する</p>
          <p className="absolute bottom-3 text-[10px] text-muted/70">
            ← 左右にドラッグしてみてください →
          </p>
        </motion.div>
      </div>
    </div>
  );
}
