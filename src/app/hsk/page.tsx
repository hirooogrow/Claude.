import type { Metadata } from "next";
import { BookOpenCheck, ChevronRight, Headphones, PenLine } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { Card, ComingSoonBadge, SectionTitle } from "@/components/ui/Card";
import { Pressable } from "@/components/ui/Pressable";
import { Stagger, StaggerItem } from "@/components/ui/Stagger";

export const metadata: Metadata = { title: "HSK問題" };

const LEVELS = [
  { level: 1, words: 150, note: "入門" },
  { level: 2, words: 300, note: "初級" },
  { level: 3, words: 600, note: "初中級" },
  { level: 4, words: 1200, note: "中級" },
  { level: 5, words: 2500, note: "中上級" },
  { level: 6, words: 5000, note: "上級" },
];

const SECTIONS = [
  { label: "听力", ja: "リスニング", icon: Headphones },
  { label: "阅读", ja: "読解", icon: BookOpenCheck },
  { label: "书写", ja: "作文", icon: PenLine },
];

export default function HskPage() {
  return (
    <>
      <PageHeader
        title="HSK実戦ドリル"
        zh="汉语水平考试"
        pinyin="Hànyǔ Shuǐpíng Kǎoshì"
      />

      <Stagger className="flex flex-col gap-5 px-4 py-5">
        <StaggerItem>
          <Card className="overflow-hidden">
            <div className="bg-gradient-to-br from-brand-600 to-brand-800 p-4 text-white">
              <p className="text-xs font-semibold opacity-80">今日の目標</p>
              <p className="mt-1 text-lg font-extrabold">本番形式で10問チャレンジ</p>
              <div className="mt-3 h-2 overflow-hidden rounded-full bg-white/25">
                <div className="h-full w-0 rounded-full bg-gold-400" />
              </div>
              <p className="mt-1.5 text-right text-[11px] opacity-80">0 / 10</p>
            </div>
          </Card>
        </StaggerItem>

        <StaggerItem>
          <SectionTitle aside={<ComingSoonBadge />}>レベルを選ぶ</SectionTitle>
          <div className="grid grid-cols-3 gap-2.5">
            {LEVELS.map(({ level, words, note }) => (
              <Pressable
                key={level}
                className="flex flex-col items-center gap-0.5 rounded-2xl border border-line bg-white py-3.5 shadow-card"
              >
                <span className="text-[10px] font-bold text-brand-500">HSK</span>
                <span className="text-2xl font-extrabold leading-none text-ink">
                  {level}
                </span>
                <span className="text-[10px] text-muted">
                  {note}・{words}語
                </span>
              </Pressable>
            ))}
          </div>
        </StaggerItem>

        <StaggerItem>
          <SectionTitle>出題形式</SectionTitle>
          <Card className="divide-y divide-line">
            {SECTIONS.map(({ label, ja, icon: Icon }) => (
              <div key={label} className="flex items-center gap-3 px-4 py-3.5">
                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-50 text-brand-600">
                  <Icon size={18} />
                </span>
                <div className="flex-1">
                  <p lang="zh-CN" className="text-sm font-bold text-ink">
                    {label}
                  </p>
                  <p className="text-[11px] text-muted">{ja}・解説つき</p>
                </div>
                <ChevronRight size={18} className="text-muted/60" />
              </div>
            ))}
          </Card>
        </StaggerItem>
      </Stagger>
    </>
  );
}
