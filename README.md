# 好朋友 中国語 — 中国語学習Webアプリ

HSK対策の**単語練習を中心にした**、モバイルファーストの中国語学習Webアプリ。

## 技術スタック

- Next.js (App Router) / React / TypeScript
- Tailwind CSS v4（白 × 赤のテーマトークンは `src/app/globals.css`）
- Framer Motion（ページ遷移・タップ波紋・スプリングアニメーション）
- Lucide React（アイコン）
- フォント: Noto Sans に統一（`next/font/google` で自己ホスト）
  - 日本語 UI → Noto Sans JP
  - 中国語（`lang="zh-CN"` を付けた要素）→ Noto Sans SC（簡体字の字形）

## 開発

```bash
npm install
npm run dev     # http://localhost:3000
npm run build   # 本番ビルド（型チェック込み）
npm run lint
```

## 構成

```
src/
├── app/
│   ├── layout.tsx      # アプリシェル（スマホ幅）＋下部ナビ＋フォント
│   ├── template.tsx    # ページ遷移アニメーション（タブ順で左右方向を判定）
│   ├── page.tsx        # /vocab へリダイレクト（単語練習がホーム）
│   ├── vocab/          # 単語練習（SRS）
│   ├── hsk/            # HSK実戦ドリル
│   └── map/            # 中国マップ＆雑学
├── components/
│   ├── BottomNav.tsx   # 下部タブナビゲーション
│   ├── PageHeader.tsx
│   └── ui/             # Ripple / Pressable / Stagger / Card / BottomSheet
└── lib/
    ├── storage.ts      # localStorage ストア（将来 Supabase に差し替え）
    ├── stores.ts       # My単語リスト
    ├── speech.ts       # 中国語の読み上げ
    └── tabs.ts         # タブ定義
```

## 中国語テキストを書くとき

中国語（簡体字）を表示する要素には `lang="zh-CN"` を付けてください。
付けないと日本語フォント（日本の字形）で表示されます。

## ロードマップ

- [x] フェーズ1: 初期セットアップ・UIの土台（下部ナビ、ページ遷移）
- [ ] 単語練習（SRS スワイプ復習・4択テスト）
- [ ] HSK実戦ドリル
- [ ] 中国マップ＆雑学（都市アンロック・カード収集）
- [ ] 日中漢字比較
- [ ] Supabase（認証・進捗の永続化）
