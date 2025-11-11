interface Message {
  role: "user" | "assistant" | "system";
  content: string;
}

const conversations = new Map<
  string,
  Array<{ role: "user" | "assistant" | "system"; content: string }>
>();

export const conversationRepository = {
  getLastResponseId(conversationId: string) {
    return conversations.get(conversationId);
  },

  setLastResponseId(conversationId: string, history: Message[]) {
    return conversations.set(conversationId, history);
  },
};
