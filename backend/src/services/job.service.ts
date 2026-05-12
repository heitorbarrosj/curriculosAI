import { prisma } from "../config/prisma.js";
import { createEmbedding, matchResumeToJob } from "../ai/services.js";
import { cleanText, cosineSimilarity, extractSkillsFromText, toNumberArray } from "../utils/text.js";
import { resumeService } from "./resume.service.js";
import { HttpError } from "../utils/http.js";

const clampScore = (value: unknown) => Math.max(0, Math.min(100, Math.round(Number(value) || 0)));
const stringArray = (value: unknown) => (Array.isArray(value) ? value.map(String) : []);

export const jobService = {
  async create(userId: string, title: string, company: string | undefined, description: string) {
    const cleaned = cleanText(description);
    const embedding = await createEmbedding(cleaned);
    return prisma.jobDescription.create({
      data: {
        userId,
        title,
        company,
        description: cleaned,
        skills: extractSkillsFromText(cleaned),
        embedding
      }
    });
  },

  async list(userId: string) {
    return prisma.jobDescription.findMany({ where: { userId }, orderBy: { createdAt: "desc" }, take: 50 });
  },

  async match(userId: string, jobId: string, resumeId: string) {
    const resume = await resumeService.getOwned(resumeId, userId);
    const job = await prisma.jobDescription.findFirst({ where: { id: jobId, userId } });
    if (!job) throw new HttpError(404, "Vaga nao encontrada");
    const semanticScore = Math.round(cosineSimilarity(toNumberArray(resume.embedding), toNumberArray(job.embedding)) * 100);
    const data = await matchResumeToJob(resume.cleanedText, job.description, semanticScore);
    return prisma.jobMatch.create({
      data: {
        resumeId: resume.id,
        jobId: job.id,
        matchScore: clampScore(data.matchScore ?? semanticScore),
        semanticScore: clampScore(semanticScore),
        keywordScore: clampScore(data.keywordScore),
        missingSkills: stringArray(data.missingSkills),
        matchedSkills: stringArray(data.matchedSkills),
        report: data.report ?? data
      }
    });
  }
};

