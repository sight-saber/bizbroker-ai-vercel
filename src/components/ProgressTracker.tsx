"use client";

interface ProgressTrackerProps {
  current: number;
  total: number;
  agentColor: string;
}

export function ProgressTracker({ current, total, agentColor }: ProgressTrackerProps) {
  const progress = Math.min((current / total) * 100, 100);

  return (
    <div className="mb-4">
      <div className="flex items-center justify-between mb-2">
        <div className="text-xs font-semibold text-white/60">
          Progress: {current} of {total} questions
        </div>
        <div className="text-xs font-bold" style={{ color: agentColor }}>
          {Math.round(progress)}%
        </div>
      </div>
      <div
        className="h-2 rounded-full overflow-hidden"
        style={{ background: "rgba(255,255,255,0.1)" }}
      >
        <div
          className="h-full transition-all duration-500 ease-out rounded-full"
          style={{
            width: `${progress}%`,
            background: `linear-gradient(90deg, ${agentColor}, ${agentColor}aa)`,
            boxShadow: `0 0 10px ${agentColor}66`,
          }}
        />
      </div>
    </div>
  );
}
