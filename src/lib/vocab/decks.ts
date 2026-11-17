import hsk3 from "@/data/hsk/hsk3.json";
import hsk4 from "@/data/hsk/hsk4.json";
import hsk5 from "@/data/hsk/hsk5.json";
import type { DeckId, DeckMeta, Word } from "./types";

type RawWord = { no: number; hanzi: string; pinyin: string; meaning: string; pos?: string };

const RAW: Record<DeckId, RawWord[]> = { hsk3, hsk4, hsk5 };

export const DECK_IDS: readonly DeckId[] = ["hsk3", "hsk4", "hsk5"];

const META: Record<DeckId, Omit<DeckMeta, "id" | "total">> = {
  hsk3: { title: "HSK 3級", subtitle: "HSK 3.0・501〜1000語", meaningLang: "en" },
  hsk4: { title: "HSK 4級", subtitle: "HSK 2.0・600語", meaningLang: "ja" },
  hsk5: { title: "HSK 5級", subtitle: "HSK 3.0・2001〜3600語", meaningLang: "en" },
};

export function isDeckId(value: string): value is DeckId {
  return (DECK_IDS as readonly string[]).includes(value);
}

export function getDeckMeta(id: DeckId): DeckMeta {
  return { id, ...META[id], total: RAW[id].length };
}

export function getAllDeckMeta(): DeckMeta[] {
  return DECK_IDS.map(getDeckMeta);
}

export function getDeckWords(id: DeckId): Word[] {
  return RAW[id].map((w) => ({ ...w, id: `${id}-${w.no}` }));
}
