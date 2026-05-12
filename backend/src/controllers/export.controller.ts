import { Request, Response } from "express";
import { exportService } from "../services/export.service.js";

export const exportController = {
  async pdf(req: Request, res: Response) {
    const buffer = await exportService.pdf(req.user!.id, req.params.resumeId);
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", "attachment; filename=curriculo-otimizado.pdf");
    res.send(buffer);
  },
  async docx(req: Request, res: Response) {
    const buffer = await exportService.docx(req.user!.id, req.params.resumeId);
    res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.wordprocessingml.document");
    res.setHeader("Content-Disposition", "attachment; filename=curriculo-otimizado.docx");
    res.send(buffer);
  }
};
