import express, { type Request, type Response } from "express";
import { chatController } from "./controllers/chat.controllers";

const app = express();
app.use(express.json());
const port = process.env.PORT || 5000;

app.get("/", (req: Request, res: Response) => {
  res.send(`Hello World `);
});
app.get("/api/hello", (req: Request, res: Response) => {
  res.json({ message: "Here is json" });
});

app.post("/api/chat", chatController.sendMessage);

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
