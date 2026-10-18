import "dotenv/config";

import { GoogleGenAI } from "@google/genai";

const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) throw new Error("Google GenAI key wasn`t provided");

export const GEMINI_MODEL = "gemini-3.8-flash";

export const ai = new GoogleGenAI({
  apiKey,
});
