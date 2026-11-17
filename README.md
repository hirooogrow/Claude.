# 好朋友 中国語 — 中国語学習Webアプリ

HSK対策と実践的な中国語学習のためのモバイルファーストWebアプリ。

## 技術スタック

- Next.js (App Router) / React / TypeScript
- Tailwind CSS v4（白 × 赤のテーマトークンは `src/app/globals.css`）
- Framer Motion（ページ遷移・タップ波紋・スプリングアニメーション）
- Lucide React（アイコン）

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
│   ├── layout.tsx      # アプリシェル（スマホ幅）＋下部ナビ
│   ├── template.tsx    # ページ遷移アニメーション（タブ順で左右方向を判定）
│   ├── page.tsx        # /chat へリダイレクト
│   ├── chat/           # 親友AIチャット
│   ├── vocab/          # SRS単語帳
│   ├── hsk/            # HSK実戦ドリル
│   └── map/            # 中国マップ＆雑学
├── components/
│   ├── BottomNav.tsx   # 下部タブナビゲーション
│   ├── PageHeader.tsx
│   └── ui/             # Ripple / Pressable / Stagger / Card
└── lib/tabs.ts         # タブ定義
```

## ロードマップ

- [x] フェーズ1: 初期セットアップ・UIの土台（下部ナビ、4画面、ページ遷移）
- [ ] 親友AIチャット（単語タップ和訳）
- [ ] SRS単語帳（スワイプ復習・4択テスト）
- [ ] HSK実戦ドリル
- [ ] 中国マップ＆雑学（都市アンロック・カード収集）
- [ ] 日中漢字比較
- [ ] Supabase（認証・進捗の永続化）
