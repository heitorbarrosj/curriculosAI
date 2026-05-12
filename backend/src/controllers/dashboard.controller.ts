import { Request, Response } from "express";
import { dashboardService } from "../services/dashboard.service.js";

export const dashboardController = {
  async get(req: Request, res: Response) {
    res.json(await dashboardService.get(req.user!.id));
  }
};
