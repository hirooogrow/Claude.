"use client";

import { createLocalStore } from "../storage";
import { dayKey, schedule, type CardState, type Grade } from "./srs";

const EMPTY_CARDS: Record<string, CardState> = {};
const EMPTY_ACTIVITY: Record<string, number> = {};

/** 単語ごとの復習状態（キーは Word.id） */
export const srsStore = createLocalStore<Record<string, CardState>>("hp.srs.v1", EMPTY_CARDS);

/** 日ごとの回答数（連続日数の計算に使う） */
export const activityStore = createLocalStore<Record<string, number>>("hp.activity.v1", EMPTY_ACTIVITY);

/** カードの表示設定 */
export const displayStore = createLocalStore<{ showHanzi: boolean; showPinyin: boolean }>(
  "hp.display.v1",
  { showHanzi: true, showPinyin: true },
);

/** 回答を記録して次の復習日を決める */
export function recordAnswer(wordId: string, grade: Grade) {
  const now = Date.now();
  srsStore.set((prev) => ({ ...prev, [wordId]: schedule(prev[wordId], grade, now) }));
  const key = dayKey(now);
  activityStore.set((prev) => ({ ...prev, [key]: (prev[key] ?? 0) + 1 }));
}

/** 今日を含む連続学習日数（今日まだ学習していなければ昨日まで） */
export function streakOf(activity: Record<string, number>, now: number): number {
  let day = now;
  if (!activity[dayKey(day)]) day -= 86_400_000;
  let streak = 0;
  while (activity[dayKey(day)]) {
    streak += 1;
    day -= 86_400_000;
  }
  return streak;
}

/**
 * 4択テストの回答を記録する。
 * 不正解は「まだ」として扱い、正解は新出か復習期限が来ている単語のときだけ「覚えた」として進める
 * （期限前の単語を正解しても間隔を伸ばしすぎないため）。
 */
export function recordQuizAnswer(wordId: string, correct: boolean) {
  const now = Date.now();
  const state = srsStore.get()[wordId];
  if (!correct || !state || state.due <= now) {
    recordAnswer(wordId, correct ? "good" : "again");
    return;
  }
  const key = dayKey(now);
  activityStore.set((prev) => ({ ...prev, [key]: (prev[key] ?? 0) + 1 }));
}
