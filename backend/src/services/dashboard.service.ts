import { prisma } from "../config/prisma.js";

export const dashboardService = {
  async get(userId: string) {
    const [resumes, jobs, latestAnalysis, latestImprovements] = await Promise.all([
      prisma.resume.count({ where: { userId } }),
      prisma.jobDescription.count({ where: { userId } }),
      prisma.atsAnalysis.findFirst({
        where: { resume: { userId } },
        orderBy: { createdAt: "desc" }
      }),
      prisma.resume.findMany({
        where: { userId, optimizedText: { not: null } },
        orderBy: { updatedAt: "desc" },
        take: 5,
        select: { id: true, title: true, updatedAt: true }
      })
    ]);
    const history = await prisma.atsAnalysis.findMany({
      where: { resume: { userId } },
      orderBy: { createdAt: "desc" },
      take: 8,
      include: { resume: { select: { title: true } } }
    });
    return {
      scoreAts: latestAnalysis?.score ?? 0,
      resumes,
      jobs,
      history,
      latestImprovements
    };
  }
};
