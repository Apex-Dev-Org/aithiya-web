"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import {
  Bot,
  BriefcaseBusiness,
  Check,
  FileText,
  HelpCircle,
  Home,
  Loader2,
  Menu,
  Mic,
  MoreVertical,
  Paperclip,
  Pin,
  PinOff,
  Plus,
  Search,
  Send,
  ShieldCheck,
  Sparkles,
  Trash2,
  X,
} from "lucide-react";
import { Message, ChatSession, MessageAttachment } from "../../types/chat";
import { chatService } from "../../services/chatService";

type ChatSessionUi = ChatSession & {
  pinned?: boolean;
  preview?: string;
};

const nowTime = () =>
  new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

const today = () =>
  new Date().toLocaleDateString("en-US", { month: "short", day: "numeric" });

const welcomeMessage = (): Message => ({
  id: "welcome",
  role: "ai",
  content:
    "Hello! I am Aythiya AI. Tell me what happened and I will help you understand possible rights, next steps, and useful documents.",
  timestamp: nowTime(),
});

export default function ChatPage() {
  const [input, setInput] = useState("");
  const [recentChats, setRecentChats] = useState<ChatSessionUi[]>([]);
  const [activeChatId, setActiveChatId] = useState("chat-main");
  const [chatMessages, setChatMessages] = useState<Record<string, Message[]>>({
    "chat-main": [welcomeMessage()],
  });
  const [attachments, setAttachments] = useState<MessageAttachment[]>([]);
  const [loading, setLoading] = useState(false);
  const [listening, setListening] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const messages = chatMessages[activeChatId] ?? [welcomeMessage()];

  const sortedChats = useMemo(
    () =>
      [...recentChats].sort((a, b) => Number(Boolean(b.pinned)) - Number(Boolean(a.pinned))),
    [recentChats]
  );

  useEffect(() => {
    chatService.fetchRecentChats().then((sessions) => {
      const hydrated = sessions.map((session, index) => ({
        ...session,
        pinned: index === 0,
        preview: index === 0 ? "Salary issue and labour complaint" : "Criminal case guidance",
      }));

      setRecentChats([
        { id: "chat-main", title: "New Legal Question", date: "Today", pinned: true, preview: "Aythiya AI assistant" },
        ...hydrated,
      ]);
    });
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages, loading]);

  const updateActiveMessages = (next: Message[] | ((prev: Message[]) => Message[])) => {
    setChatMessages((prev) => {
      const current = prev[activeChatId] ?? [welcomeMessage()];
      return {
        ...prev,
        [activeChatId]: typeof next === "function" ? next(current) : next,
      };
    });
  };

  const createNewChat = () => {
    const id = `chat-${Date.now()}`;
    const newSession: ChatSessionUi = {
      id,
      title: "Untitled legal chat",
      date: today(),
      preview: "Start a fresh question",
      pinned: false,
    };

    setRecentChats((prev) => [newSession, ...prev]);
    setChatMessages((prev) => ({ ...prev, [id]: [welcomeMessage()] }));
    setActiveChatId(id);
    setInput("");
    setAttachments([]);
    setSidebarOpen(false);
  };

  const openChat = (id: string) => {
    setActiveChatId(id);
    setChatMessages((prev) => ({
      ...prev,
      [id]: prev[id] ?? [welcomeMessage()],
    }));
    setSidebarOpen(false);
  };

  const deleteChat = (id: string) => {
    setRecentChats((prev) => prev.filter((chat) => chat.id !== id));
    setChatMessages((prev) => {
      const next = { ...prev };
      delete next[id];
      return next;
    });

    if (id === activeChatId) {
      const remaining = recentChats.filter((chat) => chat.id !== id);
      const nextId = remaining[0]?.id ?? "chat-main";
      setActiveChatId(nextId);
      setChatMessages((prev) => ({
        ...prev,
        [nextId]: prev[nextId] ?? [welcomeMessage()],
      }));
    }
  };

  const togglePin = (id: string) => {
    setRecentChats((prev) =>
      prev.map((chat) => (chat.id === id ? { ...chat, pinned: !chat.pinned } : chat))
    );
  };

  const handleFiles = (files: FileList | null) => {
    if (!files?.length) return;

    const mapped = Array.from(files).map((file) => ({
      name: file.name,
      type: file.type || "application/octet-stream",
      url: URL.createObjectURL(file),
    }));

    setAttachments((prev) => [...prev, ...mapped]);
  };

  const removeAttachment = (name: string) => {
    setAttachments((prev) => prev.filter((file) => file.name !== name));
  };

  const handleSend = async () => {
    if ((!input.trim() && attachments.length === 0) || loading) return;

    const content = input.trim() || "Please review the attached document.";
    const userMessage: Message = {
      id: `msg-${Date.now()}`,
      role: "user",
      content,
      timestamp: nowTime(),
      attachments,
    };

    updateActiveMessages((prev) => [...prev, userMessage]);
    setInput("");
    setAttachments([]);
    setLoading(true);

    setRecentChats((prev) =>
      prev.map((chat) =>
        chat.id === activeChatId
          ? {
              ...chat,
              title: chat.title === "Untitled legal chat" ? content.slice(0, 34) : chat.title,
              preview: content.slice(0, 54),
              date: "Today",
            }
          : chat
      )
    );

    try {
      const aiMessage = await chatService.sendMessage(userMessage.content);
      updateActiveMessages((prev) => [...prev, aiMessage]);
    } catch (error) {
      console.error("Failed to send message", error);
      updateActiveMessages((prev) => [
        ...prev,
        {
          id: `err-${Date.now()}`,
          role: "ai",
          content: "I could not process that right now. Please try again.",
          timestamp: nowTime(),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const activeChat = recentChats.find((chat) => chat.id === activeChatId);

  return (
    <div className="chat-shell">
      <aside className={`chat-sidebar ${sidebarOpen ? "is-open" : ""}`}>
        <div className="sidebar-top">
          <Link href="/" className="chat-logo">
            <img src="/aythiya_logo.png" alt="Aythiya Logo" />
          </Link>
          <button className="sidebar-close" onClick={() => setSidebarOpen(false)} aria-label="Close sidebar">
            <X size={18} />
          </button>
        </div>

        <button className="new-chat-btn" onClick={createNewChat}>
          <Plus size={18} />
          Create New Chat
        </button>

        <nav className="chat-nav">
          <NavItem active icon={<Sparkles size={18} />} label="AI Chat" />
          <NavItem icon={<BriefcaseBusiness size={18} />} label="My Cases" />
          <NavItem icon={<FileText size={18} />} label="Documents" />
          <NavItem icon={<HelpCircle size={18} />} label="Help & Support" />
        </nav>

        <div className="recent-wrap">
          <div className="recent-header">
            <span>Recent Chats</span>
            <Search size={15} />
          </div>

          <div className="recent-list">
            {sortedChats.map((chat) => (
              <div
                key={chat.id}
                className={`recent-card ${chat.id === activeChatId ? "active" : ""}`}
                onClick={() => openChat(chat.id)}
              >
                <div className="recent-main">
                  <div className="recent-title-row">
                    {chat.pinned && <Pin size={12} />}
                    <span>{chat.title}</span>
                  </div>
                  <p>{chat.preview ?? "Continue this legal conversation"}</p>
                  <small>{chat.date}</small>
                </div>

                <div className="recent-actions" onClick={(event) => event.stopPropagation()}>
                  <button onClick={() => togglePin(chat.id)} aria-label={chat.pinned ? "Unpin chat" : "Pin chat"}>
                    {chat.pinned ? <PinOff size={14} /> : <Pin size={14} />}
                  </button>
                  <button onClick={() => deleteChat(chat.id)} aria-label="Delete chat">
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="profile-card">
          <div className="avatar">M</div>
          <div>
            <strong>Mahinda Raja</strong>
            <span>Free legal guidance</span>
          </div>
          <MoreVertical size={17} />
        </div>
      </aside>

      <main className="chat-main">
        <div className="chat-bg" />
        <div className="chat-overlay" />

        <header className="chat-topbar">
          <button className="mobile-menu" onClick={() => setSidebarOpen(true)} aria-label="Open sidebar">
            <Menu size={20} />
          </button>

          <div className="chat-title">
            <div className="bot-mark">
              <Bot size={20} />
            </div>
            <div>
              <h1>{activeChat?.title ?? "Aythiya AI Chat"}</h1>
              <p>
                <ShieldCheck size={13} /> Private, encrypted, and confidential
              </p>
            </div>
          </div>

          <Link href="/" className="home-link">
            <Home size={16} />
            Home
          </Link>
        </header>

        <section className="messages-panel">
          <div className="messages-list">
            {messages.map((msg, index) => (
              <MessageBubble key={msg.id} msg={msg} index={index} />
            ))}

            {loading && (
              <div className="message-row ai animate-message">
                <div className="ai-avatar">
                  <Bot size={18} />
                </div>
                <div className="typing-bubble glass-card">
                  <span />
                  <span />
                  <span />
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>
        </section>

        <section className="composer-wrap">
          {attachments.length > 0 && (
            <div className="attachment-strip">
              {attachments.map((file) => (
                <div key={file.name} className="attachment-chip">
                  <FileText size={14} />
                  <span>{file.name}</span>
                  <button onClick={() => removeAttachment(file.name)} aria-label="Remove attachment">
                    <X size={13} />
                  </button>
                </div>
              ))}
            </div>
          )}

          <div className="composer glass-card">
            <input
              ref={fileInputRef}
              type="file"
              multiple
              hidden
              onChange={(event) => handleFiles(event.target.files)}
            />

            <button className="tool-btn" onClick={() => fileInputRef.current?.click()} aria-label="Attach file">
              <Paperclip size={19} />
            </button>

            <textarea
              value={input}
              onChange={(event) => setInput(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter" && !event.shiftKey) {
                  event.preventDefault();
                  handleSend();
                }
              }}
              rows={1}
              placeholder="Describe what happened, or attach a document..."
            />

            <button
              className={`tool-btn mic-btn ${listening ? "listening" : ""}`}
              onClick={() => setListening((prev) => !prev)}
              aria-label="Toggle microphone"
            >
              <Mic size={19} />
            </button>

            <button className="send-btn" onClick={handleSend} disabled={loading || (!input.trim() && attachments.length === 0)}>
              {loading ? <Loader2 size={18} className="spin" /> : <Send size={18} />}
            </button>
          </div>
          <p className="legal-disclaimer">
            This tool provides legal information for educational purposes and
            does not constitute official legal advice. Always consult a
            qualified Sri Lankan attorney.
          </p>
        </section>
      </main>

      <style>{`
        .chat-shell {
          display: flex;
          height: 100vh;
          overflow: hidden;
          background: #f6f9ff;
          color: #0f172a;
          font-family: Inter, sans-serif;
        }

        .chat-sidebar {
          width: 300px;
          flex: 0 0 300px;
          display: flex;
          flex-direction: column;
          padding: 18px;
          border-right: 1px solid rgba(191, 219, 254, 0.55);
          background: rgba(255, 255, 255, 0.78);
          backdrop-filter: blur(22px);
          box-shadow: 12px 0 40px rgba(15, 23, 42, 0.05);
          z-index: 5;
        }

        .sidebar-top {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 18px;
        }

        .chat-logo img {
          height: 46px;
          width: auto;
          object-fit: contain;
        }

        .sidebar-close {
          display: none;
        }

        .new-chat-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          width: 100%;
          padding: 13px 16px;
          border: 0;
          border-radius: 16px;
          background: linear-gradient(135deg, #1d4ed8, #3b82f6);
          color: #fff;
          font-weight: 800;
          cursor: pointer;
          box-shadow: 0 14px 28px rgba(29, 78, 216, 0.24);
          transition: transform .2s, box-shadow .2s;
        }

        .new-chat-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 18px 36px rgba(29, 78, 216, 0.32);
        }

        .chat-nav {
          display: grid;
          gap: 8px;
          margin: 18px 0 24px;
        }

        .nav-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px 14px;
          border-radius: 14px;
          color: #64748b;
          font-weight: 700;
          font-size: 14px;
        }

        .nav-item.active {
          color: #1d4ed8;
          background: rgba(219, 234, 254, 0.72);
        }

        .recent-wrap {
          min-height: 0;
          flex: 1;
          display: flex;
          flex-direction: column;
        }

        .recent-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          color: #94a3b8;
          font-size: 12px;
          font-weight: 900;
          letter-spacing: .08em;
          text-transform: uppercase;
          margin-bottom: 12px;
        }

        .recent-list {
          overflow-y: auto;
          display: grid;
          gap: 9px;
          padding-right: 2px;
        }

        .recent-card {
          display: flex;
          gap: 8px;
          justify-content: space-between;
          padding: 12px;
          border-radius: 16px;
          cursor: pointer;
          border: 1px solid transparent;
          background: rgba(255, 255, 255, 0.42);
          transition: background .2s, border-color .2s, transform .2s;
        }

        .recent-card:hover,
        .recent-card.active {
          background: rgba(239, 246, 255, 0.9);
          border-color: rgba(147, 197, 253, 0.7);
          transform: translateX(2px);
        }

        .recent-main {
          min-width: 0;
          flex: 1;
        }

        .recent-title-row {
          display: flex;
          gap: 6px;
          align-items: center;
          color: #0f172a;
          font-weight: 800;
          font-size: 13px;
        }

        .recent-title-row span {
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .recent-main p {
          color: #64748b;
          font-size: 12px;
          line-height: 1.35;
          margin: 4px 0;
        }

        .recent-main small {
          color: #94a3b8;
          font-size: 11px;
        }

        .recent-actions {
          display: flex;
          flex-direction: column;
          gap: 5px;
          opacity: .58;
        }

        .recent-actions button,
        .sidebar-close,
        .mobile-menu {
          border: 0;
          background: transparent;
          color: #64748b;
          cursor: pointer;
          border-radius: 9px;
          padding: 5px;
        }

        .recent-actions button:hover,
        .sidebar-close:hover,
        .mobile-menu:hover {
          background: rgba(219, 234, 254, 0.8);
          color: #1d4ed8;
        }

        .profile-card {
          margin-top: 16px;
          display: flex;
          align-items: center;
          gap: 11px;
          padding: 12px;
          border-radius: 18px;
          background: rgba(248, 250, 252, .9);
          border: 1px solid rgba(226, 232, 240, .9);
        }

        .avatar {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          display: grid;
          place-items: center;
          color: #fff;
          font-weight: 900;
          background: linear-gradient(135deg, #1d4ed8, #60a5fa);
        }

        .profile-card div:nth-child(2) {
          flex: 1;
          min-width: 0;
        }

        .profile-card strong {
          display: block;
          font-size: 13px;
        }

        .profile-card span {
          color: #64748b;
          font-size: 11px;
        }

        .chat-main {
          position: relative;
          flex: 1;
          display: flex;
          flex-direction: column;
          overflow: hidden;
        }

        .chat-bg {
          position: absolute;
          inset: 0;
          background-image: url('/how_aythiya_works_bg.png');
          background-size: cover;
          background-position: center;
          opacity: .46;
          transform: scale(1.05);
        }

        .chat-overlay {
          position: absolute;
          inset: 0;
          background:
            radial-gradient(circle at 20% 10%, rgba(191, 219, 254, .42), transparent 34%),
            linear-gradient(180deg, rgba(255,255,255,.72), rgba(239,246,255,.78));
        }

        .chat-topbar {
          position: relative;
          z-index: 1;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
          padding: 20px 34px;
        }

        .mobile-menu {
          display: none;
        }

        .chat-title {
          display: flex;
          align-items: center;
          gap: 12px;
          min-width: 0;
        }

        .bot-mark,
        .ai-avatar {
          width: 42px;
          height: 42px;
          border-radius: 14px;
          display: grid;
          place-items: center;
          color: #fff;
          background: linear-gradient(135deg, #1d4ed8, #60a5fa);
          box-shadow: 0 12px 24px rgba(29, 78, 216, .25);
        }

        .chat-title h1 {
          font-size: 17px;
          margin: 0;
          font-weight: 900;
        }

        .chat-title p {
          display: flex;
          align-items: center;
          gap: 5px;
          margin: 4px 0 0;
          color: #64748b;
          font-size: 12px;
          font-weight: 700;
        }

        .home-link {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 10px 14px;
          border-radius: 999px;
          color: #1d4ed8;
          background: rgba(255,255,255,.72);
          border: 1px solid rgba(191,219,254,.72);
          text-decoration: none;
          font-weight: 800;
          font-size: 13px;
          backdrop-filter: blur(12px);
        }

        .messages-panel {
          position: relative;
          z-index: 1;
          flex: 1;
          display: flex;
          flex-direction: column;
          min-height: 0;
          padding: 0 34px;
        }

        .messages-list {
          flex: 1;
          min-height: 0;
          overflow-y: auto;
          display: flex;
          flex-direction: column;
          gap: 22px;
          padding: 2px 4px 26px;
        }

        .message-row {
          display: flex;
          gap: 13px;
          align-items: flex-end;
          max-width: 100%;
        }

        .message-row.user {
          justify-content: flex-end;
        }

        .message-stack {
          max-width: min(720px, 74%);
        }

        .message-row.user .message-stack {
          max-width: min(640px, 70%);
        }

        .glass-card {
          background: rgba(255,255,255,.66);
          border: 1px solid rgba(255,255,255,.78);
          backdrop-filter: blur(18px);
          box-shadow: 0 18px 46px rgba(15,23,42,.08);
        }

        .bubble {
          position: relative;
          padding: 15px 18px;
          border-radius: 22px;
          color: #1e293b;
          line-height: 1.65;
          font-size: 15px;
        }

        .bubble.ai {
          border-bottom-left-radius: 7px;
        }

        .bubble.user {
          border-bottom-right-radius: 7px;
          color: #082f49;
          background:
            linear-gradient(135deg, rgba(219,234,254,.88), rgba(255,255,255,.62));
          border: 1px solid rgba(147,197,253,.72);
          backdrop-filter: blur(18px);
          box-shadow: 0 18px 42px rgba(29,78,216,.12);
        }

        .bubble-meta {
          display: flex;
          align-items: center;
          gap: 5px;
          margin-top: 7px;
          color: #94a3b8;
          font-size: 11px;
        }

        .message-row.user .bubble-meta {
          justify-content: flex-end;
        }

        .message-attachments {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          margin-top: 10px;
        }

        .message-attachments span {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 7px 10px;
          border-radius: 999px;
          background: rgba(255,255,255,.62);
          border: 1px solid rgba(191,219,254,.72);
          font-size: 12px;
          font-weight: 700;
          color: #1d4ed8;
        }

        .guidance-card {
          margin-top: 14px;
          border-radius: 24px;
          padding: 20px;
        }

        .guidance-title {
          display: flex;
          align-items: center;
          gap: 8px;
          color: #1d4ed8;
          font-weight: 900;
          margin-bottom: 16px;
        }

        .guidance-grid {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 13px;
        }

        .guidance-box {
          border-radius: 18px;
          padding: 16px;
          background: rgba(248,250,252,.78);
          border: 1px solid rgba(226,232,240,.8);
        }

        .guidance-box h3 {
          display: flex;
          align-items: center;
          gap: 7px;
          margin: 0 0 10px;
          font-size: 13px;
        }

        .guidance-box p,
        .guidance-box li {
          color: #475569;
          font-size: 12px;
          line-height: 1.55;
        }

        .guidance-box ul {
          list-style: none;
          display: grid;
          gap: 8px;
        }

        .guidance-box li {
          display: flex;
          gap: 7px;
        }

        .typing-bubble {
          display: flex;
          gap: 6px;
          padding: 15px 18px;
          border-radius: 20px 20px 20px 6px;
        }

        .typing-bubble span {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: #60a5fa;
          animation: typingPulse 1.1s infinite ease-in-out;
        }

        .typing-bubble span:nth-child(2) {
          animation-delay: .15s;
        }

        .typing-bubble span:nth-child(3) {
          animation-delay: .3s;
        }

        .composer-wrap {
          position: relative;
          z-index: 2;
          padding: 0 34px 28px;
        }

        .attachment-strip {
          max-width: 920px;
          margin: 0 auto 10px;
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
        }

        .attachment-chip {
          display: inline-flex;
          align-items: center;
          gap: 7px;
          padding: 8px 10px;
          border-radius: 999px;
          color: #1d4ed8;
          font-size: 12px;
          font-weight: 800;
          background: rgba(255,255,255,.72);
          border: 1px solid rgba(191,219,254,.78);
          backdrop-filter: blur(12px);
        }

        .attachment-chip button {
          border: 0;
          background: transparent;
          color: #64748b;
          cursor: pointer;
          padding: 1px;
        }

        .composer {
          max-width: 920px;
          margin: 0 auto;
          display: flex;
          align-items: flex-end;
          gap: 10px;
          border-radius: 28px;
          padding: 10px;
        }

        .legal-disclaimer {
          max-width: 860px;
          margin: 10px auto 0;
          color: #64748b;
          font-size: 11px;
          line-height: 1.55;
          text-align: center;
        }

        .composer textarea {
          flex: 1;
          resize: none;
          border: 0;
          outline: none;
          min-height: 42px;
          max-height: 120px;
          padding: 12px 6px;
          background: transparent;
          color: #0f172a;
          font: inherit;
          font-size: 15px;
        }

        .tool-btn,
        .send-btn {
          flex: 0 0 auto;
          width: 44px;
          height: 44px;
          border: 0;
          border-radius: 50%;
          display: grid;
          place-items: center;
          cursor: pointer;
          transition: transform .2s, background .2s, color .2s, box-shadow .2s;
        }

        .tool-btn {
          color: #64748b;
          background: rgba(248,250,252,.9);
          border: 1px solid rgba(226,232,240,.9);
        }

        .tool-btn:hover {
          color: #1d4ed8;
          background: rgba(219,234,254,.86);
          transform: translateY(-1px);
        }

        .mic-btn.listening {
          color: #fff;
          background: #ef4444;
          box-shadow: 0 0 0 8px rgba(239,68,68,.12);
          animation: micPulse 1.4s infinite;
        }

        .send-btn {
          color: #fff;
          background: linear-gradient(135deg, #1d4ed8, #3b82f6);
          box-shadow: 0 12px 24px rgba(29,78,216,.28);
        }

        .send-btn:disabled {
          cursor: not-allowed;
          color: #94a3b8;
          background: #e2e8f0;
          box-shadow: none;
        }

        .send-btn:not(:disabled):hover {
          transform: translateY(-2px) scale(1.02);
        }

        .animate-message {
          animation: messageIn .34s ease-out both;
        }

        .spin {
          animation: spin 1s linear infinite;
        }

        @keyframes messageIn {
          from { opacity: 0; transform: translateY(12px) scale(.98); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }

        @keyframes typingPulse {
          0%, 80%, 100% { transform: translateY(0); opacity: .45; }
          40% { transform: translateY(-5px); opacity: 1; }
        }

        @keyframes micPulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        @media (max-width: 980px) {
          .chat-sidebar {
            position: fixed;
            inset: 0 auto 0 0;
            transform: translateX(-102%);
            transition: transform .25s ease;
          }

          .chat-sidebar.is-open {
            transform: translateX(0);
          }

          .sidebar-close,
          .mobile-menu {
            display: inline-grid;
            place-items: center;
          }

          .chat-topbar {
            padding: 16px 18px;
          }

          .messages-panel,
          .composer-wrap {
            padding-left: 18px;
            padding-right: 18px;
          }

          .guidance-grid {
            grid-template-columns: 1fr;
          }

          .message-stack,
          .message-row.user .message-stack {
            max-width: 88%;
          }
        }

        @media (max-width: 640px) {
          .chat-title h1 {
            font-size: 14px;
          }

          .home-link {
            display: none;
          }

          .message-stack,
          .message-row.user .message-stack {
            max-width: 94%;
          }
        }
      `}</style>
    </div>
  );
}

function NavItem({
  icon,
  label,
  active,
}: {
  icon: React.ReactNode;
  label: string;
  active?: boolean;
}) {
  return (
    <div className={`nav-item ${active ? "active" : ""}`}>
      {icon}
      {label}
    </div>
  );
}

function MessageBubble({ msg, index }: { msg: Message; index: number }) {
  const isUser = msg.role === "user";

  return (
    <div className={`message-row ${isUser ? "user" : "ai"} animate-message`} style={{ animationDelay: `${Math.min(index * 40, 240)}ms` }}>
      {!isUser && (
        <div className="ai-avatar">
          <Bot size={18} />
        </div>
      )}

      <div className="message-stack">
        <div className={`bubble ${isUser ? "user" : "ai glass-card"}`}>
          {msg.content}
          {msg.attachments && msg.attachments.length > 0 && (
            <div className="message-attachments">
              {msg.attachments.map((file) => (
                <span key={file.name}>
                  <FileText size={13} />
                  {file.name}
                </span>
              ))}
            </div>
          )}
        </div>

        {msg.guidance && <GuidanceSummary msg={msg} />}

        <div className="bubble-meta">
          {msg.timestamp}
          {isUser && (
            <>
              <Check size={12} />
              <Check size={12} style={{ marginLeft: -8 }} />
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function GuidanceSummary({ msg }: { msg: Message }) {
  if (!msg.guidance) return null;

  return (
    <div className="guidance-card glass-card">
      <div className="guidance-title">
        <Sparkles size={18} />
        Your Guidance Summary
      </div>

      <div className="guidance-grid">
        <div className="guidance-box">
          <h3>
            <ShieldCheck size={15} color="#1d4ed8" />
            Possible rights
          </h3>
          <ul>
            {msg.guidance.rights.map((right, index) => (
              <li key={index}>
                <Check size={14} color="#1d4ed8" />
                {right.text}
              </li>
            ))}
          </ul>
        </div>

        <div className="guidance-box">
          <h3>
            <Sparkles size={15} color="#1d4ed8" />
            Recommended steps
          </h3>
          <ul>
            {msg.guidance.steps.map((step, index) => (
              <li key={index}>
                <span style={{ color: "#1d4ed8", fontWeight: 900 }}>{index + 1}.</span>
                {step.text}
              </li>
            ))}
          </ul>
        </div>

        <div className="guidance-box">
          <h3>
            <Paperclip size={15} color="#1d4ed8" />
            Useful documents
          </h3>
          <ul>
            {msg.guidance.suggestedDocs.map((doc) => (
              <li key={doc.name}>
                <FileText size={14} color={doc.type.includes("pdf") ? "#ef4444" : "#1d4ed8"} />
                {doc.name}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
