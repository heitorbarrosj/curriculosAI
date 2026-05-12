import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { prisma } from "../config/prisma.js";
import { env } from "../config/env.js";
import { HttpError } from "../utils/http.js";

export async function authMiddleware(req: Request, _res: Response, next: NextFunction) {
  const header = req.headers.authorization;
  if (!header?.startsWith("Bearer ")) throw new HttpError(401, "Token ausente");
  const token = header.slice(7);

  try {
    const payload = jwt.verify(token, env.JWT_ACCESS_SECRET) as { sub: string; type: string };
    if (payload.type !== "access") throw new Error("Tipo de token invalido");
    const user = await prisma.user.findUnique({ where: { id: payload.sub } });
    if (!user) throw new HttpError(401, "Usuario nao encontrado");
    req.user = { id: user.id, email: user.email, name: user.name };
    next();
  } catch {
    throw new HttpError(401, "Token invalido ou expirado");
  }
}
