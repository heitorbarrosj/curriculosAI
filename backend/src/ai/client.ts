import OpenAI from "openai";
import { env } from "../config/env.js";

export const openai = env.OPENAI_API_KEY
  ? new OpenAI({ apiKey: env.OPENAI_API_KEY })
  : null;

export function requireOpenAI() {
  if (!openai) {
    throw new Error("OPENAI_API_KEY nao configurada");
  }
  return openai;
}
