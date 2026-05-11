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
          AI-Powered Business Brokerage
        </div>

        <h1 className="font-display text-3xl md:text-5xl lg:text-6xl font-bold leading-tight mb-3">
          5 Intelligent Agents
          <br />
          <span
            className="text-2xl md:text-4xl italic"
            style={{ color: "rgba(255,255,255,0.5)" }}
          >
            for Business M&A Workflows
          </span>
        </h1>

        <p className="text-white/45 text-sm md:text-base max-w-xl mx-auto mb-2">
          Each agent is powered by Claude AI. Click any agent to start an
          interactive conversation.
        </p>
      </div>

      {/* Agent Grid */}
      <div className="max-w-5xl mx-auto px-5 pb-20">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {AGENTS.map((agent, index) => (
            <Link
              key={agent.id}
              href={`/agents/${agent.id}`}
              className="card-hover block"
              style={{
                animation: `fadeSlideIn 0.4s ease ${index * 0.08}s both`,
              }}
            >
              <div
                className="relative overflow-hidden rounded-2xl p-6 transition-all duration-300"
                style={{
                  background: "rgba(255,255,255,0.03)",
                  border: `1px solid ${agent.color}33`,
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = `${agent.color}10`;
                  e.currentTarget.style.borderColor = `${agent.color}66`;
                  e.currentTarget.style.boxShadow = `0 20px 40px ${agent.color}20`;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "rgba(255,255,255,0.03)";
                  e.currentTarget.style.borderColor = `${agent.color}33`;
                  e.currentTarget.style.boxShadow = "none";
                }}
              >
                {/* Decorative Glow */}
                <div
                  className="absolute top-0 right-0 w-32 h-32 rounded-full"
                  style={{
                    background: `radial-gradient(circle, ${agent.color}15, transparent 70%)`,
                    transform: "translate(30%, -30%)",
                  }}
                />

                {/* Header */}
                <div className="flex items-center gap-3 mb-4 relative z-10">
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl"
                    style={{
                      background: `${agent.color}18`,
                      border: `2px solid ${agent.color}55`,
                    }}
                  >
                    {agent.icon}
                  </div>
                  <div
                    className="text-xs font-bold tracking-wider uppercase"
                    style={{ color: agent.color }}
                  >
                    Agent {index + 1}
                  </div>
                </div>

                {/* Content */}
                <div className="relative z-10">
                  <h3 className="font-display text-lg font-bold mb-2">
                    {agent.name}
                  </h3>
                  <p className="text-sm text-white/45 leading-relaxed mb-5">
                    {agent.description}
                  </p>

                  {/* CTA */}
                  <div
                    className="flex items-center gap-2 text-sm font-semibold"
                    style={{ color: agent.color }}
                  >
                    Launch Agent
                    <span className="text-base">→</span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Architecture Card */}
        <div
          className="mt-6 rounded-2xl p-6"
          style={{
            background: "rgba(255,255,255,0.02)",
            border: "1px solid rgba(255,255,255,0.08)",
          }}
        >
          <div className="text-xs font-bold tracking-widest uppercase text-white/30 mb-4">
            Recommended Architecture
          </div>
          <div className="flex items-center gap-2 flex-wrap text-xs md:text-sm">
            {[
              "Website Form",
              "→",
              "Airtable / HubSpot CRM",
              "→",
              "AI Agent Workflow",
              "→",
              "Email / WhatsApp",
              "→",
              "Admin Approval",
              "→",
              "Listing Published",
            ].map((step, i) => (
              <span
                key={i}
                className={
                  step === "→"
                    ? "text-white/20 text-lg"
                    : "bg-white/6 px-3 py-1.5 rounded-lg font-semibold"
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
