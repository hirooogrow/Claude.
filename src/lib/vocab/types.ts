export type DeckId = "hsk3" | "hsk4" | "hsk5";

export type Word = {
  /** デッキ内で一意（例: hsk5-2001） */
  id: string;
  no: number;
  hanzi: string;
  pinyin: string;
  meaning: string;
  /** 品詞（例: 名詞・動詞） */
  pos?: string;
};

export type DeckMeta = {
  id: DeckId;
  title: string;
  /** 例: HSK 3.0・2001〜3600語 */
  subtitle: string;
  total: number;
  /** HSK 3.0 シラバスでの通し番号の範囲 */
  firstNo: number;
  lastNo: number;
};
