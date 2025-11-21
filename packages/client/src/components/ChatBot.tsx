import axios from "axios";
import ReactMarkdown from "react-markdown";
import type { KeyboardEvent } from "react";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { FaArrowUp } from "react-icons/fa";
import { Button } from "./ui/button";

type FormData = {
  prompt: string;
};
type ChatResponse = {
  message: string;
};

type Message = {
  content: string;
  role: "user" | "bot";
};

const ChatBot = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState<boolean>();
  const formRef = useRef<HTMLFormElement | null>(null);
  const conversationId = useRef(crypto.randomUUID()); // using ref because
  // we don't want it to change or cause any re-render
  const { register, handleSubmit, reset, formState } = useForm<FormData>();
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const { ref, ...rest } = register("prompt", {
    required: true,
    validate: (data) => data.trim().length > 0,
  });

  useEffect(() => {
    formRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const onSubmit = async ({ prompt }: FormData) => {
    setMessages((prev) => [...prev, { content: prompt, role: "user" }]);
    setIsTyping(true);
    reset();
    textareaRef.current?.focus();
    const { data } = await axios.post<ChatResponse>("/api/chat", {
      prompt,
      conversationId: conversationId.current,
    });
    setMessages((prev) => [...prev, { content: data.message, role: "bot" }]);
    setIsTyping(false);
  };

  const onKeyDown = (e: KeyboardEvent<HTMLFormElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(onSubmit)();
    }
  };

  const onCopyMessage = (e: React.ClipboardEvent<HTMLParagraphElement>) => {
    const selection = window.getSelection()?.toString().trim();
    if (selection) {
      e.preventDefault();
      e.clipboardData.setData("text/plain", selection);
    }
  };
  return (
    <div>
      <div className="flex flex-col gap-3 mb-10">
        {messages.map((message, index) => (
          <p
            key={index}
            onCopy={onCopyMessage}
            className={`px-3 py-1 rounded-xl ${
              message.role === "user"
                ? "bg-blue-600 text-white self-end"
                : "bg-gray-300 text-black self-start max-w-4xl"
            }`}
          >
            <ReactMarkdown>{message.content}</ReactMarkdown>
          </p>
        ))}

        {isTyping && (
          <div className="flex self-start gap-1 px-3 py-3 bg-gray-200 rounded-xl">
            <div className="h-2 w-2 rounded-full bg-gray-800 animate-bounce "></div>
            <div className="h-2 w-2 rounded-full bg-gray-800 animate-bounce [animation-delay:0.2s]"></div>
            <div className="h-2  w-2 rounded-full bg-gray-800 animate-bounce [animation-delay:0.4s]"></div>
          </div>
        )}
      </div>
      <form
        onSubmit={handleSubmit(onSubmit)}
        onKeyDown={onKeyDown}
        ref={formRef}
        className="flex flex-col gap-2 items-end border-2 p-4 rounded-3xl"
      >
        <textarea
          {...rest}
          ref={(e) => {
            ref(e);
            textareaRef.current = e;
          }}
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
