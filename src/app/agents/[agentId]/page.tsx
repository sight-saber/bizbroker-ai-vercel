"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter, useParams } from "next/navigation";
import { getAgentById } from "@/lib/agents";
import type { Message, AgentId } from "@/types";

// Typing Indicator Component
function TypingIndicator({ color }: { color: string }) {
  return (
    <div className="flex gap-1 p-3 items-center">
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          className="w-2 h-2 rounded-full"
          style={{
            background: color,
            animation: `bounce 1.2s ease-in-out ${i * 0.2}s infinite`,
          }}
        />
      ))}
    </div>
  );
}

// Chat Bubble Component
function ChatBubble({
  message,
  agentColor,
}: {
  message: Message;
  agentColor: string;
}) {
  const isUser = message.role === "user";

  // Simple markdown rendering
  const renderContent = (content: string) => {
    // Convert markdown to basic HTML
    let html = content
      // Bold
      .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
      // Headers
      .replace(/^### (.*$)/gim, "<h3>$1</h3>")
      .replace(/^## (.*$)/gim, "<h2>$1</h2>")
      .replace(/^# (.*$)/gim, "<h1>$1</h1>")
      // Horizontal rule
      .replace(/^---$/gim, "<hr />")
      // Lists (simple)
      .replace(/^\- (.*$)/gim, "<li>$1</li>")
      // Line breaks
      .replace(/\n/g, "<br />");

    // Wrap lists (using [\s\S] instead of . with s flag for compatibility)
    html = html.replace(/(<li>[\s\S]*?<\/li>)/gi, "<ul>$1</ul>");

    return html;
  };

  return (
    <div
      className={`flex ${isUser ? "justify-end" : "justify-start"} mb-3 fade-slide-in`}
    >
      {!isUser && (
        <div
          className="w-8 h-8 rounded-full flex items-center justify-center text-sm mr-2 flex-shrink-0 mt-0.5"
          style={{
            background: `${agentColor}22`,
            border: `2px solid ${agentColor}`,
          }}
        >
          🤖
        </div>
      )}

      <div
        className="max-w-[75%] px-3.5 py-2.5 text-sm leading-relaxed markdown-content"
        style={{
          borderRadius: isUser
            ? "18px 18px 4px 18px"
            : "18px 18px 18px 4px",
          background: isUser
            ? `linear-gradient(135deg, ${agentColor}, ${agentColor}cc)`
            : "rgba(255,255,255,0.06)",
          border: isUser ? "none" : "1px solid rgba(255,255,255,0.1)",
          color: "#fff",
        }}
        dangerouslySetInnerHTML={{ __html: renderContent(message.content) }}
      />
    </div>
  );
}

export default function AgentChatPage() {
  const params = useParams();
  const router = useRouter();
  const agentId = params.agentId as string;
  const agent = getAgentById(agentId as AgentId);

  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [started, setStarted] = useState(false);
  const [sessionId, setSessionId] = useState<string>("");
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  if (!agent) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-4">❌</div>
          <h1 className="text-xl font-bold mb-2">Agent Not Found</h1>
          <button
            onClick={() => router.push("/")}
            className="text-sm text-white/50 hover:text-white/80"
          >
            ← Back to Home
          </button>
        </div>
      </div>
    );
  }

  const startChat = async () => {
    setStarted(true);
    setLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          agentId: agent.id,
          messages: [{ role: "user", content: "Hello, I need your help." }],
        }),
      });

      const data = await response.json();
      setSessionId(data.sessionId);
      setMessages([{ role: "assistant", content: data.message }]);
    } catch (error) {
      console.error("Failed to start chat:", error);
      setMessages([
        {
          role: "assistant",
          content: "Sorry, I couldn't start the conversation. Please try again.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const sendMessage = async () => {
    if (!input.trim() || loading) return;

    const userMessage = input.trim();
    setInput("");

    const newMessages = [...messages, { role: "user" as const, content: userMessage }];
    setMessages(newMessages);
    setLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          agentId: agent.id,
          messages: newMessages,
          sessionId,
        }),
      });

      const data = await response.json();
      setMessages([...newMessages, { role: "assistant", content: data.message }]);
    } catch (error) {
      console.error("Failed to send message:", error);
      setMessages([
        ...newMessages,
        {
          role: "assistant",
          content: "Sorry, I couldn't respond. Please try again.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-background">
      {/* Header */}
      <div
        className="px-5 py-4 border-b flex items-center gap-3"
        style={{
          borderColor: `${agent.color}33`,
          background: `linear-gradient(135deg, #0A0A0F, ${agent.color}11)`,
        }}
      >
        <button
          onClick={() => router.push("/")}
          className="px-3 py-1.5 text-sm rounded-lg border transition-colors"
          style={{
            background: "rgba(255,255,255,0.08)",
            borderColor: "rgba(255,255,255,0.15)",
          }}
        >
          ← Back
        </button>

        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center text-xl"
          style={{
            background: `${agent.color}22`,
            border: `2px solid ${agent.color}`,
          }}
        >
          {agent.icon}
        </div>

        <div>
          <div className="font-display font-bold">{agent.name} Agent</div>
          <div className="text-xs" style={{ color: agent.color }}>
            {agent.description}
          </div>
        </div>

        <div className="ml-auto flex items-center gap-2 text-xs text-green-400">
          <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
          Active
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-5">
        {!started ? (
          <div className="flex flex-col items-center justify-center h-full gap-4">
            <div className="text-6xl">{agent.icon}</div>
            <div className="font-display text-2xl font-bold text-center">
              {agent.name} Agent
            </div>
            <div className="text-sm text-white/50 text-center max-w-xs">
              {agent.description}
            </div>
            <button
              onClick={startChat}
              className="mt-2 px-8 py-3 rounded-full font-bold text-sm transition-transform hover:scale-105"
              style={{
                background: `linear-gradient(135deg, ${agent.color}, ${agent.color}aa)`,
                color: "#000",
              }}
            >
              Start Conversation
            </button>
          </div>
        ) : (
          <>
            {messages.map((msg, i) => (
              <ChatBubble key={i} message={msg} agentColor={agent.color} />
            ))}
            {loading && (
              <div className="flex items-center gap-2">
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center text-sm"
                  style={{
                    background: `${agent.color}22`,
                    border: `2px solid ${agent.color}`,
                  }}
                >
                  🤖
                </div>
                <div
                  className="rounded-2xl border"
                  style={{
                    background: "rgba(255,255,255,0.06)",
                    borderColor: "rgba(255,255,255,0.1)",
                  }}
                >
                  <TypingIndicator color={agent.color} />
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </>
        )}
      </div>

      {/* Input */}
      {started && (
        <div
          className="p-3 border-t flex gap-2.5"
          style={{
            borderColor: "rgba(255,255,255,0.08)",
            background: "rgba(255,255,255,0.03)",
          }}
        >
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) =>
              e.key === "Enter" && !e.shiftKey && sendMessage()
            }
            placeholder="Type your message..."
            className="flex-1 px-4 py-2.5 rounded-xl text-sm outline-none"
            style={{
              background: "rgba(255,255,255,0.07)",
              border: `1px solid ${agent.color}44`,
            }}
            disabled={loading}
          />
          <button
            onClick={sendMessage}
            disabled={loading || !input.trim()}
            className="px-5 py-2.5 rounded-xl font-bold text-sm transition-all"
            style={{
              background:
                loading || !input.trim()
                  ? "rgba(255,255,255,0.1)"
                  : `linear-gradient(135deg, ${agent.color}, ${agent.color}cc)`,
              color: loading || !input.trim() ? "rgba(255,255,255,0.3)" : "#000",
              cursor: loading || !input.trim() ? "not-allowed" : "pointer",
            }}
          >
            Send
          </button>
        </div>
      )}
    </div>
  );
}
