import { ChatSession, Message, MessageAttachment } from "../types/chat";

// Mock data
const mockRecentChats: ChatSession[] = [
  { id: "1", title: "Salary Delay", date: "May 15, 2024" },
  { id: "2", title: "Murder Case", date: "May 8, 2024" },
];

export const chatService = {
  async fetchRecentChats(): Promise<ChatSession[]> {
    return new Promise((resolve) => {
      setTimeout(() => resolve(mockRecentChats), 500);
    });
  },

  async uploadDocument(file: File): Promise<MessageAttachment> {
    // Mocking file upload
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          name: file.name,
          type: file.type,
          url: URL.createObjectURL(file),
        });
      }, 1000);
    });
  },

  async sendMessage(text: string, attachments?: File[]): Promise<Message> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const now = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
        resolve({
          id: Date.now().toString(),
          role: "ai",
          content: "Based on what you described, this may involve tenant rights and deposit return issues. I can help you identify possible rights and next steps.",
          timestamp: now,
          guidance: {
            rights: [
              { text: "Right to return of security deposit within a reasonable time." },
              { text: "Right to receive an itemized deduction statement." },
              { text: "Right to fair treatment under the Tenants' Rights Act." },
            ],
            steps: [
              { text: "Review your rental agreement." },
              { text: "Send a written request for the deposit." },
              { text: "Keep all communication records." },
              { text: "File a complaint if no response." },
            ],
            suggestedDocs: [
              { name: "Rental Agreement.pdf", type: "application/pdf", url: "#" },
              { name: "Payment Receipt.jpg", type: "image/jpeg", url: "#" },
            ],
          },
        });
      }, 1500);
    });
  },
};
