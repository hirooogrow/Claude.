"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Brain, CircleAlert, RefreshCw } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { PageHeader } from "@/components/PageHeader";
import type { ChatResponse, ChatToken } from "@/lib/chat/schema";
import { messageText, type AssistantMessage, type ChatMessage } from "@/lib/chat/types";
import { chatStore, MAX_MEMORIES, memoryStore, settingsStore } from "@/lib/stores";
import { ChatInput } from "./ChatInput";
import { MemorySheet } from "./MemorySheet";
import { AssistantBubble, Avatar, TypingIndicator, UserBubble } from "./MessageBubbles";
import { WordSheet } from "./WordSheet";

/** API に送る直近の履歴数 */
const HISTORY_LIMIT = 20;

/** 最初のあいさつ（ローカル固定。タップ和訳も試せる） */
const GREETING: Pick<AssistantMessage, "tokens" | "translation" | "correction"> = {
  tokens: [
    { text: "你好", pinyin: "nǐ hǎo", meaning: "こんにちは" },
    { text: "！", pinyin: "", meaning: "" },
    { text: "我", pinyin: "wǒ", meaning: "私" },
    { text: "是", pinyin: "shì", meaning: "〜である" },
    { text: "小红", pinyin: "Xiǎo Hóng", meaning: "シャオホン（名前）" },
    { text: "。", pinyin: "", meaning: "" },
    { text: "今天", pinyin: "jīntiān", meaning: "今日" },
    { text: "过", pinyin: "guò", meaning: "過ごす" },
    { text: "得", pinyin: "de", meaning: "（様子を表す）" },
    { text: "怎么样", pinyin: "zěnmeyàng", meaning: "どう？" },
    { text: "？", pinyin: "", meaning: "" },
  ],
  translation: "こんにちは！私は小红だよ。今日はどうだった？",
  correction: "",
};

const SUGGESTIONS = ["你好！我是日本人。", "今天很累😮‍💨", "推荐一个中国菜吧！", "はじめまして！"];

function newId() {
  return crypto.randomUUID();
}

function createUserMessage(text: string): ChatMessage {
  return { id: newId(), role: "user", text, createdAt: Date.now() };
}

function mergeMemories(prev: string[], incoming: string[]) {
  const next = [...prev];
  for (const memory of incoming.map((m) => m.trim()).filter(Boolean)) {
    if (!next.includes(memory)) next.push(memory);
  }
  return next.slice(-MAX_MEMORIES);
}

export function ChatScreen() {
  const messages = chatStore.useStore();
  const memories = memoryStore.useStore();
  const { showPinyin } = settingsStore.useStore();

  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selected, setSelected] = useState<ChatToken | null>(null);
  const [memoryOpen, setMemoryOpen] = useState(false);
  const [memoryPulse, setMemoryPulse] = useState(0);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (messages.length === 0 && !pending) return;
    endRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages.length, pending, error]);

  const requestReply = async (history: ChatMessage[]) => {
    setPending(true);
    setError(null);
    try {
      const payload = history
        .slice(-HISTORY_LIMIT)
        .map((m) => ({ role: m.role, content: messageText(m).slice(0, 1000) }))
        .filter((m) => m.content.trim() !== "");

      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: payload, memories: memoryStore.get() }),
      });
      const data = (await res.json().catch(() => null)) as ChatResponse | null;
      if (!data) throw new Error("サーバーに接続できませんでした");
      if (!data.ok) throw new Error(data.error);

      const { reply, demo } = data;
      chatStore.set((prev) => [
        ...prev,
        {
          id: newId(),
          role: "assistant",
          tokens: reply.tokens,
          translation: reply.translation,
          correction: reply.correction,
          demo,
          createdAt: Date.now(),
        },
      ]);
      if (reply.new_memories.length > 0) {
        memoryStore.set((prev) => mergeMemories(prev, reply.new_memories));
        setMemoryPulse((n) => n + 1);
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "通信エラーが発生しました");
    } finally {
      setPending(false);
    }
  };

  const send = (text: string) => {
    const next = [...chatStore.get(), createUserMessage(text)];
    chatStore.set(next);
    void requestReply(next);
  };

  const lastIsUser = messages.at(-1)?.role === "user";

  return (
    <>
      <PageHeader
        title="親友AIチャット"
        zh="好朋友"
        pinyin="hǎo péngyou"
        right={
          <div className="flex items-center gap-1.5">
            <motion.button
              type="button"
              whileTap={{ scale: 0.9 }}
              role="switch"
              aria-checked={showPinyin}
              aria-label="ピンイン表示"
              onClick={() => settingsStore.set((s) => ({ ...s, showPinyin: !s.showPinyin }))}
              className={`h-9 rounded-full px-3 text-[11px] font-bold transition-colors ${
                showPinyin ? "bg-brand-600 text-white" : "bg-brand-50 text-brand-600"
              }`}
            >
              pīnyīn
            </motion.button>
            <motion.button
              key={memoryPulse}
              type="button"
              aria-label="小红が覚えていること"
              onClick={() => setMemoryOpen(true)}
              whileTap={{ scale: 0.9 }}
              animate={memoryPulse > 0 ? { scale: [1, 1.25, 1], rotate: [0, -10, 10, 0] } : undefined}
              transition={{ duration: 0.6 }}
              className="relative flex h-9 w-9 items-center justify-center rounded-full bg-brand-50 text-brand-600"
            >
              <Brain size={18} />
              {memories.length > 0 && (
                <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-brand-600 px-1 text-[9px] font-bold text-white ring-2 ring-white">
                  {memories.length}
                </span>
              )}
            </motion.button>
          </div>
        }
      />

      <div className="flex flex-1 flex-col gap-4 px-4 py-5">
        <div className="flex flex-col items-center gap-2 py-1 text-center">
          <Avatar size="lg" />
          <div>
            <p className="font-bold text-ink">小红 (Xiǎo Hóng)</p>
            <p className="text-xs text-muted">杭州出身・カフェ店員の親友。単語をタップで和訳！</p>
          </div>
        </div>

        <AssistantBubble
          message={GREETING}
          showPinyin={showPinyin}
          selected={selected}
          onSelect={setSelected}
        />

        {messages.map((message) =>
          message.role === "user" ? (
            <UserBubble key={message.id} text={message.text} />
          ) : (
            <AssistantBubble
              key={message.id}
              message={message}
              showPinyin={showPinyin}
              selected={selected}
              onSelect={setSelected}
            />
          ),
        )}

        <AnimatePresence>
          {messages.length === 0 && !pending && (
            <motion.div
              className="flex flex-wrap justify-end gap-2"
              exit={{ opacity: 0, y: 8 }}
            >
              {SUGGESTIONS.map((s, i) => (
                <motion.button
                  key={s}
                  type="button"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0, transition: { delay: 0.3 + i * 0.07 } }}
                  whileTap={{ scale: 0.92 }}
                  onClick={() => send(s)}
                  className="rounded-full border border-brand-200 bg-white px-3 py-1.5 text-[13px] font-semibold text-brand-700 shadow-card"
                >
                  {s}
                </motion.button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {pending && <TypingIndicator />}

        {error && !pending && lastIsUser && (
          <motion.div
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: [0, -6, 6, -3, 0] }}
            className="flex items-center gap-2 self-start rounded-2xl border border-brand-200 bg-brand-50 px-3 py-2 text-[12px] text-brand-800"
            role="alert"
          >
            <CircleAlert size={16} className="shrink-0" />
            <span>{error}</span>
            <motion.button
              type="button"
              whileTap={{ scale: 0.9 }}
              onClick={() => requestReply(chatStore.get())}
              className="ml-1 flex shrink-0 items-center gap-1 whitespace-nowrap rounded-full bg-brand-600 px-2.5 py-1 font-bold text-white"
            >
              <RefreshCw size={12} />
              再送
            </motion.button>
          </motion.div>
        )}

        <div ref={endRef} className="h-1" />
      </div>

      <ChatInput disabled={pending} onSend={send} />

      <WordSheet token={selected} onClose={() => setSelected(null)} />
      <MemorySheet open={memoryOpen} onClose={() => setMemoryOpen(false)} />
    </>
  );
}
