import type { ChatToken } from "./schema";

export type UserMessage = {
  id: string;
  role: "user";
  text: string;
  createdAt: number;
};

export type AssistantMessage = {
  id: string;
  role: "assistant";
  tokens: ChatToken[];
  translation: string;
  correction: string;
  /** API キー未設定時のデモ応答 */
  demo?: boolean;
  createdAt: number;
};

export type ChatMessage = UserMessage | AssistantMessage;

/** 中国語として表示するテキスト（API へ履歴として送る形） */
export function messageText(message: ChatMessage): string {
  return message.role === "user"
    ? message.text
    : message.tokens.map((t) => t.text).join("");
}

/** 和訳を持つ（タップできる）トークンか */
export function isWord(token: ChatToken): boolean {
  return token.meaning.trim() !== "" && token.pinyin.trim() !== "";
}
