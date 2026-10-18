import "dotenv/config";

import { Bot, Context } from "grammy";
import { conversations, createConversation } from "@grammyjs/conversations";
import { backKeyboard, BUTTONS, mainKeyboard } from "./keyboards.js";
import { askGemini } from "./askGemini.js";
import type { MyContext } from "./types.js";

const token = process.env.BOT_API_TOKEN;
if (!token) {
  throw new Error("BOT_API_TOKEN wasn't provided");
}

export async function showMainMenu(ctx: Context) {
  await ctx.answerCallbackQuery();
  await ctx.editMessageText("Please choose the command", {
    reply_markup: mainKeyboard,
  });
}

const bot = new Bot<MyContext>(token);

bot.use(conversations());
bot.use(createConversation(askGemini));

bot.command("start", async (ctx) => {
  await ctx.reply("Hey! Please choose the command to start with.", {
    reply_markup: mainKeyboard,
  });
});

const infoPages: Record<string, string> = {
  [BUTTONS.student]: "Tetiana Martyniuk IA-34",
  [BUTTONS.technologies]: "Back-end, Front-end, PostgreSQL",
  [BUTTONS.contacts]: "martyniuk.tetiana_ia34@edu.kpi.ua",
};

bot.callbackQuery(Object.keys(infoPages), async (ctx) => {
  await ctx.answerCallbackQuery();
  await ctx.editMessageText(infoPages[ctx.callbackQuery.data]!, {
    reply_markup: backKeyboard,
  });
});

bot.callbackQuery(BUTTONS.back, showMainMenu);

bot.callbackQuery(BUTTONS.aiHelper, async (ctx) => {
  await ctx.answerCallbackQuery();
  await ctx.editMessageText("Please type your prompt below:", {
    reply_markup: backKeyboard,
  });
  await ctx.conversation.enter("askGemini");
});

bot.catch((error) => {
  console.error("Error inside handler:", error);
});

bot.start().catch((error) => {
  console.error("Failed to start the bot:", error);
});
