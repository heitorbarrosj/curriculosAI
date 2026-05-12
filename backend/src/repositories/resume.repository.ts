import { prisma } from "../config/prisma.js";

export const resumeRepository = {
  listByUser: (userId: string, page = 1, pageSize = 10) =>
    prisma.resume.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * pageSize,
      take: pageSize,
      include: { atsAnalyses: { orderBy: { createdAt: "desc" }, take: 1 } }
    }),
  countByUser: (userId: string) => prisma.resume.count({ where: { userId } }),
  findOwned: (id: string, userId: string) => prisma.resume.findFirst({ where: { id, userId } }),
  create: (data: Parameters<typeof prisma.resume.create>[0]["data"]) => prisma.resume.create({ data }),
  updateOptimized: (id: string, optimizedText: string) => prisma.resume.update({ where: { id }, data: { optimizedText } })
};
