import { Request, Response } from "express";
import { improvementService } from "../services/improvement.service.js";

export const improvementController = {
  async improve(req: Request, res: Response) {
    res.status(201).json(await improvementService.improve(req.user!.id, req.params.resumeId, req.body.jobDescription));
  }
};
