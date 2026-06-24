import {
  buildLocalSummary,
  buildProductivityStats,
  type ProductivityStats,
} from "./analytics.service.js";
import { OPENAI_API_KEY, OPENAI_MODEL } from "../config/env.js";

async function generateOpenAiSummary(stats: ProductivityStats) {
  if (!OPENAI_API_KEY) return null;

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${OPENAI_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: OPENAI_MODEL,
      temperature: 0.4,
      max_tokens: 320,
      messages: [
        {
          role: "system",
          content:
            "You are Do2Done AI, a calm productivity coach. Summarize the user's task data in 3-4 short sentences. Mention completion rate, most productive time if present, recent trend, and one practical suggestion. Keep tone minimal and encouraging.",
        },
        {
          role: "user",
          content: JSON.stringify(stats),
        },
      ],
    }),
  });

  if (!response.ok) {
    return null;
  }

  const payload = (await response.json()) as {
    choices?: Array<{ message?: { content?: string } }>;
  };

  const summary = payload.choices?.[0]?.message?.content?.trim();
  return summary || null;
}

export const aiService = {
  buildInsights: async function (
    todos: Parameters<typeof buildProductivityStats>[0],
    periodDays = 7,
  ) {
    const stats = buildProductivityStats(todos, periodDays);
    const aiSummary = await generateOpenAiSummary(stats);
    const summary = aiSummary ?? buildLocalSummary(stats);

    return {
      summary,
      aiPowered: Boolean(aiSummary),
      ...stats,
    };
  },
};
