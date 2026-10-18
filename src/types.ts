import {
  type Conversation,
  type ConversationFlavor,
} from "@grammyjs/conversations";
import type { Context } from "grammy";

export type MyContext = ConversationFlavor<Context>;
export type MyConversationContext = Context;
export type MyConversation = Conversation<MyContext, MyConversationContext>;
