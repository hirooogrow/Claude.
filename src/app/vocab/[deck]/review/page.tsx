import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ReviewSession } from "@/components/vocab/ReviewSession";
import { DECK_IDS, getDeckMeta, getDeckWords, isDeckId } from "@/lib/vocab/decks";

export function generateStaticParams() {
  return DECK_IDS.map((deck) => ({ deck }));
}

export async function generateMetadata({ params }: PageProps<"/vocab/[deck]/review">): Promise<Metadata> {
  const { deck } = await params;
  return { title: isDeckId(deck) ? `${getDeckMeta(deck).title} スワイプ復習` : "スワイプ復習" };
}

export default async function ReviewPage({ params }: PageProps<"/vocab/[deck]/review">) {
  const { deck } = await params;
  if (!isDeckId(deck)) notFound();
  return <ReviewSession deck={getDeckMeta(deck)} words={getDeckWords(deck)} />;
}
