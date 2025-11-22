import type { Request, Response } from "express";
import z from "zod";
import { chatService } from "../services/chat.services";

const chatSchema = z.object({
  prompt: z
    .string()
    .trim()
    .min(1, "Prompt is required")
    .max(1000, "Prompt is too long"),
  conversationId: z.string().pipe(z.string().uuid()),
});

export const chatController = {
  async sendMessage(req: Request, res: Response) {
    const parseResult = chatSchema.safeParse(req.body);

    if (!parseResult.success) {
      res.status(400).json(parseResult.error.format());
      return;
    }

    try {
      const { prompt, conversationId } = req.body;

      const { message } = await chatService.sendMessage(prompt, conversationId);

      res.json({ message: message });
    } catch (error) {
      res.status(500).json({ error: error });
    }
  },
};
