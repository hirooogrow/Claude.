import type { AiReply } from "./schema";

/** API キー未設定時に返すデモ応答（UI 確認用） */
const DEMO_REPLIES: AiReply[] = [
  {
    tokens: [
      { text: "哈哈", pinyin: "hāha", meaning: "ハハ（笑い声）" },
      { text: "，", pinyin: "", meaning: "" },
      { text: "我", pinyin: "wǒ", meaning: "私" },
      { text: "今天", pinyin: "jīntiān", meaning: "今日" },
      { text: "也", pinyin: "yě", meaning: "〜も" },
      { text: "很", pinyin: "hěn", meaning: "とても" },
      { text: "开心", pinyin: "kāixīn", meaning: "楽しい・うれしい" },
      { text: "！", pinyin: "", meaning: "" },
      { text: "你", pinyin: "nǐ", meaning: "あなた" },
      { text: "周末", pinyin: "zhōumò", meaning: "週末" },
      { text: "想", pinyin: "xiǎng", meaning: "〜したい" },
      { text: "做", pinyin: "zuò", meaning: "する" },
      { text: "什么", pinyin: "shénme", meaning: "何" },
      { text: "？", pinyin: "", meaning: "" },
    ],
    translation: "ハハ、私も今日はとっても楽しいよ！週末は何をしたい？",
    correction: "",
    new_memories: [],
  },
  {
    tokens: [
      { text: "真的", pinyin: "zhēnde", meaning: "本当に" },
      { text: "吗", pinyin: "ma", meaning: "〜か（疑問）" },
      { text: "？", pinyin: "", meaning: "" },
      { text: "我", pinyin: "wǒ", meaning: "私" },
      { text: "最", pinyin: "zuì", meaning: "最も" },
      { text: "喜欢", pinyin: "xǐhuan", meaning: "好き" },
      { text: "吃", pinyin: "chī", meaning: "食べる" },
      { text: "小笼包", pinyin: "xiǎolóngbāo", meaning: "小籠包" },
      { text: "了", pinyin: "le", meaning: "（強調）" },
      { text: "😋", pinyin: "", meaning: "" },
      { text: "你", pinyin: "nǐ", meaning: "あなた" },
      { text: "呢", pinyin: "ne", meaning: "〜は？" },
      { text: "？", pinyin: "", meaning: "" },
    ],
    translation: "本当？私は小籠包が一番好きなんだ😋 あなたは？",
    correction: "",
    new_memories: [],
  },
];

export function demoReply(turn: number): AiReply {
  return DEMO_REPLIES[turn % DEMO_REPLIES.length];
}
