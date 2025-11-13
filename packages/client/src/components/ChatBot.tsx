import axios from "axios";
import type { KeyboardEvent } from "react";
import { useRef } from "react";
import { useForm } from "react-hook-form";
import { FaArrowUp } from "react-icons/fa";
import { Button } from "./ui/button";

type FormData = {
  prompt: string;
};

const ChatBot = () => {
  const conversationId = useRef(crypto.randomUUID()); // using ref because
  // we don't want it to change or cause any re-render
  const { register, handleSubmit, reset, formState } = useForm<FormData>();
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const { ref, ...rest } = register("prompt", {
    required: true,
    validate: (data) => data.trim().length > 0,
  });

  const onSubmit = async ({ prompt }: FormData) => {
    reset();
    textareaRef.current?.focus();
    const { data } = await axios.post("/api/chat", {
      prompt,
      conversationId: conversationId.current,
    });
    console.log(data);
  };

  const onKeyDown = (e: KeyboardEvent<HTMLFormElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(onSubmit)();
    }
  };

  return (
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
        className="w-full focus:outline-0 resize-none"
        placeholder="Ask anything"
        maxLength={1000}
      />
      <Button disabled={!formState.isValid} className="rounded-full h-10 w-10">
        <FaArrowUp />
      </Button>
    </form>
  );
};

export default ChatBot;
