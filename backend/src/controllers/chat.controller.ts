import { Request, Response } from "express";
import { chatService } from "../services/chat.service.js";

export const chatController = {
  async ask(req: Request, res: Response) {
    res.status(201).json(await chatService.ask(req.user!.id, req.body.message, req.body.chatId, req.body.resumeId, req.body.jobId));
  },
  async list(req: Request, res: Response) {
    res.json(await chatService.list(req.user!.id));
  }
};
