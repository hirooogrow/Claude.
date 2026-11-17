import { z } from "zod";

/** 中国語の返信を構成する1単語（句読点も1トークン） */
export const ChatTokenSchema = z.object({
  /** 単語そのもの（簡体字） */
  text: z.string(),
  /** 声調記号付きピンイン。句読点・記号は空文字 */
  pinyin: z.string(),
  /** 文脈に合った簡潔な和訳。句読点・記号は空文字 */
  meaning: z.string(),
});

/** AI（小红）の返信フォーマット（Structured Outputs で強制） */
export const AiReplySchema = z.object({
  tokens: z.array(ChatTokenSchema),
  /** 返信全体の自然な和訳 */
  translation: z.string(),
  /** ユーザーの中国語の添削（不要なら空文字） */
  correction: z.string(),
  /** 今回新たに分かったユーザーについての事実（日本語・短文） */
  new_memories: z.array(z.string()),
});

/** /api/chat へのリクエスト */
export const ChatRequestSchema = z.object({
  messages: z
    .array(
      z.object({
        role: z.enum(["user", "assistant"]),
        content: z.string().min(1).max(1000),
      }),
    )
    .min(1)
    .max(40),
  memories: z.array(z.string().max(200)).max(50),
});

export type ChatToken = z.infer<typeof ChatTokenSchema>;
export type AiReply = z.infer<typeof AiReplySchema>;
export type ChatRequest = z.infer<typeof ChatRequestSchema>;

/** /api/chat のレスポンス */
export type ChatResponse =
  | { ok: true; reply: AiReply; demo: boolean }
  | { ok: false; error: string };
