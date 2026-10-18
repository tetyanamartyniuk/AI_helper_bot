import { ai, GEMINI_MODEL } from "./AI_integration.js";
import { showMainMenu } from "./index.js";
import { BUTTONS } from "./keyboards.js";
import type { MyConversation, MyConversationContext } from "./types.js";
import { prepareTelegramMessage } from "./utils/mdParser.js";

export async function askGemini(
  conversation: MyConversation,
  _ctx: MyConversationContext,
) {
  const answer = await conversation.wait();

  if (answer.callbackQuery?.data === BUTTONS.back) {
    await showMainMenu(answer);
    return;
  }

  const prompt = answer.message?.text;
  if (!prompt) {
    await answer.reply("Please send a text message.");
    return;
  }

  await answer.replyWithChatAction("typing");

  const text = await conversation.external(async () => {
    try {
      const response = await ai.models.generateContent({
        model: GEMINI_MODEL,
        contents: `
    Answer clearly using Markdown formatting.
    Use headings, bullet lists, bold text, and code blocks when appropriate.
    Keep the response readable in Telegram.

    User's question:
    ${prompt}
  `,
      });
      return response.text ?? "";
    } catch (error) {
      console.error("Gemini API error:", error);
      return null;
    }
  });

  if (text === null) {
    await answer.reply("Sorry, the AI is unavailable right now.");
    return;
  }
  if (!text) {
    await answer.reply("The AI returned an empty response.");
    return;
  }

  await prepareTelegramMessage(answer, text);
}
