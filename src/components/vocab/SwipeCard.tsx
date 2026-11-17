"use client";

import { animate, motion, useMotionValue, useTransform, type PanInfo } from "framer-motion";
import { Volume2 } from "lucide-react";
import { useImperativeHandle, useRef } from "react";
import { speakChinese } from "@/lib/speech";
import type { Grade } from "@/lib/vocab/srs";
import type { Word } from "@/lib/vocab/types";

export type SwipeCardHandle = { fling: (grade: Grade) => void };

type Props = {
  word: Word;
  showHanzi: boolean;
  showPinyin: boolean;
  revealed: boolean;
  onReveal: () => void;
  /** カードが画面外へ飛んだ後に呼ばれる */
  onDecide: (grade: Grade) => void;
  ref?: React.Ref<SwipeCardHandle>;
};

const SWIPE_DISTANCE = 110;
const SWIPE_VELOCITY = 600;

export function SwipeCard({ word, showHanzi, showPinyin, revealed, onReveal, onDecide, ref }: Props) {
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-240, 240], [-16, 16]);
  const goodOpacity = useTransform(x, [20, SWIPE_DISTANCE], [0, 1]);
  const againOpacity = useTransform(x, [-SWIPE_DISTANCE, -20], [1, 0]);

  const flying = useRef(false);
  const fling = (grade: Grade) => {
    if (flying.current) return;
    flying.current = true;
    navigator.vibrate?.(grade === "good" ? 12 : [8, 40, 8]);
    animate(x, grade === "good" ? 520 : -520, { duration: 0.28, ease: "easeIn" }).then(() =>
      onDecide(grade),
    );
  };

  useImperativeHandle(ref, () => ({ fling }));

  const handleDragEnd = (_: unknown, info: PanInfo) => {
    if (info.offset.x > SWIPE_DISTANCE || info.velocity.x > SWIPE_VELOCITY) fling("good");
    else if (info.offset.x < -SWIPE_DISTANCE || info.velocity.x < -SWIPE_VELOCITY) fling("again");
    else animate(x, 0, { type: "spring", stiffness: 500, damping: 30 });
  };

  // 漢字もピンインも隠しているときは、意味から思い出す（逆向き）カードにする
  const meaningFirst = !showHanzi && !showPinyin;

  return (
    <motion.div
      className="absolute inset-0 cursor-grab touch-pan-y select-none active:cursor-grabbing"
      style={{ x, rotate }}
      drag="x"
      dragElastic={0.9}
      dragMomentum={false}
      onDragEnd={handleDragEnd}
      onTap={onReveal}
      initial={{ scale: 0.94, y: 14, opacity: 0.6 }}
      animate={{ scale: 1, y: 0, opacity: 1 }}
      transition={{ type: "spring", stiffness: 380, damping: 30 }}
    >
      <motion.div
        className="relative h-full w-full"
        style={{ transformStyle: "preserve-3d" }}
        animate={{ rotateY: revealed ? 180 : 0 }}
        transition={{ type: "spring", stiffness: 260, damping: 26 }}
      >
        {/* 表 */}
        <div
          className="absolute inset-0 flex flex-col items-center justify-center gap-2 rounded-3xl border border-brand-100 bg-white px-6 text-center shadow-card"
          style={{ backfaceVisibility: "hidden" }}
        >
          {meaningFirst ? (
            <p className="text-2xl font-bold leading-snug text-ink">{word.meaning}</p>
          ) : (
            <>
              {showPinyin && <p className="text-xl font-semibold text-brand-600">{word.pinyin}</p>}
              {showHanzi && (
                <p lang="zh-CN" className="text-6xl font-bold leading-tight text-ink">
                  {word.hanzi}
                </p>
              )}
            </>
          )}
          <p className="absolute bottom-4 text-[11px] text-muted/80">タップで答えを見る</p>
        </div>

        {/* 裏 */}
        <div
          className="absolute inset-0 flex flex-col items-center justify-center gap-2 rounded-3xl border border-brand-200 bg-gradient-to-b from-white to-brand-50 px-6 text-center shadow-card"
          style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
        >
          <p className="text-lg font-semibold text-brand-600">{word.pinyin}</p>
          <div className="flex items-center gap-2">
            <p lang="zh-CN" className="text-5xl font-bold leading-tight text-ink">
              {word.hanzi}
            </p>
            <motion.button
              type="button"
              aria-label="発音を聞く"
              whileTap={{ scale: 0.85 }}
              onPointerDown={(e) => e.stopPropagation()}
              onClick={() => speakChinese(word.hanzi)}
              className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-brand-600 shadow-card"
            >
              <Volume2 size={18} />
            </motion.button>
          </div>
          <p className="mt-2 text-lg font-bold leading-snug text-ink">{word.meaning}</p>
          {word.pos && <p className="text-[11px] text-muted">{word.pos}</p>}
        </div>
      </motion.div>

      {/* スワイプ中のスタンプ */}
      <motion.span
        style={{ opacity: goodOpacity }}
        className="pointer-events-none absolute left-5 top-5 -rotate-12 rounded-lg border-2 border-emerald-500 px-2 py-0.5 text-lg font-extrabold text-emerald-500"
      >
        覚えた
      </motion.span>
      <motion.span
        style={{ opacity: againOpacity }}
        className="pointer-events-none absolute right-5 top-5 rotate-12 rounded-lg border-2 border-brand-500 px-2 py-0.5 text-lg font-extrabold text-brand-500"
      >
        まだ
      </motion.span>
    </motion.div>
  );
}
