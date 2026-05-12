import { Request, Response } from "express";
import { jobService } from "../services/job.service.js";

export const jobController = {
  async create(req: Request, res: Response) {
    res.status(201).json(await jobService.create(req.user!.id, req.body.title, req.body.company, req.body.description));
  },
  async list(req: Request, res: Response) {
    res.json(await jobService.list(req.user!.id));
  },
  async match(req: Request, res: Response) {
    res.status(201).json(await jobService.match(req.user!.id, req.params.jobId, req.params.resumeId));
  }
};
