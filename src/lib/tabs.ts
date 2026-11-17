import {
  BookOpen,
  GraduationCap,
  Map,
  MessageCircleHeart,
  type LucideIcon,
} from "lucide-react";

export type TabItem = {
  href: "/chat" | "/vocab" | "/hsk" | "/map";
  label: string;
  icon: LucideIcon;
};

/** 下部ナビゲーションのタブ定義（並び順＝表示順） */
export const TABS: readonly TabItem[] = [
  { href: "/chat", label: "チャット", icon: MessageCircleHeart },
  { href: "/vocab", label: "単語帳", icon: BookOpen },
  { href: "/hsk", label: "HSK問題", icon: GraduationCap },
  { href: "/map", label: "マップ雑学", icon: Map },
] as const;
