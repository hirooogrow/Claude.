"use client";

import { motion } from "framer-motion";
import { Send } from "lucide-react";
import { useState } from "react";
import { Pressable } from "../ui/Pressable";

type Props = { disabled: boolean; onSend: (text: string) => void };

export function ChatInput({ disabled, onSend }: Props) {
  const [value, setValue] = useState("");
  const canSend = !disabled && value.trim().length > 0;

  const submit = () => {
    if (!canSend) return;
    onSend(value.trim());
    setValue("");
  };

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        submit();
      }}
      className="sticky bottom-[calc(4rem+env(safe-area-inset-bottom))] z-20 border-t border-line bg-white/90 px-3 py-2.5 backdrop-blur-md"
    >
      <div className="flex items-center gap-2">
        <input
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={(e) => {
            // 日本語・中国語 IME の変換確定 Enter で送信しない
            if (e.key === "Enter" && (e.nativeEvent.isComposing || e.keyCode === 229)) {
              e.preventDefault();
            }
          }}
          maxLength={500}
          enterKeyHint="send"
          placeholder="中国語でも日本語でもOK"
          aria-label="メッセージ"
          className="h-11 min-w-0 flex-1 rounded-full border border-line bg-canvas px-4 text-[16px] placeholder:text-muted/70 focus:border-brand-400 focus:bg-white focus:outline-none"
        />
        <Pressable
          type="submit"
          aria-label="送信"
          disabled={!canSend}
          rippleClassName="bg-white/40"
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-brand-600 text-white shadow-card transition-opacity disabled:opacity-40"
        >
          <motion.span
            key={String(canSend)}
            initial={{ rotate: canSend ? -30 : 0, scale: 0.8 }}
            animate={{ rotate: 0, scale: 1 }}
            transition={{ type: "spring", stiffness: 500, damping: 15 }}
          >
            <Send size={18} />
          </motion.span>
        </Pressable>
      </div>
    </form>
  );
}
