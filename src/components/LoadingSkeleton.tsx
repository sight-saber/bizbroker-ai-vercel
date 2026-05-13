"use client";

interface LoadingSkeletonProps {
  className?: string;
  style?: React.CSSProperties;
}

export function LoadingSkeleton({ className = "", style = {} }: LoadingSkeletonProps) {
  return (
    <div
      className={`animate-pulse rounded-lg ${className}`}
      style={{
        background: "linear-gradient(90deg, rgba(255,255,255,0.03) 25%, rgba(255,255,255,0.08) 50%, rgba(255,255,255,0.03) 75%)",
        backgroundSize: "200% 100%",
        animation: "shimmer 2s infinite",
        ...style,
      }}
    />
  );
}

export function ValuationSkeleton({ agentColor }: { agentColor: string }) {
  return (
    <div
      className="rounded-2xl p-6 mb-4 border"
      style={{
        background: "rgba(255,255,255,0.03)",
        borderColor: `${agentColor}44`,
      }}
    >
      <div className="flex items-center justify-between mb-4">
        <LoadingSkeleton className="h-6 w-40" />
        <div className="flex gap-2">
          <LoadingSkeleton className="h-10 w-24" />
          <LoadingSkeleton className="h-10 w-32" />
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="p-4 rounded-lg" style={{ background: "rgba(255,255,255,0.05)" }}>
            <LoadingSkeleton className="h-4 w-24 mb-2" />
            <LoadingSkeleton className="h-8 w-32" />
          </div>
        ))}
      </div>

      <LoadingSkeleton className="h-4 w-full" />
    </div>
  );
}
