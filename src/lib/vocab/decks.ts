import hsk3 from "@/data/hsk/hsk3.json";
import hsk4 from "@/data/hsk/hsk4.json";
import hsk5 from "@/data/hsk/hsk5.json";
import type { DeckId, DeckMeta, Word } from "./types";

type RawWord = { no: number; hanzi: string; pinyin: string; meaning: string; pos?: string };

const RAW: Record<DeckId, RawWord[]> = { hsk3, hsk4, hsk5 };

export const DECK_IDS: readonly DeckId[] = ["hsk3", "hsk4", "hsk5"];

const TITLES: Record<DeckId, string> = {
  hsk3: "HSK 3級",
  hsk4: "HSK 4級",
  hsk5: "HSK 5級",
};

export function isDeckId(value: string): value is DeckId {
  return (DECK_IDS as readonly string[]).includes(value);
}

export function getDeckMeta(id: DeckId): DeckMeta {
  const words = RAW[id];
  const firstNo = words[0].no;
  const lastNo = words[words.length - 1].no;
  return {
    id,
    title: TITLES[id],
    subtitle: `HSK 3.0・${firstNo}〜${lastNo}語`,
    total: words.length,
    firstNo,
    lastNo,
  };
}

export function getAllDeckMeta(): DeckMeta[] {
  return DECK_IDS.map(getDeckMeta);
}

export function getDeckWords(id: DeckId): Word[] {
  return RAW[id].map((w) => ({ ...w, id: `${id}-${w.no}` }));
}
