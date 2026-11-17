/**
 * 忘却曲線に沿った復習スケジュール（SM-2 を簡略化したもの）。
 * 「覚えた」で間隔を 1日 → 3日 → 前回×易しさ と伸ばし、「まだ」で 10分後に戻す。
 */

export type Grade = "again" | "good";

export type CardState = {
  /** 連続で「覚えた」になった回数 */
  reps: number;
  /** 次の復習までの日数 */
  interval: number;
  /** 易しさ係数（1.3〜） */
  ease: number;
  /** 次に出題する時刻（ms） */
  due: number;
  /** 覚えていたのに忘れた回数 */
  lapses: number;
  /** 最後に答えた時刻（ms） */
  last: number;
};

export type Stage = "new" | "learning" | "mastered";

const MINUTE = 60_000;
export const DAY = 86_400_000;
/** この日数以上の間隔になったら「習得」 */
export const MASTERED_INTERVAL = 7;

export function startOfDay(time: number): number {
  const d = new Date(time);
  d.setHours(0, 0, 0, 0);
  return d.getTime();
}

/** ローカル日付のキー（YYYY-MM-DD） */
export function dayKey(time: number): string {
  const d = new Date(time);
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${d.getFullYear()}-${mm}-${dd}`;
}

export function schedule(prev: CardState | undefined, grade: Grade, now: number): CardState {
  const base: CardState = prev ?? { reps: 0, interval: 0, ease: 2.5, due: now, lapses: 0, last: now };

  if (grade === "again") {
    return {
      ...base,
      reps: 0,
      interval: 0,
      ease: Math.max(1.3, base.ease - 0.2),
      lapses: base.reps > 0 ? base.lapses + 1 : base.lapses,
      due: now + 10 * MINUTE,
      last: now,
    };
  }

  const reps = base.reps + 1;
  const interval =
    reps === 1 ? 1 : reps === 2 ? 3 : Math.max(base.interval + 1, Math.round(base.interval * base.ease));
  return { ...base, reps, interval, due: startOfDay(now) + interval * DAY, last: now };
}

export function stageOf(state: CardState | undefined): Stage {
  if (!state) return "new";
  return state.interval >= MASTERED_INTERVAL ? "mastered" : "learning";
}

export function isDue(state: CardState | undefined, now: number): boolean {
  return state !== undefined && state.due <= now;
}
