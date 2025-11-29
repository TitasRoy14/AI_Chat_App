import { FaArrowUp } from "react-icons/fa";
import { Button } from "../ui/button";
import { useRef, type KeyboardEvent } from "react";
import { useForm } from "react-hook-form";

export type ChatFormData = {
  prompt: string;
};

type Props = {
  onSubmit: (data: ChatFormData) => void;
};

const ChatInput = ({ onSubmit }: Props) => {
  const { register, handleSubmit, reset, formState } = useForm<ChatFormData>();
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const { ref, ...rest } = register("prompt", {
    required: true,
    validate: (data) => data.trim().length > 0,
  });

  const submit = handleSubmit((data) => {
    reset({ prompt: "" });
    textareaRef.current?.focus();
    onSubmit(data);
  });

  const handleKeyDown = (e: KeyboardEvent<HTMLFormElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      submit();
    }
  };

  return (
    <form
      onSubmit={submit}
      onKeyDown={handleKeyDown}
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
      <Button disabled={!formState.isValid} className="rounded-full h-10 w-10">
        <FaArrowUp />
      </Button>
    </form>
  );
};

export default ChatInput;
