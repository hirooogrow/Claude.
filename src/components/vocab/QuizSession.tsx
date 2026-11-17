"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, Check, Repeat, RotateCcw, Trophy, Volume2, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Pressable } from "@/components/ui/Pressable";
import { speakChinese } from "@/lib/speech";
import { useIsClient } from "@/lib/useIsClient";
import { useResetOnHide } from "@/lib/useResetOnHide";
import { buildQuiz, type QuizQuestion } from "@/lib/vocab/session";
import { displayStore, recordQuizAnswer, srsStore } from "@/lib/vocab/stores";
import type { DeckMeta, Word } from "@/lib/vocab/types";
import { Burst } from "./Burst";
import { DisplayToggles } from "./DisplayToggles";
import { LinkButton } from "./LinkButton";
import { SessionHeader } from "./SessionHeader";

type Props = { deck: DeckMeta; words: Word[] };

export function QuizSession(props: Props) {
  const isClient = useIsClient();
  const { round, markDone, restart } = useResetOnHide();
  if (!isClient) {
    return <SessionHeader title={`${props.deck.title} 4択テスト`} subtitle="準備中…" current={0} total={0} />;
  }
  return <QuizRun key={round} {...props} onRestart={restart} onDone={markDone} />;
}

function QuizRun({
  deck,
  words,
  onRestart,
  onDone,
}: Props & { onRestart: () => void; onDone: () => void }) {
  const [questions] = useState(() => buildQuiz(words, srsStore.get()));
  const [index, setIndex] = useState(0);
  const [picked, setPicked] = useState<string | null>(null);
  const [mistakes, setMistakes] = useState<Word[]>([]);
  const advanceTimer = useRef<ReturnType<typeof setTimeout>>(undefined);
  const { showPinyin } = displayStore.useStore();

  useEffect(() => () => clearTimeout(advanceTimer.current), []);

  const question = questions[index];
  const finished = !question;

  useEffect(() => {
    if (finished) onDone();
  }, [finished, onDone]);

  const title = `${deck.title} 4択テスト`;

  const next = () => {
    clearTimeout(advanceTimer.current);
    setPicked(null);
    setIndex((i) => i + 1);
  };

  const choose = (option: Word) => {
    if (picked || !question) return;
    const correct = option.id === question.word.id;
    setPicked(option.id);
    recordQuizAnswer(question.word.id, correct);
    if (correct) {
      navigator.vibrate?.(15);
      advanceTimer.current = setTimeout(next, 1100);
    } else {
      navigator.vibrate?.([10, 50, 10]);
      setMistakes((m) => [...m, question.word]);
    }
  };

  if (!question) {
    return (
      <>
        <SessionHeader title={title} subtitle={deck.subtitle} current={questions.length} total={questions.length} />
        <QuizResult deck={deck} total={questions.length} mistakes={mistakes} onRestart={onRestart} />
      </>
    );
  }

  return (
    <>
      <SessionHeader title={title} subtitle={deck.subtitle} current={index} total={questions.length} />
      <div className="flex flex-1 flex-col gap-3 px-4 py-3">
        <DisplayToggles />
        <AnimatePresence mode="wait">
          <motion.div
            key={index}
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -40 }}
            transition={{ type: "spring", stiffness: 400, damping: 34 }}
            className="flex flex-col gap-3"
          >
            <Prompt question={question} showPinyin={showPinyin} answered={picked !== null} />
            <div className="flex flex-col gap-2.5">
              {question.options.map((option) => (
                <OptionButton
                  key={option.id}
                  option={option}
                  kind={question.kind}
                  showPinyin={showPinyin}
                  state={
                    picked === null
                      ? "idle"
                      : option.id === question.word.id
                        ? picked === option.id
                          ? "correct"
                          : "answer"
                        : picked === option.id
                          ? "wrong"
                          : "dim"
                  }
                  onChoose={() => choose(option)}
                />
              ))}
            </div>
            <AnimatePresence>
              {picked !== null && picked !== question.word.id && (
                // ナビの上に固定して、スクロールせずに押せるようにする
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="sticky bottom-[calc(4.75rem+env(safe-area-inset-bottom))] z-10"
                >
                  <Pressable
                    onClick={next}
                    rippleClassName="bg-white/40"
                    className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-brand-600 text-sm font-bold text-white shadow-card"
                  >
                    次へ
                    <ArrowRight size={16} />
                  </Pressable>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </AnimatePresence>
      </div>
    </>
  );
}

function Prompt({
  question,
  showPinyin,
  answered,
}: {
  question: QuizQuestion;
  showPinyin: boolean;
  answered: boolean;
}) {
  const { word, kind } = question;
  return (
    <div className="relative flex min-h-32 flex-col items-center justify-center gap-1 rounded-3xl border border-brand-100 bg-white px-5 py-5 text-center shadow-card">
      <p className="text-[11px] font-bold text-muted">
        {kind === "meaning" ? "意味はどれ？" : "中国語はどれ？"}
      </p>
      {kind === "meaning" ? (
        <>
          {(showPinyin || answered) && (
            <p className="text-lg font-semibold text-brand-600">{word.pinyin}</p>
          )}
          <p lang="zh-CN" className="text-5xl font-bold leading-tight text-ink">
            {word.hanzi}
          </p>
        </>
      ) : (
        <p className="text-2xl font-bold leading-snug text-ink">{word.meaning}</p>
      )}
      <motion.button
        type="button"
        aria-label="発音を聞く"
        whileTap={{ scale: 0.85 }}
        onClick={() => speakChinese(word.hanzi)}
        className={`absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-brand-50 text-brand-600 ${
          kind === "hanzi" && !answered ? "invisible" : ""
        }`}
      >
        <Volume2 size={16} />
      </motion.button>
    </div>
  );
}

type OptionState = "idle" | "correct" | "wrong" | "answer" | "dim";

const OPTION_STYLE: Record<OptionState, string> = {
  idle: "border-line bg-white text-ink",
  correct: "border-emerald-500 bg-emerald-500 text-white",
  wrong: "border-brand-600 bg-brand-600 text-white",
  answer: "border-emerald-500 bg-emerald-50 text-emerald-800",
  dim: "border-line bg-white text-ink opacity-45",
};

function OptionButton({
  option,
  kind,
  showPinyin,
  state,
  onChoose,
}: {
  option: Word;
  kind: QuizQuestion["kind"];
  showPinyin: boolean;
  state: OptionState;
  onChoose: () => void;
}) {
  const answered = state !== "idle";
  return (
    <motion.div
      className="relative"
      animate={
        state === "wrong"
          ? { x: [0, -10, 10, -6, 6, 0] }
          : state === "correct"
            ? { scale: [1, 1.04, 1] }
            : { x: 0, scale: 1 }
      }
      transition={{ duration: 0.4 }}
    >
      <Pressable
        onClick={onChoose}
        disabled={answered}
        className={`flex min-h-14 w-full items-center gap-3 rounded-2xl border-2 px-4 py-3 text-left shadow-card transition-colors ${OPTION_STYLE[state]}`}
      >
        <span className="flex-1">
          {kind === "meaning" ? (
            <span className="text-[15px] font-bold leading-snug">{option.meaning}</span>
          ) : (
            <span className="flex items-baseline gap-2">
              <span lang="zh-CN" className="text-2xl font-bold">
                {option.hanzi}
              </span>
              {(answered || showPinyin) && answered && (
                <span className="text-xs font-semibold opacity-80">{option.pinyin}</span>
              )}
            </span>
          )}
        </span>
        {(state === "correct" || state === "answer") && <Check size={20} strokeWidth={3} />}
        {state === "wrong" && <X size={20} strokeWidth={3} />}
      </Pressable>
      {state === "correct" && <Burst radius={110} />}
    </motion.div>
  );
}

function QuizResult({
  deck,
  total,
  mistakes,
  onRestart,
}: {
  deck: DeckMeta;
  total: number;
  mistakes: Word[];
  onRestart: () => void;
}) {
  const score = total - mistakes.length;
  const ratio = total === 0 ? 0 : score / total;
  const message =
    ratio === 1 ? "全問正解！完璧です" : ratio >= 0.7 ? "よくできました！" : "間違えた単語を復習しよう";
  const circumference = 2 * Math.PI * 44;

  return (
    <div className="flex flex-1 flex-col items-center gap-5 px-5 py-8">
      <div className="relative h-32 w-32">
        <svg viewBox="0 0 100 100" className="h-full w-full -rotate-90">
          <circle cx="50" cy="50" r="44" fill="none" strokeWidth="9" className="stroke-brand-50" />
          <motion.circle
            cx="50"
            cy="50"
            r="44"
            fill="none"
            strokeWidth="9"
            strokeLinecap="round"
            className={ratio >= 0.7 ? "stroke-emerald-500" : "stroke-brand-600"}
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: circumference * (1 - ratio) }}
            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          {ratio === 1 && <Trophy size={18} className="text-gold-500" />}
          <span className="text-3xl font-extrabold text-ink">
            {score}
            <span className="text-base text-muted">/{total}</span>
          </span>
        </div>
        {ratio >= 0.7 && <Burst radius={100} />}
      </div>
      <h2 className="text-xl font-extrabold text-ink">{message}</h2>

      {mistakes.length > 0 && (
        <div className="w-full rounded-2xl border border-line bg-white p-3 shadow-card">
          <p className="mb-2 px-1 text-xs font-bold text-muted">間違えた単語（復習に追加されました）</p>
          <ul className="divide-y divide-line">
            {mistakes.map((w, i) => (
              <motion.li
                key={`${w.id}-${i}`}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + i * 0.05 }}
                className="flex items-center gap-3 px-1 py-2"
              >
                <span lang="zh-CN" className="text-xl font-bold text-ink">
                  {w.hanzi}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-xs font-semibold text-brand-600">{w.pinyin}</span>
                  <span className="block truncate text-xs text-muted">{w.meaning}</span>
                </span>
              </motion.li>
            ))}
          </ul>
        </div>
      )}

      <div className="flex w-full flex-col gap-2">
        <Pressable
          onClick={onRestart}
          rippleClassName="bg-white/40"
          className="flex h-12 items-center justify-center gap-2 rounded-xl bg-brand-600 text-sm font-bold text-white shadow-card"
        >
          <RotateCcw size={16} />
          もう一度テスト
        </Pressable>
        <LinkButton href={`/vocab/${deck.id}/review`} variant="secondary">
          <Repeat size={16} />
          スワイプ復習へ
        </LinkButton>
        <LinkButton href="/vocab" variant="secondary">
          単語練習トップへ
        </LinkButton>
      </div>
    </div>
  );
}
