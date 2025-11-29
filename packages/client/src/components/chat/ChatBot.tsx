import axios from "axios";
import ReactMarkdown from "react-markdown";
import type { KeyboardEvent } from "react";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { FaArrowUp } from "react-icons/fa";
import { Button } from "../ui/button";
import TypingIndicator from "./TypingIndicator";
import type { Message } from "./ChatMessages";
import ChatMessages from "./ChatMessages";

type FormData = {
  prompt: string;
};
type ChatResponse = {
  message: string;
};

const ChatBot = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState<boolean>();
  const [error, setError] = useState("");

  const conversationId = useRef(crypto.randomUUID()); // using ref because
  // we don't want it to change or cause any re-render
  const { register, handleSubmit, reset, formState } = useForm<FormData>();
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const { ref, ...rest } = register("prompt", {
    required: true,
    validate: (data) => data.trim().length > 0,
  });

  const onSubmit = async ({ prompt }: FormData) => {
    try {
      setMessages((prev) => [...prev, { content: prompt, role: "user" }]);
      setIsTyping(true);
      setError("");
      reset({ prompt: "" });
      textareaRef.current?.focus();
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

  const onKeyDown = (e: KeyboardEvent<HTMLFormElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(onSubmit)();
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex flex-col flex-1 gap-3 mb-10 overflow-y-auto">
        <ChatMessages messages={messages} />
        {isTyping && <TypingIndicator />}
        {error && <p className="text-red-500">{error}</p>}
      </div>
      <form
        onSubmit={handleSubmit(onSubmit)}
        onKeyDown={onKeyDown}
        className="flex flex-col gap-2 items-end border-2 p-4 rounded-3xl"
      >
        <textarea
          {...rest}
          ref={(e) => {
            ref(e);
            textareaRef.current = e;
          }}
          autoFocus
          className="w-full focus:outline-0 resize-none"
          placeholder="Ask anything"
          maxLength={1000}
        />
        <Button
          disabled={!formState.isValid}
          className="rounded-full h-10 w-10"
        >
          <FaArrowUp />
        </Button>
      </form>
    </div>
  );
};

export default ChatBot;
