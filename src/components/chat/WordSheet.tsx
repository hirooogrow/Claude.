"use client";

import { AnimatePresence, motion } from "framer-motion";
import { BookmarkCheck, BookmarkPlus, Volume2 } from "lucide-react";
import { useState } from "react";
import type { ChatToken } from "@/lib/chat/schema";
import { speakChinese } from "@/lib/speech";
import { vocabStore } from "@/lib/stores";
import { BottomSheet } from "../ui/BottomSheet";
import { Pressable } from "../ui/Pressable";

const BURST = Array.from({ length: 8 }, (_, i) => (i / 8) * Math.PI * 2);

type Props = { token: ChatToken | null; onClose: () => void };

/** 単語タップ時の和訳ポップアップ */
export function WordSheet({ token, onClose }: Props) {
  const words = vocabStore.useStore();
  const saved = token ? words.some((w) => w.hanzi === token.text) : false;
  /** この画面で今登録した単語（はじけるエフェクト用） */
  const [justSaved, setJustSaved] = useState<string | null>(null);

  const save = () => {
    if (!token || saved) return;
    vocabStore.set((prev) => [
      { hanzi: token.text, pinyin: token.pinyin, meaning: token.meaning, source: "chat", addedAt: Date.now() },
      ...prev,
    ]);
    setJustSaved(token.text);
    navigator.vibrate?.(15);
  };

  return (
    <BottomSheet open={token !== null} onClose={onClose} label="単語の意味">
      {token && (
        <div className="flex flex-col items-center gap-4 text-center">
          <div className="flex items-center gap-3">
            <div>
              <p className="text-sm font-semibold text-brand-600">{token.pinyin}</p>
              <p className="text-5xl font-bold text-ink">{token.text}</p>
            </div>
            <Pressable
              aria-label="発音を聞く"
              onClick={() => speakChinese(token.text)}
              className="flex h-11 w-11 items-center justify-center rounded-full bg-brand-50 text-brand-600"
            >
              <Volume2 size={20} />
            </Pressable>
          </div>

          <p className="w-full rounded-2xl bg-canvas px-4 py-3 text-base font-semibold text-ink">
            {token.meaning}
          </p>

          <div className="relative w-full">
            <Pressable
              onClick={save}
              disabled={saved}
              rippleClassName="bg-white/40"
              className={`flex h-12 w-full items-center justify-center gap-2 rounded-2xl text-sm font-bold transition-colors ${
                saved ? "bg-brand-50 text-brand-600" : "bg-brand-600 text-white shadow-card"
              }`}
            >
              <AnimatePresence mode="wait" initial={false}>
                {saved ? (
                  <motion.span
                    key="saved"
                    className="flex items-center gap-2"
                    initial={{ scale: 0.4, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: "spring", stiffness: 600, damping: 14 }}
                  >
                    <BookmarkCheck size={18} />
                    My単語に登録済み
                  </motion.span>
                ) : (
                  <motion.span
                    key="add"
                    className="flex items-center gap-2"
                    exit={{ scale: 0.6, opacity: 0 }}
                  >
                    <BookmarkPlus size={18} />
                    単語帳に追加
                  </motion.span>
                )}
              </AnimatePresence>
            </Pressable>

            {/* 登録時のはじけるエフェクト */}
            <AnimatePresence>
              {saved && justSaved === token.text && (
                <motion.div
                  key={`burst-${token.text}`}
                  className="pointer-events-none absolute left-1/2 top-1/2"
                  initial={{ opacity: 1 }}
                  animate={{ opacity: 0 }}
                  transition={{ duration: 0.7, delay: 0.25 }}
                >
                  {BURST.map((angle, i) => (
                    <motion.span
                      key={i}
                      className={`absolute h-2 w-2 rounded-full ${i % 2 ? "bg-gold-400" : "bg-brand-500"}`}
                      initial={{ x: 0, y: 0, scale: 0 }}
                      animate={{ x: Math.cos(angle) * 70, y: Math.sin(angle) * 34, scale: 1 }}
                      transition={{ duration: 0.5, ease: "easeOut" }}
                    />
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      )}
    </BottomSheet>
  );
}
