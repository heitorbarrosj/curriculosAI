import { Request, Response } from "express";
import { authService } from "../services/auth.service.js";

export const authController = {
  async register(req: Request, res: Response) {
    res.status(201).json(await authService.register(req.body.name, req.body.email, req.body.password));
  },
  async login(req: Request, res: Response) {
    res.json(await authService.login(req.body.email, req.body.password));
  },
  async refresh(req: Request, res: Response) {
    res.json(await authService.refresh(req.body.refreshToken));
  },
  async logout(req: Request, res: Response) {
    await authService.logout(req.user!.id);
    res.status(204).send();
  },
  async forgotPassword(req: Request, res: Response) {
    const result = await authService.forgotPassword(req.body.email);
    res.json({ message: "Se o email existir, as instrucoes foram geradas.", resetToken: result.resetToken });
  },
  async resetPassword(req: Request, res: Response) {
    await authService.resetPassword(req.body.token, req.body.password);
    res.status(204).send();
  }
};
