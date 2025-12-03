import fs from "fs";
import path from "path";
import { conversationRepository } from "../repositories/conversation.repository";
import OpenAI from "openai";
import template from "../prompts/chatbot.txt";

const parkInfo = fs.readFileSync(
  path.join(__dirname, "..", "prompts", "WildlifeWorldZoo.md"),
  "utf-8",
);
const instructions = template.replace("{{parkInfo}}", parkInfo);

const client = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: process.env.OPENROUTER_KEY,
});

interface ChatResponse {
  message: string | null;
}

export const chatService = {
  async sendMessage(
    prompt: string,
    conversationId: string,
  ): Promise<ChatResponse> {
    const history =
      conversationRepository.getLastResponseId(conversationId) || [];

    const messages = [
      { role: "system" as const, content: instructions },
      ...history,
      { role: "user" as const, content: prompt },
    ];

    const response = await client.chat.completions.create({
      model: "openai/gpt-oss-20b:free",

      messages: messages,
      max_tokens: 300,
    });

    const assistantMessage = response.choices[0]!.message.content;

    history.push(
      { role: "user", content: prompt },
      { role: "assistant", content: assistantMessage! },
    );

    conversationRepository.setLastResponseId(conversationId, history);

    return {
      message: assistantMessage,
    };
  },
};
