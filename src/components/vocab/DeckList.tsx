"use client";

import { motion } from "framer-motion";
import { Flame, ListChecks, Repeat, Sparkles, Target } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Stagger, StaggerItem } from "@/components/ui/Stagger";
import { useIsClient } from "@/lib/useIsClient";
import { dayKey, isDue, stageOf, type CardState } from "@/lib/vocab/srs";
import { activityStore, srsStore, streakOf } from "@/lib/vocab/stores";
import { NEW_PER_SESSION } from "@/lib/vocab/session";
import type { DeckMeta } from "@/lib/vocab/types";
import { LinkButton } from "./LinkButton";

type DeckStats = { fresh: number; learning: number; mastered: number; due: number };

/** 現在時刻。プリレンダー中（サーバー）は時刻に依存させず 0 を返す */
function currentTime(isClient: boolean): number {
  return isClient ? Date.now() : 0;
}

function deckStats(deck: DeckMeta, states: Record<string, CardState>, now: number): DeckStats {
  const prefix = `${deck.id}-`;
  let learning = 0;
  let mastered = 0;
  let due = 0;
  for (const [id, state] of Object.entries(states)) {
    if (!id.startsWith(prefix)) continue;
    // 以前の単語リスト（旧 HSK 2.0 の4級など）で記録した進捗は数えない
    const no = Number(id.slice(prefix.length));
    if (!(no >= deck.firstNo && no <= deck.lastNo)) continue;
    if (stageOf(state) === "mastered") mastered += 1;
    else learning += 1;
    if (isDue(state, now)) due += 1;
  }
  return { fresh: deck.total - learning - mastered, learning, mastered, due };
}

function todayStats(activity: Record<string, number>, now: number) {
  return { answered: activity[dayKey(now)] ?? 0, streak: streakOf(activity, now) };
}

function AnimatedNumber({ value }: { value: number }) {
  return (
    <motion.span
      key={value}
      initial={{ y: 6, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="text-xl font-extrabold tabular-nums text-ink"
    >
      {value}
    </motion.span>
  );
}

function DeckCard({ deck, stats }: { deck: DeckMeta; stats: DeckStats }) {
  const pct = (n: number) => `${(n / deck.total) * 100}%`;
  const reviewCount = stats.due + Math.min(NEW_PER_SESSION, stats.fresh);

  return (
    <Card className="p-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-lg font-extrabold text-ink">{deck.title}</h3>
          <p className="text-[11px] text-muted">{deck.subtitle}</p>
        </div>
        {stats.due > 0 ? (
          <motion.span
            initial={{ scale: 0.6 }}
            animate={{ scale: 1 }}
            className="rounded-full bg-brand-600 px-2.5 py-1 text-[11px] font-bold text-white"
          >
            復習 {stats.due}
          </motion.span>
        ) : (
          <span className="rounded-full bg-brand-50 px-2.5 py-1 text-[11px] font-bold text-brand-600">
            新出 {stats.fresh}
          </span>
        )}
      </div>

      {/* 進捗バー：習得 / 学習中 / 未学習 */}
      <div className="mt-3 flex h-2.5 overflow-hidden rounded-full bg-zinc-100">
        <motion.div
          className="h-full bg-brand-600"
          initial={{ width: 0 }}
          animate={{ width: pct(stats.mastered) }}
          transition={{ type: "spring", stiffness: 120, damping: 24 }}
        />
        <motion.div
          className="h-full bg-brand-300"
          initial={{ width: 0 }}
          animate={{ width: pct(stats.learning) }}
          transition={{ type: "spring", stiffness: 120, damping: 24, delay: 0.05 }}
        />
      </div>
      <div className="mt-1.5 flex gap-3 text-[10px] font-semibold text-muted">
        <span className="flex items-center gap-1">
          <i className="h-2 w-2 rounded-full bg-brand-600" />習得 {stats.mastered}
        </span>
        <span className="flex items-center gap-1">
          <i className="h-2 w-2 rounded-full bg-brand-300" />学習中 {stats.learning}
        </span>
        <span className="flex items-center gap-1">
          <i className="h-2 w-2 rounded-full bg-zinc-200" />未学習 {stats.fresh}
        </span>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-2">
        <LinkButton href={`/vocab/${deck.id}/review`}>
          <Repeat size={16} />
          <span className="whitespace-nowrap">スワイプ復習</span>
          {reviewCount > 0 && (
            <span className="rounded-full bg-white/25 px-1.5 text-[11px] tabular-nums">{reviewCount}</span>
          )}
        </LinkButton>
        <LinkButton href={`/vocab/${deck.id}/quiz`} variant="secondary">
          <ListChecks size={16} />
          <span className="whitespace-nowrap">4択テスト</span>
        </LinkButton>
      </div>
    </Card>
  );
}

export function DeckList({ decks }: { decks: DeckMeta[] }) {
  const states = srsStore.useStore();
  const activity = activityStore.useStore();
  const now = currentTime(useIsClient());
  const perDeck = decks.map((deck) => ({ deck, stats: deckStats(deck, states, now) }));
  const totalDue = perDeck.reduce((sum, d) => sum + d.stats.due, 0);
  const today = todayStats(activity, now);

  const summary = [
    { label: "今日の復習", value: totalDue, icon: Target },
    { label: "今日の回答", value: today.answered, icon: Sparkles },
    { label: "連続日数", value: today.streak, icon: Flame },
  ];

  return (
    <Stagger className="flex flex-col gap-5 px-4 py-5">
      <StaggerItem className="grid grid-cols-3 gap-2">
        {summary.map(({ label, value, icon: Icon }) => (
          <Card key={label} className="flex flex-col items-center gap-1 py-3">
            <Icon size={18} className="text-brand-500" />
            <AnimatedNumber value={value} />
            <span className="text-[10px] font-semibold text-muted">{label}</span>
          </Card>
        ))}
      </StaggerItem>

      {perDeck.map(({ deck, stats }) => (
        <StaggerItem key={deck.id}>
          <DeckCard deck={deck} stats={stats} />
        </StaggerItem>
      ))}

      <StaggerItem>
        <p className="px-2 text-center text-[11px] leading-relaxed text-muted">
          「覚えた」単語は 1日 → 3日 → 1週間…と間隔をあけて出題されます。
          <br />
          進捗はこの端末のブラウザに保存されます。
        </p>
      </StaggerItem>
    </Stagger>
  );
}
