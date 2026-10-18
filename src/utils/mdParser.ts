import { marked } from "marked";
import type { Context } from "vm";

export async function prepareTelegramMessage(ctx: Context, text: string) {
  const html = await marked.parse(text);

  const safeHtml = html
    // Заголовки
    .replace(/<h[1-6][^>]*>/gi, "<b>")
    .replace(/<\/h[1-6]>/gi, "</b>\n")

    // Горизонтальні лінії
    .replace(/<hr\s*\/?>/gi, "\n━━━━━━━━━━━━\n")

    // Абзаци та списки
    .replace(/<p>/gi, "")
    .replace(/<\/p>/gi, "\n")
    .replace(/<ul>/gi, "")
    .replace(/<\/ul>/gi, "")
    .replace(/<ol>/gi, "")
    .replace(/<\/ol>/gi, "")
    .replace(/<li>/gi, "• ")
    .replace(/<\/li>/gi, "\n")

    // Переноси рядків
    .replace(/<br\s*\/?>/gi, "\n")

    // Прибираємо атрибути code, які Telegram не підтримує
    .replace(/<code[^>]*>/gi, "<code>")
    .replace(/<pre[^>]*>/gi, "<pre>")

    // HTML-пробіли
    .replace(/&nbsp;/g, " ");

  // Ділимо текст на частини, не перевищуючи ліміт Telegram.
  const chunks = safeHtml.match(/[\s\S]{1,4000}/g) ?? [];

  for (const chunk of chunks) {
    await ctx.reply(chunk, {
      parse_mode: "HTML",
    });
  }
}
