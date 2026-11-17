import type { Metadata, Viewport } from "next";
import { BottomNav } from "@/components/BottomNav";
import { Providers } from "@/components/Providers";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "好朋友 中国語",
    template: "%s | 好朋友 中国語",
  },
  description:
    "HSK対策と実践的な中国語学習のためのモバイルファースト学習アプリ",
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
    <html lang="ja" className="h-full antialiased">
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
