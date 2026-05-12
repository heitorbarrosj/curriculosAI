import { improveResume } from "../ai/services.js";
import { resumeRepository } from "../repositories/resume.repository.js";
import { resumeService } from "./resume.service.js";

export const improvementService = {
  async improve(userId: string, resumeId: string, jobDescription?: string) {
    const resume = await resumeService.getOwned(resumeId, userId);
    const optimizedText = await improveResume(resume.cleanedText, jobDescription);
    return resumeRepository.updateOptimized(resume.id, optimizedText);
  }
};
