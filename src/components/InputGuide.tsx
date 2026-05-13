"use client";

interface InputGuideProps {
  agentColor: string;
}

export function InputGuide({ agentColor }: InputGuideProps) {
  return (
    <div
      className="mb-4 rounded-xl p-6 border-2 fade-slide-in"
      style={{
        background: `linear-gradient(135deg, ${agentColor}08, ${agentColor}03)`,
        borderColor: `${agentColor}44`,
      }}
    >
      <div className="flex items-center gap-2 mb-4">
        <div
          className="w-8 h-8 rounded-lg flex items-center justify-center text-lg"
          style={{
            background: `${agentColor}22`,
            border: `2px solid ${agentColor}`,
          }}
        >
          📋
        </div>
        <h3 className="font-bold text-lg">Standard Input Format</h3>
      </div>

      <div className="space-y-3 text-sm">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div
            className="p-3 rounded-lg"
            style={{ background: "rgba(255,255,255,0.05)" }}
          >
            <div className="text-white/50 text-xs mb-1">Example Input:</div>
            <div className="space-y-1 font-mono text-xs">
              <div>
                <span className="text-white/40">Enterprise:</span>{" "}
                <span className="text-white/80">小龙坎火锅店</span>
              </div>
              <div>
                <span className="text-white/40">Industry:</span>{" "}
                <span className="text-white/80">F&B/Retail</span>
              </div>
              <div>
                <span className="text-white/40">Revenue:</span>{" "}
                <span className="text-white/80">SGD $1,200,000</span>
              </div>
              <div>
                <span className="text-white/40">Profit:</span>{" "}
                <span className="text-white/80">SGD $180,000</span>
              </div>
              <div>
                <span className="text-white/40">Years:</span>{" "}
                <span className="text-white/80">3 years</span>
              </div>
              <div>
                <span className="text-white/40">Assets:</span>{" "}
                <span className="text-white/80">SGD $150,000</span>
              </div>
              <div>
                <span className="text-white/40">Trend:</span>{" "}
                <span className="text-white/80">Growing</span>
              </div>
            </div>
          </div>

          <div
            className="p-3 rounded-lg"
            style={{ background: "rgba(255,255,255,0.05)" }}
          >
            <div className="text-white/50 text-xs mb-1">Expected Output:</div>
            <div className="space-y-1 text-xs">
              <div className="flex items-center gap-2">
                <span>🔻</span>
                <span className="text-white/40">Conservative:</span>
                <span className="font-bold" style={{ color: agentColor }}>
                  $396K
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span>⚖️</span>
                <span className="text-white/40">Fair Market:</span>
                <span className="font-bold" style={{ color: agentColor }}>
                  $466K
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span>🔺</span>
                <span className="text-white/40">Optimistic:</span>
                <span className="font-bold" style={{ color: agentColor }}>
                  $536K
                </span>
              </div>
              <div className="mt-2 pt-2 border-t border-white/10">
                <div className="text-white/60">
                  <div className="flex items-center gap-1 mb-1">
                    <span className="text-[10px]">📊</span>
                    <span className="text-[10px]">3-tier valuation</span>
                  </div>
                  <div className="flex items-center gap-1 mb-1">
                    <span className="text-[10px]">📄</span>
                    <span className="text-[10px]">PDF export</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="text-[10px]">💾</span>
                    <span className="text-[10px]">Save to history</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div
          className="p-3 rounded-lg text-xs"
          style={{ background: "rgba(255,255,255,0.03)" }}
        >
          <div className="font-semibold mb-2 flex items-center gap-2">
            <span>🏢</span>
            <span>Supported Industries:</span>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-white/60">
            <div>• F&B/Retail</div>
            <div>• Services</div>
            <div>• Tech/SaaS</div>
            <div>• Education</div>
            <div>• Manufacturing</div>
            <div>• E-commerce</div>
            <div>• Healthcare</div>
            <div>• More...</div>
          </div>
        </div>

        <div className="flex items-start gap-2 text-xs text-white/50">
          <span>💡</span>
          <div>
            <strong>Tip:</strong> AI will guide you step-by-step. Answer in any
            format (e.g., &quot;1.2 million&quot;, &quot;SGD 1,200,000&quot;, or &quot;1200k&quot;).
          </div>
        </div>
      </div>
    </div>
  );
}
