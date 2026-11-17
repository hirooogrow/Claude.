"use client";

import { createLocalStore } from "./storage";

export type SavedWord = {
  hanzi: string;
  pinyin: string;
  meaning: string;
  addedAt: number;
};

const EMPTY_WORDS: SavedWord[] = [];

/** My単語リスト（SRS 単語練習で使用） */
export const vocabStore = createLocalStore<SavedWord[]>("hp.vocab.v1", EMPTY_WORDS);
