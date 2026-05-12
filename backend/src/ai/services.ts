import { env } from "../config/env.js";
import { prompts } from "./prompts.js";
import { requireOpenAI } from "./client.js";
import { extractSkillsFromText } from "../utils/text.js";

type JsonObject = Record<string, unknown>;

async function jsonCompletion(system: string, user: string): Promise<JsonObject> {
  const client = requireOpenAI();
  const response = await client.chat.completions.create({
    model: env.OPENAI_MODEL,
    temperature: 0.2,
    response_format: { type: "json_object" },
    messages: [
      { role: "system", content: system },
      { role: "user", content: user }
    ]
  });
  const content = response.choices[0]?.message?.content ?? "{}";
  return JSON.parse(content) as JsonObject;
}

export async function createEmbedding(text: string) {
  const client = requireOpenAI();
  const response = await client.embeddings.create({
    model: env.OPENAI_EMBEDDING_MODEL,
    input: text.slice(0, 12000)
  });
  return response.data[0]?.embedding ?? [];
}

export async function extractResumeData(text: string) {
  try {
    const data = await jsonCompletion(prompts.resumeExtraction, text.slice(0, 18000));
    return {
      candidateName: String(data.candidateName ?? ""),
      summary: String(data.summary ?? ""),
      experiences: Array.isArray(data.experiences) ? data.experiences : [],
      skills: Array.isArray(data.skills) ? data.skills.map(String) : extractSkillsFromText(text),
      education: Array.isArray(data.education) ? data.education : [],
      languages: Array.isArray(data.languages) ? data.languages.map(String) : []
    };
  } catch {
    return {
      candidateName: "",
      summary: "",
      experiences: [],
      skills: extractSkillsFromText(text),
      education: [],
      languages: []
    };
  }
}

export async function analyzeAts(text: string) {
  return jsonCompletion(prompts.ats, text.slice(0, 18000));
}

export async function improveResume(text: string, jobDescription?: string) {
  const client = requireOpenAI();
  const response = await client.chat.completions.create({
    model: env.OPENAI_MODEL,
    temperature: 0.35,
    messages: [
      { role: "system", content: prompts.improve },
      { role: "user", content: `Curriculo:\n${text}\n\nVaga opcional:\n${jobDescription ?? "Nao informada"}` }
    ]
  });
  return response.choices[0]?.message?.content?.trim() ?? "";
}

export async function matchResumeToJob(resumeText: string, jobText: string, semanticScore: number) {
  const data = await jsonCompletion(
    prompts.match,
    `Score semantico por embeddings: ${semanticScore}\n\nCurriculo:\n${resumeText.slice(0, 12000)}\n\nVaga:\n${jobText.slice(0, 12000)}`
  );
  return data;
}

export async function careerChat(message: string, context: string) {
  const client = requireOpenAI();
  const response = await client.chat.completions.create({
    model: env.OPENAI_MODEL,
    temperature: 0.45,
    messages: [
      { role: "system", content: prompts.career },
      { role: "user", content: `Contexto:\n${context}\n\nPergunta:\n${message}` }
    ]
  });
  return response.choices[0]?.message?.content?.trim() ?? "";
}
