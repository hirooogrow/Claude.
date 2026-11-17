"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Languages, PencilLine } from "lucide-react";
import { useState } from "react";
import type { ChatToken } from "@/lib/chat/schema";
import { isWord, type AssistantMessage } from "@/lib/chat/types";

const bubbleMotion = {
  initial: { opacity: 0, y: 12, scale: 0.96 },
  animate: { opacity: 1, y: 0, scale: 1 },
  transition: { type: "spring" as const, stiffness: 380, damping: 28 },
};

export function Avatar({ size = "sm" }: { size?: "sm" | "lg" }) {
  return (
    <div
      className={`flex shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-brand-500 to-brand-700 font-bold text-white ${
        size === "lg" ? "h-16 w-16 text-2xl shadow-card" : "h-8 w-8 text-sm"
      }`}
    >
      红
    </div>
  );
}

export function UserBubble({ text }: { text: string }) {
  return (
    <motion.div {...bubbleMotion} className="flex justify-end">
      <div className="max-w-[78%] whitespace-pre-wrap break-words rounded-2xl rounded-br-md bg-brand-600 px-3.5 py-2.5 text-[15px] text-white shadow-card">
        {text}
      </div>
    </motion.div>
  );
}

type AssistantBubbleProps = {
  message: Pick<AssistantMessage, "tokens" | "translation" | "correction" | "demo">;
  showPinyin: boolean;
  selected: ChatToken | null;
  onSelect: (token: ChatToken) => void;
};

export function AssistantBubble({
  message,
  showPinyin,
  selected,
  onSelect,
}: AssistantBubbleProps) {
  const [showTranslation, setShowTranslation] = useState(false);

  return (
    <motion.div {...bubbleMotion} className="flex flex-col gap-2">
      {message.correction && (
        <div className="ml-10 flex max-w-[82%] gap-2 rounded-2xl border border-gold-400/40 bg-gold-400/10 px-3 py-2 text-[12px] leading-relaxed text-ink">
          <PencilLine size={14} className="mt-0.5 shrink-0 text-gold-500" />
          <p>
            <span className="font-bold text-gold-500">添削 </span>
            {message.correction}
          </p>
        </div>
      )}

      <div className="flex items-end gap-2">
        <Avatar />
        <div className="max-w-[80%] rounded-2xl rounded-bl-md border border-line bg-white px-3 py-2 shadow-card">
          <p className="flex flex-wrap items-end gap-x-0.5 gap-y-1 text-[18px] leading-snug text-ink">
            {message.tokens.map((token, i) =>
              isWord(token) ? (
                <motion.button
                  key={i}
                  type="button"
                  whileTap={{ scale: 0.85 }}
                  onClick={() => onSelect(token)}
                  className={`rounded-md px-0.5 transition-colors ${
                    selected === token
                      ? "bg-brand-100 text-brand-700"
                      : "underline decoration-brand-200 decoration-dotted underline-offset-[5px] active:bg-brand-50"
                  }`}
                >
                  {showPinyin ? (
                    <ruby>
                      {token.text}
                      <rt className="pb-0.5 text-[10px] font-medium text-brand-500">
                        {token.pinyin}
                      </rt>
                    </ruby>
                  ) : (
                    token.text
                  )}
                </motion.button>
              ) : (
                <span key={i}>{token.text}</span>
              ),
            )}
          </p>

          <AnimatePresence initial={false}>
            {showTranslation && (
              <motion.p
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden text-[13px] leading-relaxed text-muted"
              >
                <span className="mt-2 block border-t border-dashed border-line pt-2">
                  {message.translation}
                </span>
              </motion.p>
            )}
          </AnimatePresence>
        </div>
      </div>

      <div className="ml-10 flex items-center gap-2">
        <motion.button
          type="button"
          whileTap={{ scale: 0.9 }}
          onClick={() => setShowTranslation((v) => !v)}
          aria-expanded={showTranslation}
          className={`flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-bold transition-colors ${
            showTranslation ? "bg-brand-600 text-white" : "bg-brand-50 text-brand-600"
          }`}
        >
          <Languages size={12} />
          {showTranslation ? "和訳を隠す" : "和訳"}
        </motion.button>
        {message.demo && (
          <span className="text-[10px] text-muted">デモ応答（APIキー未設定）</span>
        )}
      </div>
    </motion.div>
  );
}

export function TypingIndicator() {
  return (
    <motion.div {...bubbleMotion} className="flex items-end gap-2" aria-label="小红が入力中">
      <Avatar />
      <div className="flex gap-1 rounded-2xl rounded-bl-md border border-line bg-white px-4 py-3.5 shadow-card">
        {[0, 1, 2].map((i) => (
          <motion.span
            key={i}
            className="h-2 w-2 rounded-full bg-brand-400"
            animate={{ y: [0, -5, 0], opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 0.9, repeat: Infinity, delay: i * 0.15 }}
          />
        ))}
      </div>
    </motion.div>
  );
}
