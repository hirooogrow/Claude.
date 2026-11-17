import { isDue, type CardState } from "./srs";
import type { Word } from "./types";

/** 1回の復習で出す新出単語の数 */
export const NEW_PER_SESSION = 10;
/** 1回の復習で出す復習単語の上限 */
export const REVIEWS_PER_SESSION = 50;
export const QUIZ_LENGTH = 10;

function shuffle<T>(items: T[]): T[] {
  const a = [...items];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/** 期限が来た単語（古い順）→ 新出単語（リスト順）の順で並べる */
export function buildReviewQueue(words: Word[], states: Record<string, CardState>): Word[] {
  const now = Date.now();
  const due = words
    .filter((w) => isDue(states[w.id], now))
    .sort((a, b) => states[a.id].due - states[b.id].due)
    .slice(0, REVIEWS_PER_SESSION);
  const fresh = words.filter((w) => !states[w.id]).slice(0, NEW_PER_SESSION);
  return [...due, ...fresh];
}

export type QuizQuestion = {
  word: Word;
  /** meaning: 中国語を見て意味を選ぶ / hanzi: 意味を見て中国語を選ぶ */
  kind: "meaning" | "hanzi";
  options: Word[];
};

/** 学習済みの単語を優先して4択問題を作る（足りなければ新出単語から補う） */
export function buildQuiz(words: Word[], states: Record<string, CardState>): QuizQuestion[] {
  const studied = shuffle(words.filter((w) => states[w.id]));
  const fresh = shuffle(words.filter((w) => !states[w.id]).slice(0, 30));
  const picked = [...studied, ...fresh].slice(0, QUIZ_LENGTH);

  return picked.map((word) => {
    const distractors = shuffle(
      words.filter((w) => w.id !== word.id && w.hanzi !== word.hanzi && w.meaning !== word.meaning),
    ).slice(0, 3);
    return {
      word,
      kind: states[word.id] && Math.random() < 0.35 ? "hanzi" : "meaning",
      options: shuffle([word, ...distractors]),
    };
  });
}
