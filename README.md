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
│   ├── vocab/          # 単語練習トップ（デッキ一覧）
│   │   └── [deck]/     # review（スワイプ復習）/ quiz（4択テスト）
│   ├── hsk/            # HSK実戦ドリル
│   └── map/            # 中国マップ＆雑学
├── components/
│   ├── BottomNav.tsx   # 下部タブナビゲーション
│   ├── PageHeader.tsx
│   ├── vocab/          # デッキ一覧・スワイプカード・4択・結果画面
│   └── ui/             # Ripple / Pressable / Stagger / Card / BottomSheet
├── data/hsk/           # 単語データ（JSON）
└── lib/
    ├── storage.ts      # localStorage ストア（将来 Supabase に差し替え）
    ├── speech.ts       # 中国語の読み上げ
    ├── vocab/          # デッキ定義・SRS（忘却曲線）・出題ロジック・進捗ストア
    └── tabs.ts         # タブ定義
scripts/
└── parse_hsk_pdf.py    # 単語リスト PDF → src/data/hsk/*.json
```

## 単語データ

| デッキ | 範囲 | 語数 | 意味 |
| --- | --- | --- | --- |
| HSK 3級 | HSK 3.0・501〜1000語 | 500 | 英語 |
| HSK 4級 | HSK 2.0・4級 | 600 | 日本語 |
| HSK 5級 | HSK 3.0・2001〜3600語 | 1600 | 英語 |

PDF から `scripts/parse_hsk_pdf.py` で生成しています（使い方はスクリプト冒頭）。
番号の連続・ピンインの文字種・意味の有無を検証し、Word 由来の PDF に含まれる
康熙部首の文字（⼤ など）は通常の漢字に変換しています。

## 単語練習のしくみ

- **スワイプ復習**：期限が来た単語 → 新出単語（1回10語）の順に出題。右スワイプ「覚えた」/ 左スワイプ「まだ」。
  - 「覚えた」で次の出題を 1日 → 3日 → 前回×2.5 と延ばす（SM-2 の簡略版）。間隔7日以上で「習得」。
  - 「まだ」は10分後に再出題。同じセッション内でも少し後にもう一度出す。
- **4択テスト**：学習済みの単語を優先して10問。「中国語→意味」と「意味→中国語」の2形式。
  間違えた単語は復習に戻る。
- 漢字・ピンインの表示は ON/OFF でき、両方 OFF だと意味から思い出す逆向きカードになる。
- 進捗は端末のブラウザ（localStorage）に保存。

## 中国語テキストを書くとき

中国語（簡体字）を表示する要素には `lang="zh-CN"` を付けてください。
付けないと日本語フォント（日本の字形）で表示されます。

## ロードマップ

- [x] フェーズ1: 初期セットアップ・UIの土台（下部ナビ、ページ遷移）
- [x] 単語練習（HSK 3〜5級データ・SRS スワイプ復習・4択テスト）
- [ ] HSK実戦ドリル
- [ ] 中国マップ＆雑学（都市アンロック・カード収集）
- [ ] 日中漢字比較
- [ ] Supabase（認証・進捗の永続化）
