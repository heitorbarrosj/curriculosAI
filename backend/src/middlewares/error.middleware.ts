import { NextFunction, Request, Response } from "express";
import { ZodError } from "zod";
import { HttpError } from "../utils/http.js";

export function notFoundHandler(req: Request, _res: Response, next: NextFunction) {
  next(new HttpError(404, `Rota nao encontrada: ${req.method} ${req.originalUrl}`));
}

export function errorHandler(error: unknown, _req: Request, res: Response, _next: NextFunction) {
  if (error instanceof ZodError) {
    return res.status(422).json({ message: "Dados invalidos", issues: error.flatten() });
  }
  if (error instanceof HttpError) {
    return res.status(error.statusCode).json({ message: error.message, details: error.details });
  }
  console.error(error);
  return res.status(500).json({ message: "Erro interno do servidor" });
}
