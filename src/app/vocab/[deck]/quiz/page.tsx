import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { QuizSession } from "@/components/vocab/QuizSession";
import { DECK_IDS, getDeckMeta, getDeckWords, isDeckId } from "@/lib/vocab/decks";

export function generateStaticParams() {
  return DECK_IDS.map((deck) => ({ deck }));
}

export async function generateMetadata({ params }: PageProps<"/vocab/[deck]/quiz">): Promise<Metadata> {
  const { deck } = await params;
  return { title: isDeckId(deck) ? `${getDeckMeta(deck).title} 4択テスト` : "4択テスト" };
}

export default async function QuizPage({ params }: PageProps<"/vocab/[deck]/quiz">) {
  const { deck } = await params;
  if (!isDeckId(deck)) notFound();
  return <QuizSession deck={getDeckMeta(deck)} words={getDeckWords(deck)} />;
}
