import axios from "axios";
import { useRef, useState } from "react";
import type { ChatFormData } from "./ChatInput";
import ChatInput from "./ChatInput";
import type { Message } from "./ChatMessages";
import ChatMessages from "./ChatMessages";
import TypingIndicator from "./TypingIndicator";

type ChatResponse = {
  message: string;
};

const ChatBot = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState<boolean>();
  const [error, setError] = useState("");
  const conversationId = useRef(crypto.randomUUID());

  const onSubmit = async ({ prompt }: ChatFormData) => {
    try {
      setMessages((prev) => [...prev, { content: prompt, role: "user" }]);
      setIsTyping(true);
      setError("");

      const { data } = await axios.post<ChatResponse>("/api/chat", {
        prompt,
        conversationId: conversationId.current,
      });
      setMessages((prev) => [...prev, { content: data.message, role: "bot" }]);
    } catch (error) {
      console.log(error);
      setError("Something went wrong.Try again!");
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex flex-col flex-1 gap-3 mb-10 overflow-y-auto">
        <ChatMessages messages={messages} />
        {isTyping && <TypingIndicator />}
        {error && <p className="text-red-500">{error}</p>}
      </div>
      <ChatInput onSubmit={onSubmit} />
    </div>
  );
};

export default ChatBot;
