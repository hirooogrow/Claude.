"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Brain, RotateCcw, X } from "lucide-react";
import { chatStore, memoryStore } from "@/lib/stores";
import { BottomSheet } from "../ui/BottomSheet";
import { Pressable } from "../ui/Pressable";

type Props = { open: boolean; onClose: () => void };

/** 小红が覚えていることの一覧と、記憶・会話のリセット */
export function MemorySheet({ open, onClose }: Props) {
  const memories = memoryStore.useStore();

  const forget = (target: string) =>
    memoryStore.set((prev) => prev.filter((m) => m !== target));

  const resetChat = () => {
    if (window.confirm("会話の履歴を消去しますか？（覚えていることは残ります）")) {
      chatStore.set([]);
      onClose();
    }
  };

  const resetAll = () => {
    if (window.confirm("小红の記憶と会話をすべて消去しますか？")) {
      memoryStore.set([]);
      chatStore.set([]);
      onClose();
    }
  };

  return (
    <BottomSheet open={open} onClose={onClose} label="小红が覚えていること">
      <div className="flex items-center gap-2">
        <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-50 text-brand-600">
          <Brain size={18} />
        </span>
        <div>
          <h2 className="font-bold text-ink">小红が覚えていること</h2>
          <p className="text-[11px] text-muted">会話から自動で覚えます</p>
        </div>
      </div>

      <ul className="mt-4 flex max-h-[40dvh] flex-col gap-2 overflow-y-auto">
        <AnimatePresence initial={false}>
          {memories.map((memory) => (
            <motion.li
              key={memory}
              layout
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 40, height: 0 }}
              className="flex items-center gap-2 rounded-xl bg-canvas px-3 py-2.5 text-sm text-ink"
            >
              <span className="flex-1">{memory}</span>
              <motion.button
                type="button"
                whileTap={{ scale: 0.8 }}
                aria-label={`「${memory}」を忘れる`}
                onClick={() => forget(memory)}
                className="rounded-full p-1 text-muted active:bg-brand-50"
              >
                <X size={14} />
              </motion.button>
            </motion.li>
          ))}
        </AnimatePresence>
        {memories.length === 0 && (
          <li className="rounded-xl bg-canvas px-3 py-4 text-center text-sm text-muted">
            まだ何も覚えていません。自己紹介してみよう！
          </li>
        )}
      </ul>

      <div className="mt-5 grid grid-cols-2 gap-2">
        <Pressable
          onClick={resetChat}
          className="flex h-11 items-center justify-center gap-1.5 rounded-xl border border-line text-xs font-bold text-ink"
        >
          <RotateCcw size={14} />
          会話をリセット
        </Pressable>
        <Pressable
          onClick={resetAll}
          className="flex h-11 items-center justify-center gap-1.5 rounded-xl bg-brand-50 text-xs font-bold text-brand-700"
        >
          すべて忘れる
        </Pressable>
      </div>
    </BottomSheet>
  );
}
