import jwt from "jsonwebtoken";
import { env } from "../config/env.js";
import { userRepository } from "../repositories/user.repository.js";
import { compareHash, hashValue, sha256, signAccessToken, signRefreshToken, signResetToken } from "../utils/security.js";
import { HttpError } from "../utils/http.js";

function publicUser(user: { id: string; name: string; email: string; createdAt: Date }) {
  return { id: user.id, name: user.name, email: user.email, createdAt: user.createdAt };
}

export const authService = {
  async register(name: string, email: string, password: string) {
    const existing = await userRepository.findByEmail(email);
    if (existing) throw new HttpError(409, "Email ja cadastrado");
    const user = await userRepository.create({ name, email, passwordHash: await hashValue(password) });
    const accessToken = signAccessToken(user.id);
    const refreshToken = signRefreshToken(user.id);
    await userRepository.updateRefreshToken(user.id, await hashValue(refreshToken));
    return { user: publicUser(user), accessToken, refreshToken };
  },

  async login(email: string, password: string) {
    const user = await userRepository.findByEmail(email);
    if (!user || !(await compareHash(password, user.passwordHash))) throw new HttpError(401, "Credenciais invalidas");
    const accessToken = signAccessToken(user.id);
    const refreshToken = signRefreshToken(user.id);
    await userRepository.updateRefreshToken(user.id, await hashValue(refreshToken));
    return { user: publicUser(user), accessToken, refreshToken };
  },

  async refresh(refreshToken: string) {
    const payload = jwt.verify(refreshToken, env.JWT_REFRESH_SECRET) as { sub: string; type: string };
    if (payload.type !== "refresh") throw new HttpError(401, "Refresh token invalido");
    const user = await userRepository.findById(payload.sub);
    if (!user?.refreshTokenHash || !(await compareHash(refreshToken, user.refreshTokenHash))) {
      throw new HttpError(401, "Refresh token invalido");
    }
    const newAccessToken = signAccessToken(user.id);
    const newRefreshToken = signRefreshToken(user.id);
    await userRepository.updateRefreshToken(user.id, await hashValue(newRefreshToken));
    return { accessToken: newAccessToken, refreshToken: newRefreshToken };
  },

  async logout(userId: string) {
    await userRepository.updateRefreshToken(userId, null);
  },

  async forgotPassword(email: string) {
    const user = await userRepository.findByEmail(email);
    if (!user) return { resetToken: null };
    const token = signResetToken(user.id);
    await userRepository.updateResetToken(user.id, sha256(token), new Date(Date.now() + 30 * 60 * 1000));
    return { resetToken: token };
  },

  async resetPassword(token: string, password: string) {
    const payload = jwt.verify(token, env.JWT_RESET_SECRET) as { sub: string; type: string };
    if (payload.type !== "reset") throw new HttpError(401, "Token invalido");
    const user = await userRepository.findById(payload.sub);
    if (!user?.resetTokenHash || user.resetTokenHash !== sha256(token) || !user.resetTokenExpires || user.resetTokenExpires < new Date()) {
      throw new HttpError(401, "Token invalido ou expirado");
    }
    await userRepository.updatePassword(user.id, await hashValue(password));
  }
};
