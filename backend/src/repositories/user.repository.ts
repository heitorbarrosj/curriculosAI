import { prisma } from "../config/prisma.js";

export const userRepository = {
  findByEmail: (email: string) => prisma.user.findUnique({ where: { email } }),
  findById: (id: string) => prisma.user.findUnique({ where: { id } }),
  create: (data: { name: string; email: string; passwordHash: string }) => prisma.user.create({ data }),
  updateRefreshToken: (id: string, refreshTokenHash: string | null) =>
    prisma.user.update({ where: { id }, data: { refreshTokenHash } }),
  updateResetToken: (id: string, resetTokenHash: string | null, resetTokenExpires: Date | null) =>
    prisma.user.update({ where: { id }, data: { resetTokenHash, resetTokenExpires } }),
  updatePassword: (id: string, passwordHash: string) =>
    prisma.user.update({ where: { id }, data: { passwordHash, resetTokenHash: null, resetTokenExpires: null } })
};
