import express, { type Request, type Response } from "express";
import { z } from "zod";
import { chatService } from "./services/chat.services";

const app = express();
app.use(express.json());
const port = process.env.PORT || 5000;

app.get("/", (req: Request, res: Response) => {
  res.send(`Hello World `);
});
app.get("/api/hello", (req: Request, res: Response) => {
  res.json({ message: "Here is json" });
});

const chatSchema = z.object({
  prompt: z
    .string()
    .trim()
    .min(1, "Prompt is required")
    .max(1000, "Prompt is too long"),
  conversationId: z.string().pipe(z.string().uuid()),
});

app.post("/api/chat", async (req: Request, res: Response) => {
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
    res.send(500).json({ error: "Failed to generate a response" });
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
