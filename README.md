# 好朋友 中国語 — 中国語学習Webアプリ

HSK対策と実践的な中国語学習のためのモバイルファーストWebアプリ。

## 技術スタック

- Next.js (App Router) / React / TypeScript
- Tailwind CSS v4（白 × 赤のテーマトークンは `src/app/globals.css`）
- Framer Motion（ページ遷移・タップ波紋・スプリングアニメーション）
- Lucide React（アイコン）
- Claude API（`@anthropic-ai/sdk`）— 親友AIチャット。Structured Outputs で「単語分割＋ピンイン＋和訳」を JSON で受け取る

### 環境変数

| 変数 | 説明 |
| --- | --- |
| `ANTHROPIC_API_KEY` | Claude API キー。未設定の場合チャットは**デモ応答モード**（固定の返信）で動く |
| `CHAT_MODEL` | 省略時 `claude-opus-5-5` |

## 開発

```bash
cp .env.example .env.local   # ANTHROPIC_API_KEY を設定
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
│   ├── api/chat/       # チャット API（Claude 呼び出し）
│   ├── chat/           # 親友AIチャット
│   ├── vocab/          # SRS単語帳
│   ├── hsk/            # HSK実戦ドリル
│   └── map/            # 中国マップ＆雑学
├── components/
│   ├── BottomNav.tsx   # 下部タブナビゲーション
│   ├── PageHeader.tsx
│   ├── chat/           # チャット画面・吹き出し・単語シート・記憶シート
│   └── ui/             # Ripple / Pressable / Stagger / Card / BottomSheet
└── lib/
    ├── chat/           # スキーマ(zod)・人格プロンプト・デモ応答
    ├── storage.ts      # localStorage ストア（将来 Supabase に差し替え）
    ├── stores.ts       # 会話・記憶・My単語・設定
    └── tabs.ts         # タブ定義
```

## ロードマップ

- [x] フェーズ1: 初期セットアップ・UIの土台（下部ナビ、4画面、ページ遷移）
- [x] フェーズ2: 親友AIチャット（単語タップ和訳・記憶・単語帳登録）
- [ ] SRS単語帳（スワイプ復習・4択テスト）
- [ ] HSK実戦ドリル
- [ ] 中国マップ＆雑学（都市アンロック・カード収集）
- [ ] 日中漢字比較
- [ ] Supabase（認証・進捗の永続化）
