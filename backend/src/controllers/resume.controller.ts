import { Request, Response } from "express";
import { resumeService } from "../services/resume.service.js";

export const resumeController = {
  async upload(req: Request, res: Response) {
    res.status(201).json(await resumeService.upload(req.user!.id, req.file!));
  },
  async list(req: Request, res: Response) {
    const page = Number(req.query.page ?? 1);
    const pageSize = Number(req.query.pageSize ?? 10);
    res.json(await resumeService.list(req.user!.id, page, pageSize));
  },
  async get(req: Request, res: Response) {
    res.json(await resumeService.getOwned(req.params.id, req.user!.id));
  }
};
