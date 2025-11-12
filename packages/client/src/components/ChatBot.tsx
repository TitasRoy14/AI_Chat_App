import { Button } from "./ui/button";
import { FaArrowUp } from "react-icons/fa";

const ChatBot = () => {
  return (
    <div className="flex flex-col gap-2 items-end border-2 p-4 rounded-3xl">
      <textarea
        className="w-full focus:outline-0 resize-none"
        placeholder="Ask anything"
        maxLength={1000}
      />
      <Button className="rounded-full h-10 w-10">
        <FaArrowUp />
      </Button>
    </div>
  );
};

export default ChatBot;
