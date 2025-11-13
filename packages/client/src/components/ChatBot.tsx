import { useForm } from "react-hook-form";
import { useRef } from "react";
import type { KeyboardEvent } from "react";
import { Button } from "./ui/button";
import { FaArrowUp } from "react-icons/fa";

type FormData = {
  prompt: string;
};

const ChatBot = () => {
  const { register, handleSubmit, reset, formState } = useForm<FormData>();
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const { ref, ...rest } = register("prompt", {
    required: true,
    validate: (data) => data.trim().length > 0,
  });

  const onSubmit = (data: FormData) => {
    console.log(data);
    reset();
    textareaRef.current?.focus();
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
