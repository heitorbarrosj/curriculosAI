import { prisma } from "../config/prisma.js";
import { analyzeAts } from "../ai/services.js";
import { resumeService } from "./resume.service.js";

const clampScore = (value: unknown) => Math.max(0, Math.min(100, Number(value) || 0));
const stringArray = (value: unknown) => (Array.isArray(value) ? value.map(String) : []);

export const atsService = {
  async analyze(userId: string, resumeId: string) {
    const resume = await resumeService.getOwned(resumeId, userId);
    const data = await analyzeAts(resume.cleanedText);
    return prisma.atsAnalysis.create({
      data: {
        resumeId: resume.id,
        score: clampScore(data.score),
        clarityScore: clampScore(data.clarityScore),
        impactScore: clampScore(data.impactScore),
        formattingScore: clampScore(data.formattingScore),
        keywordScore: clampScore(data.keywordScore),
        missingKeywords: stringArray(data.missingKeywords),
        strengths: stringArray(data.strengths),
        issues: stringArray(data.issues),
        suggestions: stringArray(data.suggestions),
        report: data.report ?? data
      }
    });
  }
};
