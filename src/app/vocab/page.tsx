import type { Metadata } from "next";
import { PageHeader } from "@/components/PageHeader";
import { DeckList } from "@/components/vocab/DeckList";
import { getAllDeckMeta } from "@/lib/vocab/decks";

export const metadata: Metadata = { title: "単語練習" };

export default function VocabPage() {
  return (
    <>
      <PageHeader title="単語練習" zh="背单词" pinyin="bèi dāncí" />
      <DeckList decks={getAllDeckMeta()} />
    </>
  );
}
