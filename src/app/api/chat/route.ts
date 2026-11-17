import Anthropic from "@anthropic-ai/sdk";
import { betaZodOutputFormat } from "@anthropic-ai/sdk/helpers/beta/zod";
import { buildMemoryPrompt, PERSONA_PROMPT } from "@/lib/chat/prompt";
import { demoReply } from "@/lib/chat/demo";
import {
  AiReplySchema,
  ChatRequestSchema,
  type ChatResponse,
} from "@/lib/chat/schema";

const MODEL = process.env.CHAT_MODEL || "claude-opus-5-5";

function json(body: ChatResponse, status = 200) {
  return Response.json(body, { status });
}

function hasCredentials() {
  return Boolean(process.env.ANTHROPIC_API_KEY || process.env.ANTHROPIC_AUTH_TOKEN);
}

let client: Anthropic | undefined;
function getClient() {
  client ??= new Anthropic();
  return client;
}

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return json({ ok: false, error: "リクエストの形式が正しくありません" }, 400);
  }

  const parsed = ChatRequestSchema.safeParse(body);
  if (!parsed.success) {
    return json({ ok: false, error: "リクエストの形式が正しくありません" }, 400);
  }
  const { messages, memories } = parsed.data;

  if (messages.at(-1)?.role !== "user") {
    return json({ ok: false, error: "最後のメッセージはユーザーの発言である必要があります" }, 400);
  }

  // API キー未設定ならデモ応答で UI を確認できるようにする
  if (!hasCredentials()) {
    const turn = messages.filter((m) => m.role === "assistant").length;
    return json({ ok: true, reply: demoReply(turn), demo: true });
  }

  // 先頭は user である必要があるので、assistant から始まる履歴は切り落とす
  const firstUser = messages.findIndex((m) => m.role === "user");
  const history = messages.slice(firstUser);

  try {
    const response = await getClient().beta.messages.parse({
      model: MODEL,
      max_tokens: 4000,
      betas: ["server-side-fallback-2026-07-01"],
      fallbacks: "default",
      output_config: {
        effort: "low",
        format: betaZodOutputFormat(AiReplySchema),
      },
      system: [
        { type: "text", text: PERSONA_PROMPT, cache_control: { type: "ephemeral" } },
        { type: "text", text: buildMemoryPrompt(memories) },
      ],
      messages: history,
    });

    if (response.stop_reason === "refusal") {
      return json({ ok: false, error: "ごめんね、その話題には答えられないみたい。別の話をしよう！" }, 422);
    }
    if (response.stop_reason === "max_tokens" || !response.parsed_output) {
      return json({ ok: false, error: "返信の生成に失敗しました。もう一度送ってみてください" }, 502);
    }

    return json({ ok: true, reply: response.parsed_output, demo: false });
  } catch (error) {
    if (error instanceof Anthropic.AuthenticationError) {
      console.error("[chat] invalid API key");
      return json({ ok: false, error: "API キーが無効です。設定を確認してください" }, 500);
    }
    if (error instanceof Anthropic.RateLimitError) {
      return json({ ok: false, error: "混み合っています。少し待ってから送ってください" }, 429);
    }
    if (error instanceof Anthropic.APIError) {
      console.error(`[chat] API error ${error.status}:`, error.message);
      return json({ ok: false, error: "AI との通信でエラーが発生しました" }, 502);
    }
    console.error("[chat] unexpected error:", error);
    return json({ ok: false, error: "予期しないエラーが発生しました" }, 500);
  }
}
