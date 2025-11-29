import { useEffect, useRef } from "react";
import ReactMarkdown from "react-markdown";

export type Message = {
  content: string;
  role: "user" | "bot";
};

type Props = {
  messages: Message[];
};

const ChatMessages = ({ messages }: Props) => {
  const lastParagraphRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    lastParagraphRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);
  // it take care that the copy function doesn't take the whole space
  const onCopyMessage = (e: React.ClipboardEvent<HTMLParagraphElement>) => {
    const selection = window.getSelection()?.toString().trim();
    if (selection) {
      e.preventDefault();
      e.clipboardData.setData("text/plain", selection);
    }
  };
  return (
    <>
      {messages.map((message, index) => (
        <div
          key={index}
          ref={index === messages.length - 1 ? lastParagraphRef : null}
          onCopy={onCopyMessage}
          className={`px-3 py-1 rounded-xl ${
            message.role === "user"
              ? "bg-blue-600 text-white self-end"
              : "bg-gray-300 text-black self-start max-w-4xl"
          }`}
        >
          <ReactMarkdown>{message.content}</ReactMarkdown>
        </div>
      ))}
    </>
  );
};

export default ChatMessages;
