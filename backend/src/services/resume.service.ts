import fs from "fs/promises";
import pdf from "pdf-parse";
import { resumeRepository } from "../repositories/resume.repository.js";
import { cleanText } from "../utils/text.js";
import { createEmbedding, extractResumeData } from "../ai/services.js";
import { HttpError } from "../utils/http.js";

export const resumeService = {
  async upload(userId: string, file: Express.Multer.File) {
    if (!file) throw new HttpError(400, "Arquivo obrigatorio");
    const buffer = await fs.readFile(file.path);
    const parsed = await pdf(buffer);
    const rawText = parsed.text ?? "";
    const cleanedText = cleanText(rawText);
    if (cleanedText.length < 120) throw new HttpError(422, "Nao foi possivel extrair texto suficiente do PDF");
    const structured = await extractResumeData(cleanedText);
    const embedding = await createEmbedding(cleanedText);
    return resumeRepository.create({
      userId,
      title: structured.candidateName ? `Curriculo de ${structured.candidateName}` : file.originalname,
      fileName: file.originalname,
      filePath: file.path,
      rawText,
      cleanedText,
      candidateName: structured.candidateName || null,
      summary: structured.summary || null,
      experiences: structured.experiences,
      skills: structured.skills,
      education: structured.education,
      languages: structured.languages,
      embedding
    });
  },

  async list(userId: string, page: number, pageSize: number) {
    const [items, total] = await Promise.all([
      resumeRepository.listByUser(userId, page, pageSize),
      resumeRepository.countByUser(userId)
    ]);
    return { items, total, page, pageSize };
  },

  async getOwned(id: string, userId: string) {
    const resume = await resumeRepository.findOwned(id, userId);
    if (!resume) throw new HttpError(404, "Curriculo nao encontrado");
    return resume;
  }
};
