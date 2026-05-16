import { ChatSession, Message, MessageAttachment } from "../types/chat";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "/api/backend";

const mockRecentChats: ChatSession[] = [
  { id: "mock-salary-delay", title: "Salary Delay", date: "May 15, 2024" },
  { id: "mock-murder-case", title: "Murder Case", date: "May 8, 2024" },
];

type ApiRecord = Record<string, unknown>;

const nowTime = () =>
  new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

function getAuthToken() {
  if (typeof window === "undefined") return process.env.NEXT_PUBLIC_AUTH_TOKEN;

  return (
    window.localStorage.getItem("auth_token") ??
    window.localStorage.getItem("authToken") ??
    window.localStorage.getItem("token") ??
    process.env.NEXT_PUBLIC_AUTH_TOKEN
  );
}

function authHeaders(): Record<string, string> {
  const token = getAuthToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const headers = new Headers(init?.headers);
  Object.entries(authHeaders()).forEach(([key, value]) => headers.set(key, value));

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...init,
    headers,
  });

  if (!response.ok) {
    throw new Error(`API ${response.status}: ${response.statusText}`);
  }

  if (response.status === 204) return undefined as T;
  return response.json() as Promise<T>;
}

function asRecord(value: unknown): ApiRecord {
  return typeof value === "object" && value !== null ? (value as ApiRecord) : {};
}

function getArrayPayload(value: unknown) {
  if (Array.isArray(value)) return value;
  const record = asRecord(value);
  const possible = record.items ?? record.data ?? record.threads ?? record.messages ?? record.results;
  return Array.isArray(possible) ? possible : [];
}

function formatDate(value: unknown) {
  if (typeof value !== "string") return "Today";
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return value;
  return parsed.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

function normalizeThread(raw: unknown): ChatSession {
  const record = asRecord(raw);
  const id = String(record.id ?? record.thread_id ?? record.uuid ?? `thread-${Date.now()}`);
  const title = String(record.title ?? record.name ?? "Untitled legal chat");
  const date = formatDate(record.updated_at ?? record.created_at ?? record.date);

  return { id, title, date };
}

function normalizeAttachment(raw: unknown): MessageAttachment {
  const record = asRecord(raw);
  return {
    name: String(record.name ?? record.filename ?? record.title ?? "Attachment"),
    type: String(record.type ?? record.content_type ?? "application/octet-stream"),
    url: String(record.url ?? record.file_url ?? "#"),
  };
}

function normalizeMessage(raw: unknown): Message {
  const record = asRecord(raw);
  const role = record.role === "user" ? "user" : "ai";
  const content = String(
    record.content ??
      record.message ??
      record.answer ??
      record.response ??
      record.text ??
      ""
  );
  const attachments = getArrayPayload(record.attachments).map(normalizeAttachment);

  return {
    id: String(record.id ?? record.message_id ?? `msg-${Date.now()}`),
    role,
    content,
    timestamp: formatDate(record.created_at ?? record.timestamp ?? nowTime()),
    attachments: attachments.length ? attachments : undefined,
  };
}

function fallbackAiMessage(text?: string): Message {
  return {
    id: `ai-${Date.now()}`,
    role: "ai",
    content:
      text ??
      "Based on what you described, this may involve legal rights and practical next steps. I can help you organize the issue and identify documents you may need.",
    timestamp: nowTime(),
    guidance: {
      rights: [
        { text: "You may have rights under applicable Sri Lankan laws." },
        { text: "You may be able to request written clarification or records." },
        { text: "You may be able to escalate the matter to the relevant authority." },
      ],
      steps: [
        { text: "Write down the full timeline of what happened." },
        { text: "Keep copies of all documents, messages, and receipts." },
        { text: "Consult a qualified Sri Lankan attorney for formal advice." },
      ],
      suggestedDocs: [
        { name: "Relevant Agreement.pdf", type: "application/pdf", url: "#" },
        { name: "Supporting Evidence.jpg", type: "image/jpeg", url: "#" },
      ],
    },
  };
}

export const chatService = {
  get baseUrl() {
    return API_BASE_URL;
  },

  async healthCheck(): Promise<{ status: string }> {
    return request<{ status: string }>("/health", { method: "GET" });
  },

  async getMe() {
    return request<ApiRecord>("/auth/me", { method: "GET" });
  },

  async createThread(title?: string): Promise<ChatSession> {
    const thread = await request<unknown>("/threads", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(title ? { title } : {}),
    });

    return normalizeThread(thread);
  },

  async fetchRecentChats(limit = 50, offset = 0): Promise<ChatSession[]> {
    try {
      const payload = await request<unknown>(`/threads?limit=${limit}&offset=${offset}`, {
        method: "GET",
      });
      const threads = getArrayPayload(payload).map(normalizeThread);
      return threads.length ? threads : mockRecentChats;
    } catch (error) {
      console.warn("Falling back to mock recent chats", error);
      return mockRecentChats;
    }
  },

  async updateThreadTitle(threadId: string, title: string): Promise<ChatSession> {
    const thread = await request<unknown>(`/threads/${threadId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title }),
    });

    return normalizeThread(thread);
  },

  async deleteThread(threadId: string): Promise<void> {
    await request<void>(`/threads/${threadId}`, { method: "DELETE" });
  },

  async fetchThreadMessages(threadId: string, limit = 200, offset = 0): Promise<Message[]> {
    try {
      const payload = await request<unknown>(
        `/threads/${threadId}/messages?limit=${limit}&offset=${offset}`,
        { method: "GET" }
      );
      return getArrayPayload(payload).map(normalizeMessage);
    } catch (error) {
      console.warn("Could not fetch thread messages", error);
      return [];
    }
  },

  async uploadDocument(file: File): Promise<MessageAttachment> {
    return {
      name: file.name,
      type: file.type || "application/octet-stream",
      url: URL.createObjectURL(file),
    };
  },

  async sendMessage(
    text: string,
    attachments: File[] = [],
    threadId?: string,
    options?: { ragTopK?: number; onlyInEffect?: boolean }
  ): Promise<Message> {
    try {
      const formData = new FormData();
      formData.append("message", text);
      formData.append("rag_top_k", String(options?.ragTopK ?? 5));
      formData.append("only_in_effect", String(options?.onlyInEffect ?? true));
      if (threadId) formData.append("thread_id", threadId);
      attachments.forEach((file) => formData.append("files", file));

      const payload = await request<unknown>("/chat", {
        method: "POST",
        body: formData,
      });

      return normalizeMessage(payload);
    } catch (error) {
      console.warn("Falling back to local AI message", error);
      return fallbackAiMessage();
    }
  },

  admin: {
    async listDocuments(limit = 50, offset = 0) {
      return request<unknown>(`/admin/documents?limit=${limit}&offset=${offset}`, {
        method: "GET",
      });
    },

    async deleteDocument(docId: string) {
      return request<void>(`/admin/documents/${docId}`, { method: "DELETE" });
    },

    async ingestPdf(file: File, titlePrefix?: string, metadata?: ApiRecord) {
      const formData = new FormData();
      formData.append("file", file);
      if (titlePrefix) formData.append("title_prefix", titlePrefix);
      if (metadata) formData.append("metadata_json", JSON.stringify(metadata));

      return request<unknown>("/admin/ingest", {
        method: "POST",
        body: formData,
      });
    },
  },
};
