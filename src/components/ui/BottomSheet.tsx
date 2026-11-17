"use client";

import { AnimatePresence, motion, type PanInfo } from "framer-motion";
import { useEffect } from "react";
import { createPortal } from "react-dom";
import { useIsClient } from "@/lib/useIsClient";

type BottomSheetProps = {
  open: boolean;
  onClose: () => void;
  /** スクリーンリーダー向けのラベル */
  label: string;
  children: React.ReactNode;
};

/** 下から出てくるシート。下方向へのスワイプ・背景タップ・Esc で閉じる */
export function BottomSheet({ open, onClose, label, children }: BottomSheetProps) {
  const isClient = useIsClient();
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  const handleDragEnd = (_: unknown, info: PanInfo) => {
    if (info.offset.y > 80 || info.velocity.y > 500) onClose();
  };

  if (!isClient) return null;

  // ページ遷移アニメーションの重なり順に閉じ込められないよう body 直下に描画する
  return createPortal(
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50">
          <motion.div
            className="absolute inset-0 bg-ink/40 backdrop-blur-[2px]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label={label}
            className="pb-safe absolute inset-x-0 bottom-0 mx-auto max-w-md rounded-t-3xl bg-white shadow-[0_-12px_40px_-12px_rgb(124_25_34/0.35)]"
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", stiffness: 420, damping: 38 }}
            drag="y"
            dragConstraints={{ top: 0, bottom: 0 }}
            dragElastic={{ top: 0, bottom: 0.6 }}
            onDragEnd={handleDragEnd}
          >
            <div className="flex justify-center pt-2.5 pb-1">
              <span className="h-1.5 w-10 rounded-full bg-zinc-200" />
            </div>
            <div className="px-5 pt-2 pb-6">{children}</div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body,
  );
}
