import { prisma } from "../config/prisma.js";
import { careerChat } from "../ai/services.js";
import { resumeService } from "./resume.service.js";

export const chatService = {
  async ask(userId: string, message: string, chatId?: string, resumeId?: string, jobId?: string) {
    const chat = chatId
      ? await prisma.chat.findFirstOrThrow({ where: { id: chatId, userId } })
      : await prisma.chat.create({ data: { userId, title: message.slice(0, 60) } });

    const [resume, job] = await Promise.all([
      resumeId ? resumeService.getOwned(resumeId, userId) : Promise.resolve(null),
      jobId ? prisma.jobDescription.findFirst({ where: { id: jobId, userId } }) : Promise.resolve(null)
    ]);

    const previous = await prisma.message.findMany({ where: { chatId: chat.id }, orderBy: { createdAt: "desc" }, take: 8 });
    const context = [
      resume ? `Curriculo atual:\n${resume.optimizedText ?? resume.cleanedText}` : "",
      job ? `Vaga:\n${job.description}` : "",
      previous.reverse().map((item) => `${item.role}: ${item.content}`).join("\n")
    ].filter(Boolean).join("\n\n");

    await prisma.message.create({ data: { chatId: chat.id, role: "user", content: message } });
    const answer = await careerChat(message, context);
    const assistant = await prisma.message.create({ data: { chatId: chat.id, role: "assistant", content: answer } });
    return { chatId: chat.id, message: assistant };
  },

  async list(userId: string) {
    return prisma.chat.findMany({ where: { userId }, orderBy: { updatedAt: "desc" }, include: { messages: { take: 1, orderBy: { createdAt: "desc" } } } });
  }
};
