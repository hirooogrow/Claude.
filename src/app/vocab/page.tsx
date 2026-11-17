import type { Metadata } from "next";
import { Flame, Layers, ListChecks, Repeat } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { Card, ComingSoonBadge, SectionTitle } from "@/components/ui/Card";
import { Pressable } from "@/components/ui/Pressable";
import { Stagger, StaggerItem } from "@/components/ui/Stagger";
import { SavedWordCount } from "./SavedWordCount";
import { VocabPreview } from "./VocabPreview";

export const metadata: Metadata = { title: "単語練習" };

const STATS = [
  { label: "今日の復習", value: 0, icon: Repeat },
  { label: "登録単語", value: 0, icon: Layers },
  { label: "連続日数", value: 0, icon: Flame },
];

const MODES = [
  {
    title: "スワイプ復習",
    desc: "忘却曲線(SRS)に沿って出題",
    icon: Repeat,
  },
  {
    title: "4択テスト",
    desc: "意味・ピンインを4択で確認",
    icon: ListChecks,
  },
];

export default function VocabPage() {
  return (
    <>
      <PageHeader title="単語練習" zh="生词本" pinyin="shēngcí běn" />

      <Stagger className="flex flex-col gap-5 px-4 py-5">
        <StaggerItem className="grid grid-cols-3 gap-2">
          {STATS.map(({ label, value, icon: Icon }) => (
            <Card key={label} className="flex flex-col items-center gap-1 py-3">
              <Icon size={18} className="text-brand-500" />
              {label === "登録単語" ? (
                <SavedWordCount />
              ) : (
                <span className="text-xl font-extrabold text-ink">{value}</span>
              )}
              <span className="text-[10px] font-semibold text-muted">{label}</span>
            </Card>
          ))}
        </StaggerItem>

        <StaggerItem>
          <VocabPreview />
        </StaggerItem>

        <StaggerItem>
          <SectionTitle aside={<ComingSoonBadge />}>学習モード</SectionTitle>
          <div className="grid grid-cols-2 gap-3">
            {MODES.map(({ title, desc, icon: Icon }) => (
              <Pressable
                key={title}
                className="flex flex-col items-start gap-2 rounded-2xl border border-line bg-white p-4 text-left shadow-card"
              >
                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-50 text-brand-600">
                  <Icon size={18} />
                </span>
                <span className="text-sm font-bold text-ink">{title}</span>
                <span className="text-[11px] leading-snug text-muted">{desc}</span>
              </Pressable>
            ))}
          </div>
        </StaggerItem>
      </Stagger>
    </>
  );
}
