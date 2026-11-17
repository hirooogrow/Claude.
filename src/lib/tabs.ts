import { BookOpen, GraduationCap, Map, type LucideIcon } from "lucide-react";

export type TabItem = {
  href: "/vocab" | "/hsk" | "/map";
  label: string;
  icon: LucideIcon;
};

/** 下部ナビゲーションのタブ定義（並び順＝表示順。先頭がホーム） */
export const TABS: readonly TabItem[] = [
  { href: "/vocab", label: "単語練習", icon: BookOpen },
  { href: "/hsk", label: "HSK問題", icon: GraduationCap },
  { href: "/map", label: "マップ雑学", icon: Map },
] as const;
