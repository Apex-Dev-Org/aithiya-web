"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { Message, ChatSession } from "../../types/chat";
import { chatService } from "../../services/chatService";

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "init",
      role: "ai",
      content: "Hello! I am Aythiya AI. How can I assist you with your legal issue today?",
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    }
  ]);
  const [input, setInput] = useState("");
  const [recentChats, setRecentChats] = useState<ChatSession[]>([]);
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatService.fetchRecentChats().then(setRecentChats);
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    };

    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const aiMessage = await chatService.sendMessage(userMessage.content);
      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error("Failed to send message", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: "flex", height: "100vh", backgroundColor: "#f8faff", fontFamily: "Inter, sans-serif" }}>
      {/* Sidebar */}
      <div style={{ width: 260, backgroundColor: "#fff", borderRight: "1px solid #e2e8f0", display: "flex", flexDirection: "column" }}>
        {/* Logo Area */}
        <div style={{ padding: "24px 20px" }}>
          <Link href="/">
            <img src="/aythiya_logo.png" alt="Aythiya Logo" style={{ height: 40, cursor: "pointer" }} />
          </Link>
        </div>

        {/* Main Nav */}
        <div style={{ padding: "0 12px", display: "flex", flexDirection: "column", gap: 4 }}>
          <div style={{ padding: "12px 16px", backgroundColor: "#f0f6ff", borderRadius: 8, color: "#1a5caa", fontWeight: 600, display: "flex", alignItems: "center", gap: 12, cursor: "pointer" }}>
            <span style={{ fontSize: 18 }}>💬</span> Chat
          </div>
          <div style={{ padding: "12px 16px", color: "#64748b", fontWeight: 500, display: "flex", alignItems: "center", gap: 12, cursor: "pointer", transition: "background 0.2s" }} onMouseEnter={e => e.currentTarget.style.backgroundColor = "#f8fafc"} onMouseLeave={e => e.currentTarget.style.backgroundColor = "transparent"}>
            <span style={{ fontSize: 18 }}>💼</span> My Cases
          </div>
          <div style={{ padding: "12px 16px", color: "#64748b", fontWeight: 500, display: "flex", alignItems: "center", gap: 12, cursor: "pointer", transition: "background 0.2s" }} onMouseEnter={e => e.currentTarget.style.backgroundColor = "#f8fafc"} onMouseLeave={e => e.currentTarget.style.backgroundColor = "transparent"}>
            <span style={{ fontSize: 18 }}>📄</span> Documents
          </div>
          <div style={{ padding: "12px 16px", color: "#64748b", fontWeight: 500, display: "flex", alignItems: "center", gap: 12, cursor: "pointer", transition: "background 0.2s" }} onMouseEnter={e => e.currentTarget.style.backgroundColor = "#f8fafc"} onMouseLeave={e => e.currentTarget.style.backgroundColor = "transparent"}>
            <span style={{ fontSize: 18 }}>❓</span> Help & Support
          </div>
        </div>

        {/* Recent Chats */}
        <div style={{ marginTop: 32, padding: "0 20px", flex: 1, overflowY: "auto" }}>
          <div style={{ fontSize: 12, fontWeight: 600, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: 12 }}>Recent Chats</div>
          {recentChats.map(session => (
            <div key={session.id} style={{ padding: "10px 12px", borderRadius: 8, cursor: "pointer", marginBottom: 4, transition: "background 0.2s" }} onMouseEnter={e => e.currentTarget.style.backgroundColor = "#f0f6ff"} onMouseLeave={e => e.currentTarget.style.backgroundColor = "transparent"}>
              <div style={{ color: "#1a5caa", fontWeight: 500, fontSize: 14 }}>{session.title}</div>
              <div style={{ color: "#94a3b8", fontSize: 11, marginTop: 4 }}>{session.date}</div>
            </div>
          ))}
        </div>

        {/* Profile */}
        <div style={{ padding: "20px", borderTop: "1px solid #e2e8f0" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "8px 12px", backgroundColor: "#f1f5f9", borderRadius: 50, cursor: "pointer" }}>
            <div style={{ width: 32, height: 32, borderRadius: "50%", backgroundColor: "#e2e8f0", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 600, color: "#64748b" }}>M</div>
            <div style={{ flex: 1, fontSize: 14, fontWeight: 600, color: "#334155" }}>Mahinda Raja</div>
            <div style={{ color: "#94a3b8" }}>›</div>
          </div>
        </div>
      </div>

      {/* Main Chat Area */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", position: "relative" }}>
        {/* Background Effects */}
        <div style={{ position: "absolute", inset: 0, overflow: "hidden", zIndex: 0, pointerEvents: "none" }}>
           <div style={{ position: "absolute", top: "-10%", left: "-10%", width: "60%", height: "60%", background: "radial-gradient(circle, rgba(219,234,254,0.6) 0%, rgba(255,255,255,0) 70%)", filter: "blur(40px)" }} />
           <div style={{ position: "absolute", bottom: "-10%", right: "-10%", width: "60%", height: "60%", background: "radial-gradient(circle, rgba(224,231,255,0.6) 0%, rgba(255,255,255,0) 70%)", filter: "blur(40px)" }} />
        </div>

        {/* Security Banner */}
        <div style={{ position: "relative", zIndex: 1, padding: "24px 40px", display: "flex", justifyContent: "center" }}>
          <div style={{ backgroundColor: "rgba(255, 255, 255, 0.7)", backdropFilter: "blur(12px)", padding: "10px 24px", borderRadius: 50, display: "flex", alignItems: "center", gap: 12, boxShadow: "0 4px 12px rgba(0,0,0,0.03)", border: "1px solid rgba(255,255,255,0.5)" }}>
            <span style={{ color: "#64748b" }}>🔒</span>
            <span style={{ fontSize: 13, fontWeight: 500, color: "#1a5caa" }}>Your conversation is private and confidential.</span>
            <span style={{ color: "#64748b", marginLeft: 16 }}>🛡️</span>
          </div>
        </div>

        {/* Messages List */}
        <div style={{ flex: 1, overflowY: "auto", padding: "0 40px 40px", position: "relative", zIndex: 1, display: "flex", flexDirection: "column", gap: 24 }}>
          {messages.map(msg => (
            <div key={msg.id} style={{ display: "flex", flexDirection: "column", alignItems: msg.role === "user" ? "flex-end" : "flex-start", maxWidth: "100%" }}>
              
              {/* Standard Message Bubble */}
              {msg.role === "user" ? (
                <div style={{ maxWidth: "60%" }}>
                  <div style={{ backgroundColor: "#dbeafe", color: "#1e3a5f", padding: "16px 20px", borderRadius: "20px 20px 4px 20px", fontSize: 15, lineHeight: 1.6, boxShadow: "0 4px 12px rgba(0,0,0,0.02)" }}>
                    {msg.content}
                  </div>
                  <div style={{ fontSize: 11, color: "#94a3b8", marginTop: 6, textAlign: "right" }}>{msg.timestamp} <span style={{ color: "#60a5fa" }}>✓✓</span></div>
                </div>
              ) : (
                <div style={{ display: "flex", gap: 16, maxWidth: msg.guidance ? "85%" : "60%" }}>
                  <div style={{ flexShrink: 0, width: 40, height: 40, borderRadius: "50%", backgroundColor: "#1a5caa", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", boxShadow: "0 4px 12px rgba(26,92,170,0.2)" }}>
                    🏛️
                  </div>
                  <div style={{ display: "flex", flexDirection: "column" }}>
                    <div style={{ backgroundColor: "#fff", color: "#334155", padding: "16px 20px", borderRadius: "4px 20px 20px 20px", fontSize: 15, lineHeight: 1.6, boxShadow: "0 4px 12px rgba(0,0,0,0.03)", border: "1px solid #f1f5f9", marginBottom: msg.guidance ? 16 : 0 }}>
                      {msg.content}
                    </div>
                    
                    {/* Guidance Summary UI */}
                    {msg.guidance && (
                      <div style={{ backgroundColor: "#fff", borderRadius: 24, padding: 24, boxShadow: "0 8px 32px rgba(0,0,0,0.04)", border: "1px solid #f1f5f9", width: "100%" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 20, color: "#1a5caa", fontWeight: 700, fontSize: 18 }}>
                          <span>✨</span> Your Guidance Summary
                        </div>
                        
                        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 16 }}>
                          
                          {/* Rights Column */}
                          <div style={{ backgroundColor: "#f8fafc", padding: 20, borderRadius: 16, border: "1px solid #f1f5f9" }}>
                            <div style={{ fontWeight: 600, color: "#0f172a", marginBottom: 12, display: "flex", alignItems: "center", gap: 8 }}>
                              <span style={{ color: "#3b82f6" }}>🛡️</span> Your Possible Rights
                            </div>
                            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                              {msg.guidance.rights.map((r, i) => (
                                <div key={i} style={{ display: "flex", gap: 8, fontSize: 13, color: "#475569" }}>
                                  <span style={{ color: "#3b82f6", flexShrink: 0 }}>✓</span> <span>{r.text}</span>
                                </div>
                              ))}
                            </div>
                            <div style={{ marginTop: 16, color: "#3b82f6", fontSize: 13, fontWeight: 500, cursor: "pointer" }}>Learn more →</div>
                          </div>

                          {/* Steps Column */}
                          <div style={{ backgroundColor: "#f8fafc", padding: 20, borderRadius: 16, border: "1px solid #f1f5f9" }}>
                            <div style={{ fontWeight: 600, color: "#0f172a", marginBottom: 12, display: "flex", alignItems: "center", gap: 8 }}>
                              <span style={{ color: "#3b82f6" }}>📋</span> Recommended Steps
                            </div>
                            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                              {msg.guidance.steps.map((s, i) => (
                                <div key={i} style={{ display: "flex", gap: 8, fontSize: 13, color: "#475569", alignItems: "flex-start" }}>
                                  <div style={{ width: 18, height: 18, borderRadius: "50%", backgroundColor: "#3b82f6", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 700, flexShrink: 0, marginTop: 2 }}>{i+1}</div>
                                  <span>{s.text}</span>
                                </div>
                              ))}
                            </div>
                            <div style={{ marginTop: 16, color: "#3b82f6", fontSize: 13, fontWeight: 500, cursor: "pointer" }}>See details →</div>
                          </div>

                          {/* Attachments Column */}
                          <div style={{ backgroundColor: "#f8fafc", padding: 20, borderRadius: 16, border: "1px solid #f1f5f9" }}>
                            <div style={{ fontWeight: 600, color: "#0f172a", marginBottom: 12, display: "flex", alignItems: "center", gap: 8 }}>
                              <span style={{ color: "#3b82f6" }}>📎</span> Attach Documents
                            </div>
                            
                            <div style={{ border: "1px dashed #cbd5e1", borderRadius: 12, padding: "16px 0", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", backgroundColor: "#fff", marginBottom: 12, cursor: "pointer" }}>
                              <span style={{ color: "#3b82f6", fontSize: 20, marginBottom: 4 }}>↑</span>
                              <div style={{ fontSize: 13, fontWeight: 600, color: "#0f172a" }}>Upload files</div>
                              <div style={{ fontSize: 10, color: "#94a3b8" }}>PDF, JPG, PNG (Max 10MB)</div>
                            </div>

                            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                              {msg.guidance.suggestedDocs.map((doc, i) => (
                                <div key={i} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", backgroundColor: "#fff", border: "1px solid #e2e8f0", borderRadius: 8, padding: "8px 12px", fontSize: 12 }}>
                                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                                    <span style={{ color: doc.type.includes("pdf") ? "#ef4444" : "#22c55e" }}>📄</span>
                                    <span style={{ color: "#334155", fontWeight: 500 }}>{doc.name}</span>
                                  </div>
                                  <span style={{ color: "#cbd5e1", cursor: "pointer" }}>×</span>
                                </div>
                              ))}
                            </div>
                          </div>

                        </div>
                      </div>
                    )}
                    <div style={{ fontSize: 11, color: "#94a3b8", marginTop: 8 }}>{msg.timestamp}</div>
                  </div>
                </div>
              )}
            </div>
          ))}
          {loading && (
             <div style={{ display: "flex", gap: 16 }}>
               <div style={{ width: 40, height: 40, borderRadius: "50%", backgroundColor: "#1a5caa", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff" }}>🏛️</div>
               <div style={{ backgroundColor: "#fff", padding: "16px 20px", borderRadius: "4px 20px 20px 20px", border: "1px solid #f1f5f9" }}>
                 <div className="typing-indicator" style={{ display: "flex", gap: 4, height: 20, alignItems: "center" }}>
                   <span style={{ width: 6, height: 6, backgroundColor: "#cbd5e1", borderRadius: "50%", animation: "blink 1.4s infinite both" }}></span>
                   <span style={{ width: 6, height: 6, backgroundColor: "#cbd5e1", borderRadius: "50%", animation: "blink 1.4s infinite both 0.2s" }}></span>
                   <span style={{ width: 6, height: 6, backgroundColor: "#cbd5e1", borderRadius: "50%", animation: "blink 1.4s infinite both 0.4s" }}></span>
                 </div>
               </div>
             </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div style={{ padding: "0 40px 40px", position: "relative", zIndex: 1 }}>
          <div style={{ backgroundColor: "rgba(255, 255, 255, 0.8)", backdropFilter: "blur(12px)", border: "1px solid rgba(255,255,255,0.6)", borderRadius: 50, padding: "8px 8px 8px 24px", display: "flex", alignItems: "center", gap: 12, boxShadow: "0 8px 32px rgba(0,0,0,0.04)" }}>
            <span style={{ color: "#94a3b8", cursor: "pointer", fontSize: 20 }}>📎</span>
            <input 
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === "Enter" && handleSend()}
              placeholder="Describe what happened..."
              style={{ flex: 1, background: "transparent", border: "none", outline: "none", fontSize: 15, color: "#0f172a" }}
            />
            <button 
              onClick={handleSend}
              disabled={loading || !input.trim()}
              style={{ width: 44, height: 44, borderRadius: "50%", backgroundColor: input.trim() && !loading ? "#f5c842" : "#e2e8f0", border: "none", display: "flex", alignItems: "center", justifyContent: "center", cursor: input.trim() && !loading ? "pointer" : "not-allowed", transition: "background 0.2s", color: "#fff", fontSize: 18 }}
            >
              ➤
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
