import type { Metadata, Viewport } from "next";
import { Noto_Sans_JP, Noto_Sans_SC } from "next/font/google";
import { BottomNav } from "@/components/BottomNav";
import { Providers } from "@/components/Providers";
import "./globals.css";

/** 日本語 UI 用（漢字は日本の字形） */
const notoSansJP = Noto_Sans_JP({
  subsets: ["latin"],
  variable: "--font-noto-jp",
  display: "swap",
});

/** 中国語（簡体字）用。lang="zh-CN" の要素で使う */
const notoSansSC = Noto_Sans_SC({
  subsets: ["latin"],
  variable: "--font-noto-sc",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "好朋友 中国語",
    template: "%s | 好朋友 中国語",
  },
  description:
    "HSK対策の単語練習を中心にした、モバイルファーストの中国語学習アプリ",
  appleWebApp: {
    capable: true,
    title: "好朋友 中国語",
    statusBarStyle: "default",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#ffffff",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="ja"
      className={`${notoSansJP.variable} ${notoSansSC.variable} h-full antialiased`}
    >
      <body className="min-h-dvh">
        <Providers>
          {/* スマホ幅のアプリシェル（PC では中央寄せ） */}
          <div className="relative mx-auto flex min-h-dvh max-w-md flex-col overflow-x-clip bg-canvas md:shadow-[0_0_60px_-20px_rgb(124_25_34/0.25)]">
            <main className="flex flex-1 flex-col pb-[calc(4rem+env(safe-area-inset-bottom))]">
              {children}
            </main>
            <BottomNav />
          </div>
        </Providers>
      </body>
    </html>
  );
}
