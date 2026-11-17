"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Check, Eye, ListChecks, PartyPopper, RotateCcw, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Pressable } from "@/components/ui/Pressable";
import { useIsClient } from "@/lib/useIsClient";
import { useResetOnHide } from "@/lib/useResetOnHide";
import { buildReviewQueue } from "@/lib/vocab/session";
import type { Grade } from "@/lib/vocab/srs";
import { displayStore, recordAnswer, srsStore } from "@/lib/vocab/stores";
import type { DeckMeta, Word } from "@/lib/vocab/types";
import { Burst } from "./Burst";
import { DisplayToggles } from "./DisplayToggles";
import { LinkButton } from "./LinkButton";
import { SessionHeader } from "./SessionHeader";
import { SwipeCard, type SwipeCardHandle } from "./SwipeCard";

type Props = { deck: DeckMeta; words: Word[] };

/** 「まだ」の単語を同じセッション内でもう一度出す回数の上限 */
const MAX_REQUEUE = 2;

function createRun(words: Word[]) {
  const queue = buildReviewQueue(words, srsStore.get());
  return { queue, initialCount: queue.length };
}

export function ReviewSession(props: Props) {
  const isClient = useIsClient();
  const { round, markDone, restart } = useResetOnHide();

  if (!isClient) {
    return <SessionHeader title={`${props.deck.title} スワイプ復習`} subtitle="準備中…" current={0} total={0} />;
  }
  return <ReviewRun key={round} {...props} onRestart={restart} onDone={markDone} />;
}

function ReviewRun({
  deck,
  words,
  onRestart,
  onDone,
}: Props & { onRestart: () => void; onDone: () => void }) {
  const [run] = useState(() => createRun(words));
  const [queue, setQueue] = useState(run.queue);
  const [index, setIndex] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const [tally, setTally] = useState({ good: 0, again: 0 });
  const requeued = useRef<Record<string, number>>({});
  const cardRef = useRef<SwipeCardHandle>(null);
  const { showHanzi, showPinyin } = displayStore.useStore();

  const word = queue[index];
  const next = queue[index + 1];
  const done = index >= queue.length;

  const handleDecide = (grade: Grade) => {
    if (!word) return;
    recordAnswer(word.id, grade);
    setTally((t) => ({ ...t, [grade]: t[grade] + 1 }));
    if (grade === "again" && (requeued.current[word.id] ?? 0) < MAX_REQUEUE) {
      requeued.current[word.id] = (requeued.current[word.id] ?? 0) + 1;
      setQueue((q) => {
        const copy = [...q];
        copy.splice(Math.min(index + 4, copy.length), 0, word);
        return copy;
      });
    }
    setRevealed(false);
    setIndex((i) => i + 1);
  };

  useEffect(() => {
    if (done) onDone();
  }, [done, onDone]);

  // PC 用のキーボード操作：← まだ / → 覚えた / Space 裏返す
  useEffect(() => {
    if (done) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") cardRef.current?.fling("good");
      else if (e.key === "ArrowLeft") cardRef.current?.fling("again");
      else if (e.key === " " || e.key === "Enter") {
        e.preventDefault();
        setRevealed((r) => !r);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [done]);

  const title = `${deck.title} スワイプ復習`;

  if (done) {
    return (
      <>
        <SessionHeader title={title} subtitle={deck.subtitle} current={queue.length} total={queue.length} />
        <ReviewResult
          deck={deck}
          empty={run.initialCount === 0}
          good={tally.good}
          again={tally.again}
          onRestart={onRestart}
        />
      </>
    );
  }

  return (
    <>
      <SessionHeader title={title} subtitle={deck.subtitle} current={index} total={queue.length} />
      <div className="flex flex-1 flex-col gap-3 px-4 py-3">
        <DisplayToggles />

        <div className="relative mx-auto h-[clamp(15rem,calc(100dvh-20rem),24rem)] w-full max-w-[21rem]">
          {next && (
            <div className="absolute inset-0 translate-y-3 scale-[0.94] rounded-3xl border border-line bg-white/70" />
          )}
          <SwipeCard
            key={`${word.id}-${index}`}
            ref={cardRef}
            word={word}
            showHanzi={showHanzi}
            showPinyin={showPinyin}
            revealed={revealed}
            onReveal={() => setRevealed((r) => !r)}
            onDecide={handleDecide}
          />
        </div>

        <div className="flex items-center justify-center gap-5">
          <Pressable
            aria-label="まだ覚えていない"
            onClick={() => cardRef.current?.fling("again")}
            className="flex h-16 w-16 items-center justify-center rounded-full border-2 border-brand-200 bg-white text-brand-600 shadow-card"
          >
            <X size={28} strokeWidth={2.6} />
          </Pressable>
          <Pressable
            aria-label="答えを見る"
            onClick={() => setRevealed((r) => !r)}
            className="flex h-12 w-12 items-center justify-center rounded-full bg-white text-muted shadow-card"
          >
            <Eye size={20} />
          </Pressable>
          <Pressable
            aria-label="覚えた"
            onClick={() => cardRef.current?.fling("good")}
            rippleClassName="bg-white/40"
            className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500 text-white shadow-card"
          >
            <Check size={28} strokeWidth={2.8} />
          </Pressable>
        </div>
        <p className="text-center text-[10px] text-muted">← まだ　スワイプ　覚えた →</p>
      </div>
    </>
  );
}

function ReviewResult({
  deck,
  empty,
  good,
  again,
  onRestart,
}: {
  deck: DeckMeta;
  empty: boolean;
  good: number;
  again: number;
  onRestart: () => void;
}) {
  return (
    <div className="flex flex-1 flex-col items-center gap-5 px-6 py-10 text-center">
      <motion.div
        className="relative flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-brand-500 to-brand-700 text-white shadow-card"
        initial={{ scale: 0, rotate: -30 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 14 }}
      >
        <PartyPopper size={40} />
        {!empty && <Burst radius={90} />}
      </motion.div>

      {empty ? (
        <div>
          <h2 className="text-xl font-extrabold text-ink">今は復習する単語がありません</h2>
          <p className="mt-1 text-sm text-muted">すべての単語を学習済みです。4択テストで腕試ししよう！</p>
        </div>
      ) : (
        <>
          <div>
            <h2 className="text-xl font-extrabold text-ink">お疲れさま！</h2>
            <p className="mt-1 text-sm text-muted">{deck.title}の復習が終わりました</p>
          </div>
          <AnimatePresence>
            <motion.div
              className="grid w-full grid-cols-2 gap-3"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <div className="rounded-2xl bg-emerald-50 py-4">
                <p className="text-3xl font-extrabold text-emerald-600">{good}</p>
                <p className="text-xs font-bold text-emerald-700">覚えた</p>
              </div>
              <div className="rounded-2xl bg-brand-50 py-4">
                <p className="text-3xl font-extrabold text-brand-600">{again}</p>
                <p className="text-xs font-bold text-brand-700">まだ</p>
              </div>
            </motion.div>
          </AnimatePresence>
        </>
      )}

      <div className="flex w-full flex-col gap-2">
        {!empty && (
          <Pressable
            onClick={onRestart}
            rippleClassName="bg-white/40"
            className="flex h-12 items-center justify-center gap-2 rounded-xl bg-brand-600 text-sm font-bold text-white shadow-card"
          >
            <RotateCcw size={16} />
            続けて復習する
          </Pressable>
        )}
        <LinkButton href={`/vocab/${deck.id}/quiz`} variant={empty ? "primary" : "secondary"}>
          <ListChecks size={16} />
          4択テストに挑戦
        </LinkButton>
        <LinkButton href="/vocab" variant="secondary">
          単語練習トップへ
        </LinkButton>
      </div>
    </div>
  );
}
