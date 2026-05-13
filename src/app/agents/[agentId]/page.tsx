"use client";

import { useState, useEffect, useRef, memo, useMemo, useCallback } from "react";
import { useRouter, useParams } from "next/navigation";
import { getAgentById } from "@/lib/agents";
import type { Message, AgentId, ValuationResult, ValuationRecord } from "@/types";
import { useToast } from "@/hooks/useToast";
import { ToastContainer } from "@/components/Toast";
import { ValuationSkeleton } from "@/components/LoadingSkeleton";
import { ProgressTracker } from "@/components/ProgressTracker";
import { apiCache } from "@/lib/cache";

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

// Chat Bubble Component (Memoized)
const ChatBubble = memo(function ChatBubble({
  message,
  agentColor,
}: {
  message: Message;
  agentColor: string;
}) {
  const isUser = message.role === "user";

  // Simple markdown rendering
  const renderContent = (content: string) => {
    let html = content
      .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
      .replace(/^### (.*$)/gim, "<h3>$1</h3>")
      .replace(/^## (.*$)/gim, "<h2>$1</h2>")
      .replace(/^# (.*$)/gim, "<h1>$1</h1>")
      .replace(/^---$/gim, "<hr />")
      .replace(/^\- (.*$)/gim, "<li>$1</li>")
      .replace(/\n/g, "<br />");

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
});

// Valuation Result Display Component (Memoized)
const ValuationDisplay = memo(function ValuationDisplay({
  valuation,
  agentColor,
  onSave,
  onExport,
  saving,
}: {
  valuation: ValuationResult;
  agentColor: string;
  onSave: () => void;
  onExport: () => void;
  saving: boolean;
}) {
  const [isExpanded, setIsExpanded] = useState(true);

  return (
    <div
      className="rounded-2xl p-6 mb-4 border fade-slide-in"
      style={{
        background: `linear-gradient(135deg, rgba(255,255,255,0.05), rgba(255,255,255,0.02))`,
        borderColor: `${agentColor}66`,
        boxShadow: `0 8px 32px ${agentColor}22`,
        animation: "slideInUp 0.5s ease-out",
      }}
    >
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center text-xl"
            style={{
              background: `${agentColor}22`,
              border: `2px solid ${agentColor}`,
            }}
          >
            📊
          </div>
          <div>
            <h3 className="text-lg font-bold">Valuation Result</h3>
            <p className="text-xs text-white/50">
              {valuation.input.businessName || "Business Valuation"}
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <button
            onClick={onSave}
            disabled={saving}
            className="px-4 py-2 rounded-lg text-sm font-semibold transition-all hover:scale-105 active:scale-95"
            style={{
              background: saving ? "rgba(255,255,255,0.1)" : `linear-gradient(135deg, ${agentColor}, ${agentColor}cc)`,
              border: `1px solid ${agentColor}`,
              color: saving ? "rgba(255,255,255,0.5)" : "#000",
              cursor: saving ? "not-allowed" : "pointer",
            }}
          >
            {saving ? (
              <>
                <span className="inline-block animate-spin mr-2">⏳</span>
                Saving...
              </>
            ) : (
              "💾 Save"
            )}
          </button>
          <button
            onClick={onExport}
            className="px-4 py-2 rounded-lg text-sm font-semibold transition-all hover:scale-105 active:scale-95"
            style={{
              background: `${agentColor}33`,
              border: `1px solid ${agentColor}`,
              color: "#fff",
            }}
          >
            📄 Export PDF
          </button>
        </div>
      </div>

      {/* Main Valuations - 3 Tiers */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {[
          { label: "Conservative", value: valuation.conservative, icon: "🔻", opacity: "0.7" },
          { label: "Fair Market", value: valuation.fairMarket, icon: "⚖️", opacity: "1" },
          { label: "Optimistic", value: valuation.optimistic, icon: "🔺", opacity: "0.7" },
        ].map((tier, idx) => (
          <div
            key={tier.label}
            className="relative p-5 rounded-xl transition-all hover:scale-105"
            style={{
              background: idx === 1
                ? `linear-gradient(135deg, ${agentColor}22, ${agentColor}11)`
                : "rgba(255,255,255,0.05)",
              border: idx === 1
                ? `2px solid ${agentColor}`
                : "1px solid rgba(255,255,255,0.1)",
              animation: `scaleIn 0.5s ease-out ${idx * 0.1}s both`,
            }}
          >
            {idx === 1 && (
              <div
                className="absolute -top-2 -right-2 px-2 py-1 rounded-full text-[10px] font-bold"
                style={{
                  background: `linear-gradient(135deg, ${agentColor}, ${agentColor}cc)`,
                  color: "#000",
                }}
              >
                RECOMMENDED
              </div>
            )}
            <div className="flex items-center justify-between mb-2">
              <span className="text-2xl">{tier.icon}</span>
              {idx === 1 && (
                <div className="flex gap-0.5">
                  {[1,2,3].map(i => (
                    <div
                      key={i}
                      className="w-1.5 h-1.5 rounded-full"
                      style={{ background: agentColor }}
                    />
                  ))}
                </div>
              )}
            </div>
            <div className="text-xs text-white/60 font-semibold mb-1 uppercase tracking-wide">
              {tier.label}
            </div>
            <div
              className="text-2xl md:text-3xl font-bold font-mono"
              style={{ color: agentColor, opacity: tier.opacity }}
            >
              ${tier.value.toLocaleString("en-SG", { maximumFractionDigits: 0 })}
            </div>
            <div className="text-[10px] text-white/40 mt-1">SGD</div>
          </div>
        ))}
      </div>

      {/* Methodology Details */}
      <div
        className="rounded-xl p-4 mb-4 cursor-pointer transition-all hover:bg-white/5"
        style={{
          background: "rgba(255,255,255,0.03)",
          border: "1px solid rgba(255,255,255,0.08)",
        }}
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center justify-between">
          <div className="text-sm font-semibold text-white/80">
            📐 Methodology ({valuation.methods.length} methods)
          </div>
          <div className="text-xl transition-transform" style={{
            transform: isExpanded ? "rotate(180deg)" : "rotate(0deg)",
          }}>
            ▼
          </div>
        </div>

        {isExpanded && (
          <div className="mt-4 space-y-2 fade-slide-in">
            {valuation.methods.map((method, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between py-2 px-3 rounded-lg"
                style={{ background: "rgba(255,255,255,0.03)" }}
              >
                <span className="text-sm text-white/70">{method.method}</span>
                <div className="flex items-center gap-3">
                  <span className="text-xs text-white/50">
                    Weight: {(method.weight * 100).toFixed(0)}%
                  </span>
                  <span className="text-sm font-mono font-bold" style={{ color: agentColor }}>
                    ${method.value.toLocaleString("en-SG", { maximumFractionDigits: 0 })}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Insights */}
      {(valuation.positiveFactors.length > 0 || valuation.riskFactors.length > 0) && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {valuation.positiveFactors.length > 0 && (
            <div
              className="p-4 rounded-xl"
              style={{
                background: "rgba(0,212,170,0.08)",
                border: "1px solid rgba(0,212,170,0.2)",
              }}
            >
              <div className="text-sm font-semibold mb-2 flex items-center gap-2">
                <span>✅</span>
                <span>Strengths</span>
              </div>
              <ul className="text-xs text-white/70 space-y-1">
                {valuation.positiveFactors.slice(0, 3).map((factor, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-green-400 mt-0.5">•</span>
                    <span>{factor}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {valuation.riskFactors.length > 0 && (
            <div
              className="p-4 rounded-xl"
              style={{
                background: "rgba(255,107,53,0.08)",
                border: "1px solid rgba(255,107,53,0.2)",
              }}
            >
              <div className="text-sm font-semibold mb-2 flex items-center gap-2">
                <span>⚠️</span>
                <span>Risk Factors</span>
              </div>
              <ul className="text-xs text-white/70 space-y-1">
                {valuation.riskFactors.slice(0, 3).map((factor, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-orange-400 mt-0.5">•</span>
                    <span>{factor}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
});

// History Modal Component (Memoized)
const HistoryModal = memo(function HistoryModal({
  history,
  onClose,
  agentColor,
}: {
  history: ValuationRecord[];
  onClose: () => void;
  agentColor: string;
}) {
  const [sortBy, setSortBy] = useState<"date" | "value">("date");
  const [filterIndustry, setFilterIndustry] = useState<string>("all");

  const industries = ["all", ...Array.from(new Set(history.map(h => h.input.industry)))];

  const filteredHistory = history
    .filter(h => filterIndustry === "all" || h.input.industry === filterIndustry)
    .sort((a, b) => {
      if (sortBy === "date") {
        return new Date(b.created).getTime() - new Date(a.created).getTime();
      }
      return b.fairMarket - a.fairMarket;
    });

  return (
    <div
      className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-50 p-4"
      onClick={onClose}
      style={{ animation: "fadeIn 0.2s ease-out" }}
    >
      <div
        className="bg-background rounded-2xl max-w-5xl w-full max-h-[85vh] overflow-hidden border-2 shadow-2xl"
        style={{
          borderColor: agentColor,
          animation: "scaleIn 0.3s ease-out",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          className="p-6 border-b flex items-center justify-between"
          style={{
            borderColor: `${agentColor}33`,
            background: `linear-gradient(135deg, ${agentColor}11, transparent)`,
          }}
        >
          <div className="flex items-center gap-3">
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl"
              style={{
                background: `${agentColor}22`,
                border: `2px solid ${agentColor}`,
              }}
            >
              📚
            </div>
            <div>
              <h2 className="text-xl font-bold">Valuation History</h2>
              <p className="text-sm text-white/50">
                {filteredHistory.length} {filteredHistory.length === 1 ? "record" : "records"} found
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-10 h-10 rounded-xl flex items-center justify-center text-2xl hover:bg-white/10 transition-colors"
          >
            ×
          </button>
        </div>

        {/* Filters */}
        {history.length > 0 && (
          <div
            className="p-4 border-b flex items-center gap-4"
            style={{ borderColor: "rgba(255,255,255,0.08)" }}
          >
            <div className="flex items-center gap-2">
              <span className="text-sm text-white/60">Sort by:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as "date" | "value")}
                className="px-3 py-1.5 rounded-lg text-sm outline-none cursor-pointer"
                style={{
                  background: "rgba(255,255,255,0.08)",
                  border: `1px solid ${agentColor}44`,
                }}
              >
                <option value="date">Latest First</option>
                <option value="value">Highest Value</option>
              </select>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-sm text-white/60">Industry:</span>
              <select
                value={filterIndustry}
                onChange={(e) => setFilterIndustry(e.target.value)}
                className="px-3 py-1.5 rounded-lg text-sm outline-none cursor-pointer"
                style={{
                  background: "rgba(255,255,255,0.08)",
                  border: `1px solid ${agentColor}44`,
                }}
              >
                {industries.map(ind => (
                  <option key={ind} value={ind}>
                    {ind === "all" ? "All Industries" : ind}
                  </option>
                ))}
              </select>
            </div>
          </div>
        )}

        {/* Records */}
        <div className="overflow-y-auto p-6" style={{ maxHeight: "calc(85vh - 200px)" }}>
          {filteredHistory.length === 0 ? (
            <div className="text-center py-16">
              <div className="text-6xl mb-4 opacity-20">📊</div>
              <div className="text-lg text-white/50 mb-2">No valuation history found</div>
              <div className="text-sm text-white/30">
                {filterIndustry !== "all"
                  ? "Try selecting a different industry filter"
                  : "Start a new valuation to see records here"}
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredHistory.map((record, idx) => (
                <div
                  key={record.id}
                  className="rounded-xl border p-5 hover:scale-[1.02] transition-all cursor-pointer"
                  style={{
                    background: "rgba(255,255,255,0.03)",
                    borderColor: "rgba(255,255,255,0.1)",
                    animation: `fadeSlideIn 0.3s ease-out ${idx * 0.05}s both`,
                  }}
                >
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                      <div className="font-bold text-lg mb-1">
                        {record.input.businessName || "Unnamed Business"}
                      </div>
                      <div className="flex items-center gap-2 text-xs text-white/50">
                        <span>📅 {new Date(record.created).toLocaleDateString("en-SG", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}</span>
                        <span>•</span>
                        <span className="px-2 py-0.5 rounded-full" style={{
                          background: `${agentColor}22`,
                          color: agentColor,
                        }}>
                          {record.input.industry}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Valuation Summary */}
                  <div
                    className="rounded-lg p-3 mb-3"
                    style={{
                      background: `linear-gradient(135deg, ${agentColor}15, ${agentColor}08)`,
                      border: `1px solid ${agentColor}33`,
                    }}
                  >
                    <div className="text-xs text-white/50 mb-1">Fair Market Value</div>
                    <div className="text-2xl font-bold font-mono" style={{ color: agentColor }}>
                      ${record.fairMarket.toLocaleString("en-SG", { maximumFractionDigits: 0 })}
                    </div>
                    <div className="text-[10px] text-white/40">SGD</div>
                  </div>

                  {/* Business Metrics */}
                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div>
                      <div className="text-white/40 mb-1">Annual Revenue</div>
                      <div className="font-semibold">
                        ${record.input.annualRevenue.toLocaleString("en-SG", { maximumFractionDigits: 0 })}
                      </div>
                    </div>
                    <div>
                      <div className="text-white/40 mb-1">Net Profit</div>
                      <div className="font-semibold">
                        ${record.input.netProfit.toLocaleString("en-SG", { maximumFractionDigits: 0 })}
                      </div>
                    </div>
                    <div>
                      <div className="text-white/40 mb-1">Years Operating</div>
                      <div className="font-semibold">
                        {record.input.yearsInOperation} {record.input.yearsInOperation === 1 ? "year" : "years"}
                      </div>
                    </div>
                    <div>
                      <div className="text-white/40 mb-1">Growth Trend</div>
                      <div className="font-semibold capitalize">
                        {record.input.growthTrend === "growing" ? "📈" : record.input.growthTrend === "stable" ? "➡️" : "📉"}
                        {" "}{record.input.growthTrend}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
});

export default function AgentChatPage() {
  const params = useParams();
  const router = useRouter();
  const agentId = params.agentId as string;
  const agent = getAgentById(agentId as AgentId);
  const toast = useToast();

  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [started, setStarted] = useState(false);
  const [sessionId, setSessionId] = useState<string>("");
  const [valuationResult, setValuationResult] = useState<ValuationResult | null>(null);
  const [processing, setProcessing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [history, setHistory] = useState<ValuationRecord[]>([]);
  const bottomRef = useRef<HTMLDivElement>(null);

  const TOTAL_QUESTIONS = 7; // Expected number of questions in the conversation
  const userMessageCount = messages.filter(m => m.role === "user").length;

  // Define all hooks before any conditional returns
  const startChat = useCallback(async () => {
    if (!agent) return;

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
  }, [agent]);

  const sendMessage = useCallback(async () => {
    if (!agent || !input.trim() || loading) return;

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
  }, [agent, input, loading, messages, sessionId]);

  const calculateValuation = useCallback(async () => {
    setProcessing(true);
    toast.info("Analyzing conversation data...");

    try {
      // Step 1: Extract data from conversation
      const extractResponse = await fetch("/api/valuation/extract", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages }),
      });

      const extractData = await extractResponse.json();
      if (!extractData.success) {
        toast.error("Could not extract valuation data. Please provide all required information.");
        setProcessing(false);
        return;
      }

      toast.info("Calculating valuation...");

      // Step 2: Calculate valuation
      const calcResponse = await fetch("/api/valuation/calculate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(extractData.data),
      });

      const calcData = await calcResponse.json();
      if (calcData.success) {
        setValuationResult(calcData.data);
        toast.success("Valuation calculated successfully!");
      } else {
        toast.error("Failed to calculate: " + calcData.error);
      }
    } catch (error) {
      console.error("Valuation error:", error);
      toast.error("An error occurred while calculating valuation");
    } finally {
      setProcessing(false);
    }
  }, [messages, toast]);

  const saveValuation = useCallback(async () => {
    if (!valuationResult) return;

    setSaving(true);
    try {
      const response = await fetch("/api/valuation/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(valuationResult),
      });

      const data = await response.json();
      if (data.success) {
        toast.success("Valuation saved successfully!");
      } else {
        toast.error("Failed to save: " + data.error);
      }
    } catch (error) {
      console.error("Save error:", error);
      toast.error("An error occurred while saving");
    } finally {
      setSaving(false);
    }
  }, [valuationResult, toast]);

  const exportPDF = useCallback(async () => {
    if (!valuationResult) return;

    toast.info("Generating PDF report...");

    try {
      const response = await fetch("/api/valuation/export-pdf", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(valuationResult),
      });

      const html = await response.text();
      const printWindow = window.open("", "_blank");
      if (printWindow) {
        printWindow.document.write(html);
        printWindow.document.close();
        setTimeout(() => printWindow.print(), 500);
        toast.success("PDF report opened in new window");
      } else {
        toast.warning("Please allow popups to export PDF");
      }
    } catch (error) {
      console.error("Export error:", error);
      toast.error("Failed to export PDF");
    }
  }, [valuationResult, toast]);

  const loadHistory = useCallback(async () => {
    // Check cache first
    const cacheKey = "valuation-history";
    const cached = apiCache.get<ValuationRecord[]>(cacheKey);

    if (cached) {
      setHistory(cached);
      setShowHistory(true);
      toast.success(`Loaded ${cached.length} records from cache`);
      return;
    }

    toast.info("Loading history...");
    try {
      const response = await fetch("/api/valuation/history");
      const data = await response.json();
      if (data.success) {
        setHistory(data.data.valuations);
        setShowHistory(true);
        // Cache for 5 minutes
        apiCache.set(cacheKey, data.data.valuations, 300000);
        toast.success(`Loaded ${data.data.valuations.length} records`);
      } else {
        toast.error("Failed to load history");
      }
    } catch (error) {
      console.error("History error:", error);
      toast.error("Failed to load history");
    }
  }, [toast]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  // Early return after all hooks
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

  return (
    <div className="flex flex-col h-screen bg-background">
      {/* Toast Container */}
      <ToastContainer toasts={toast.toasts} removeToast={toast.removeToast} />

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
          className="px-3 py-1.5 text-sm rounded-lg border transition-all hover:scale-105 active:scale-95"
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

        <div className="ml-auto flex items-center gap-2">
          {started && messages.length > 2 && (
            <>
              <button
                onClick={calculateValuation}
                disabled={processing || valuationResult !== null}
                className="px-4 py-2 text-sm rounded-lg font-semibold transition-all hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                style={{
                  background: processing || valuationResult !== null
                    ? "rgba(255,255,255,0.1)"
                    : `linear-gradient(135deg, ${agent.color}, ${agent.color}cc)`,
                  border: `1px solid ${agent.color}`,
                  color: processing || valuationResult !== null ? "rgba(255,255,255,0.5)" : "#000",
                }}
              >
                {processing ? (
                  <>
                    <span className="inline-block animate-spin mr-2">⏳</span>
                    Processing...
                  </>
                ) : valuationResult ? (
                  "✓ Calculated"
                ) : (
                  "🧮 Calculate"
                )}
              </button>
              <button
                onClick={loadHistory}
                className="px-4 py-2 text-sm rounded-lg font-semibold transition-all hover:scale-105 active:scale-95"
                style={{
                  background: `${agent.color}22`,
                  border: `1px solid ${agent.color}44`,
                }}
              >
                📚 History
              </button>
            </>
          )}
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-5">
        {!started ? (
          <div className="flex flex-col items-center justify-center h-full gap-4">
            <div
              className="text-6xl mb-2"
              style={{ animation: "scaleIn 0.5s ease-out" }}
            >
              {agent.icon}
            </div>
            <div className="font-display text-2xl font-bold text-center">
              {agent.name} Agent
            </div>
            <div className="text-sm text-white/50 text-center max-w-xs">
              {agent.description}
            </div>
            <button
              onClick={startChat}
              className="mt-2 px-8 py-3 rounded-full font-bold text-sm transition-all hover:scale-110 active:scale-95 shadow-lg"
              style={{
                background: `linear-gradient(135deg, ${agent.color}, ${agent.color}aa)`,
                color: "#000",
                boxShadow: `0 8px 24px ${agent.color}44`,
              }}
            >
              Start Conversation
            </button>
          </div>
        ) : (
          <>
            {/* Progress Tracker */}
            {userMessageCount > 0 && userMessageCount < TOTAL_QUESTIONS && !valuationResult && (
              <ProgressTracker
                current={userMessageCount}
                total={TOTAL_QUESTIONS}
                agentColor={agent.color}
              />
            )}

            {messages.map((msg, i) => (
              <ChatBubble key={i} message={msg} agentColor={agent.color} />
            ))}

            {loading && (
              <div className="flex items-center gap-2 fade-slide-in">
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

            {/* Processing Skeleton */}
            {processing && !valuationResult && (
              <ValuationSkeleton agentColor={agent.color} />
            )}

            {/* Valuation Result */}
            {valuationResult && (
              <ValuationDisplay
                valuation={valuationResult}
                agentColor={agent.color}
                onSave={saveValuation}
                onExport={exportPDF}
                saving={saving}
              />
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

      {/* History Modal */}
      {showHistory && (
        <HistoryModal
          history={history}
          onClose={() => setShowHistory(false)}
          agentColor={agent.color}
        />
      )}
    </div>
  );
}
