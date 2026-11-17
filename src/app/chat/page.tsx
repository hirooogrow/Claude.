import type { Metadata } from "next";
import { Send, Sparkles } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { ComingSoonBadge } from "@/components/ui/Card";
import { Pressable } from "@/components/ui/Pressable";
import { Stagger, StaggerItem } from "@/components/ui/Stagger";

export const metadata: Metadata = { title: "チャット" };

const SAMPLE_WORDS = ["你好", "！", "今天", "过", "得", "怎么样", "？"];

export default function ChatPage() {
  return (
    <>
      <PageHeader
        title="親友AIチャット"
        zh="好朋友"
        pinyin="hǎo péngyou"
        right={<ComingSoonBadge />}
      />

      <Stagger className="flex flex-1 flex-col gap-4 px-4 py-5">
        {/* AI フレンドのプロフィール */}
        <StaggerItem className="flex flex-col items-center gap-2 py-2 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-brand-500 to-brand-700 text-2xl font-bold text-white shadow-card">
            红
          </div>
          <div>
            <p className="font-bold text-ink">小红 (Xiǎo Hóng)</p>
            <p className="text-xs text-muted">あなたのことを覚えている中国の親友</p>
          </div>
        </StaggerItem>

        {/* AI の吹き出し（単語ごとに区切って表示するイメージ） */}
        <StaggerItem className="flex items-end gap-2">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand-600 text-sm font-bold text-white">
            红
          </div>
          <div className="max-w-[78%] rounded-2xl rounded-bl-md border border-line bg-white px-3.5 py-2.5 shadow-card">
            <p className="flex flex-wrap gap-x-0.5 text-[17px] leading-relaxed">
              {SAMPLE_WORDS.map((word, i) => (
                <span
                  key={i}
                  className="rounded px-0.5 underline decoration-brand-200 decoration-dotted underline-offset-4"
                >
                  {word}
                </span>
              ))}
            </p>
            <p className="mt-1 text-[11px] text-muted">
              単語をタップすると和訳が表示されます
            </p>
          </div>
        </StaggerItem>

        {/* ユーザーの吹き出し */}
        <StaggerItem className="flex justify-end">
          <div className="max-w-[78%] rounded-2xl rounded-br-md bg-brand-600 px-3.5 py-2.5 text-[15px] text-white shadow-card">
            我很好，谢谢！
          </div>
        </StaggerItem>

        <StaggerItem className="mt-auto flex items-center justify-center gap-1.5 text-xs text-muted">
          <Sparkles size={14} className="text-brand-500" />
          AIとの会話はフェーズ2で実装予定
        </StaggerItem>
      </Stagger>

      {/* 入力欄（ナビの上に固定） */}
      <div className="sticky bottom-[calc(4rem+env(safe-area-inset-bottom))] z-20 border-t border-line bg-white/90 px-3 py-2.5 backdrop-blur-md">
        <div className="flex items-center gap-2">
          <input
            type="text"
            disabled
            placeholder="中国語でメッセージ…（準備中）"
            className="h-11 min-w-0 flex-1 rounded-full border border-line bg-canvas px-4 text-[15px] placeholder:text-muted/70 focus:border-brand-400 focus:outline-none disabled:opacity-70"
          />
          <Pressable
            aria-label="送信"
            disabled
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-brand-600 text-white shadow-card disabled:opacity-60"
            rippleClassName="bg-white/40"
          >
            <Send size={18} />
          </Pressable>
        </div>
      </div>
    </>
  );
}
