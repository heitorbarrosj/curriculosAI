import { Request, Response } from "express";
import { atsService } from "../services/ats.service.js";

export const atsController = {
  async analyze(req: Request, res: Response) {
    res.status(201).json(await atsService.analyze(req.user!.id, req.params.resumeId));
  }
};
