"use client";

import Link from "next/link";
import { AGENTS } from "@/lib/agents";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Hero Section */}
      <div
        className="px-6 py-16 md:py-20 text-center"
        style={{
          background:
            "radial-gradient(ellipse at 50% 0%, rgba(0,212,170,0.12) 0%, transparent 70%)",
        }}
      >
        <div className="gradient-text text-xs md:text-sm font-bold tracking-widest uppercase mb-4">
          AI-Powered Business Valuation
        </div>

        <h1 className="font-display text-3xl md:text-5xl lg:text-6xl font-bold leading-tight mb-3">
          Business Valuation Agent
          <br />
          <span
            className="text-2xl md:text-4xl italic"
            style={{ color: "rgba(255,255,255,0.5)" }}
          >
            Powered by Claude AI
          </span>
        </h1>

        <p className="text-white/45 text-sm md:text-base max-w-xl mx-auto mb-2">
          Get professional business valuation estimates for Singapore SME businesses.
          Click below to start an interactive consultation.
        </p>
      </div>

      {/* Valuation Agent Card */}
      <div className="max-w-3xl mx-auto px-5 pb-20">
        {AGENTS.map((agent) => (
          <Link
            key={agent.id}
            href={`/agents/${agent.id}`}
            className="card-hover block"
          >
            <div
              className="relative overflow-hidden rounded-3xl p-10 md:p-12 transition-all duration-300"
              style={{
                background: "rgba(255,255,255,0.03)",
                border: `2px solid ${agent.color}33`,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = `${agent.color}10`;
                e.currentTarget.style.borderColor = `${agent.color}66`;
                e.currentTarget.style.boxShadow = `0 30px 60px ${agent.color}30`;
                e.currentTarget.style.transform = "translateY(-4px)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "rgba(255,255,255,0.03)";
                e.currentTarget.style.borderColor = `${agent.color}33`;
                e.currentTarget.style.boxShadow = "none";
                e.currentTarget.style.transform = "translateY(0)";
              }}
            >
              {/* Decorative Glow */}
              <div
                className="absolute top-0 right-0 w-64 h-64 rounded-full"
                style={{
                  background: `radial-gradient(circle, ${agent.color}20, transparent 70%)`,
                  transform: "translate(30%, -30%)",
                }}
              />

              {/* Header */}
              <div className="flex flex-col items-center text-center mb-8 relative z-10">
                <div
                  className="w-20 h-20 rounded-2xl flex items-center justify-center text-5xl mb-4"
                  style={{
                    background: `${agent.color}18`,
                    border: `3px solid ${agent.color}55`,
                  }}
                >
                  {agent.icon}
                </div>
                <div
                  className="text-xs font-bold tracking-wider uppercase mb-2"
                  style={{ color: agent.color }}
                >
                  AI-Powered Agent
                </div>
                <h3 className="font-display text-3xl md:text-4xl font-bold mb-3">
                  {agent.name}
                </h3>
                <p className="text-base md:text-lg text-white/60 leading-relaxed max-w-lg">
                  {agent.description}
                </p>
              </div>

              {/* Features */}
              <div className="relative z-10 mb-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                  {[
                    { icon: "💰", title: "Revenue & Profit Based", delay: "0s" },
                    { icon: "📈", title: "Industry Benchmarks", delay: "0.1s" },
                    { icon: "🎯", title: "Singapore SME Focus", delay: "0.2s" },
                  ].map((feature, idx) => (
                    <div
                      key={idx}
                      className="p-4 rounded-xl transition-all hover:scale-105 hover:bg-white/8"
                      style={{
                        background: "rgba(255,255,255,0.03)",
                        border: "1px solid rgba(255,255,255,0.05)",
                        animation: `fadeSlideIn 0.5s ease-out ${feature.delay} both`,
                      }}
                    >
                      <div className="text-2xl mb-2">{feature.icon}</div>
                      <div className="text-xs font-semibold text-white/80">{feature.title}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* CTA */}
              <div className="relative z-10 text-center">
                <div
                  className="inline-flex items-center gap-3 px-8 py-4 rounded-full text-base font-bold transition-all hover:scale-110 active:scale-95 shadow-lg"
                  style={{
                    background: `linear-gradient(135deg, ${agent.color}, ${agent.color}cc)`,
                    color: "#000",
                    boxShadow: `0 8px 32px ${agent.color}44`,
                  }}
                >
                  Start Valuation Consultation
                  <span className="text-xl">→</span>
                </div>
              </div>
            </div>
          </Link>
        ))}

        {/* How It Works */}
        <div
          className="mt-8 rounded-2xl p-8"
          style={{
            background: "rgba(255,255,255,0.02)",
            border: "1px solid rgba(255,255,255,0.08)",
          }}
        >
          <div className="text-sm font-bold tracking-widest uppercase text-white/30 mb-6 text-center">
            How It Works
          </div>
          <div className="flex items-center justify-center gap-3 flex-wrap text-sm">
            {[
              "📝 Share Business Info",
              "→",
              "🤖 AI Analysis",
              "→",
              "📊 Get Valuation Report",
              "→",
              "💡 Pricing Insights",
            ].map((step, i) => (
              <span
                key={i}
                className={
                  step === "→"
                    ? "text-white/20 text-xl"
                    : "bg-white/6 px-4 py-2 rounded-lg font-semibold"
                }
              >
                {step}
              </span>
            ))}
          </div>
        </div>

        {/* Dashboard Link */}
        <div className="mt-6 text-center">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 text-sm text-white/50 hover:text-white/80 transition-colors"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
              />
            </svg>
            Admin Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
