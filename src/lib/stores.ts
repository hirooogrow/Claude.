"use client";

import type { ChatMessage } from "./chat/types";
import { createLocalStore } from "./storage";

export type SavedWord = {
  hanzi: string;
  pinyin: string;
  meaning: string;
  /** どこで登録したか */
  source: "chat";
  addedAt: number;
};

const EMPTY_MESSAGES: ChatMessage[] = [];
const EMPTY_STRINGS: string[] = [];
const EMPTY_WORDS: SavedWord[] = [];

/** 親友AIとの会話履歴 */
export const chatStore = createLocalStore<ChatMessage[]>("hp.chat.v1", EMPTY_MESSAGES);

/** 小红が覚えているユーザーの情報 */
export const memoryStore = createLocalStore<string[]>("hp.memory.v1", EMPTY_STRINGS);

/** My単語リスト（フェーズ3の SRS 単語帳で使用） */
export const vocabStore = createLocalStore<SavedWord[]>("hp.vocab.v1", EMPTY_WORDS);

export const settingsStore = createLocalStore<{ showPinyin: boolean }>(
  "hp.settings.v1",
  { showPinyin: true },
);

export const MAX_MEMORIES = 30;
