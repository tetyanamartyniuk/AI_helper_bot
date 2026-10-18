import { InlineKeyboard } from "grammy";
export const BUTTONS = {
  student: "student",
  technologies: "technologies",
  contacts: "contacts",
  aiHelper: "ai_helper",
  back: "back",
} as const;

export const mainKeyboard = new InlineKeyboard()
  .text("Student", BUTTONS.student)
  .row()
  .text("IT technologies", BUTTONS.technologies)
  .row()
  .text("Contacts", BUTTONS.contacts)
  .row()
  .text("AI helper", BUTTONS.aiHelper);

export const backKeyboard = new InlineKeyboard().text(
  "Back to main",
  BUTTONS.back,
);
