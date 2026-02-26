import { AlertTriangle, Radio, Move, Signal, ShieldAlert, Zap } from "lucide-react";
import type { ThreatEvent } from "../data/mock";

interface ThreatFeedProps {
  threats: ThreatEvent[];
}

const typeConfig: Record<string, { icon: typeof AlertTriangle; label: string }> = {
  intercept: { icon: Radio, label: "INTERCEPT" },
  movement: { icon: Move, label: "MOVEMENT" },
  signal: { icon: Signal, label: "SIGNAL" },
  breach: { icon: ShieldAlert, label: "BREACH" },
  anomaly: { icon: Zap, label: "ANOMALY" },
};

const severityConfig: Record<string, { color: string; bg: string; border: string }> = {
  critical: { color: "text-destructive", bg: "bg-destructive/10", border: "border-destructive/30" },
  high: { color: "text-warning", bg: "bg-warning/10", border: "border-warning/30" },
  medium: { color: "text-cyan", bg: "bg-cyan/10", border: "border-cyan/30" },
  low: { color: "text-muted-foreground", bg: "bg-muted", border: "border-muted-foreground/30" },
};

export default function ThreatFeed({ threats }: ThreatFeedProps) {
  return (
    <div className="h-full flex flex-col">
      <div className="p-3 border-b border-border flex items-center justify-between">
        <div className="flex items-center gap-2">
          <AlertTriangle className="w-3.5 h-3.5 text-destructive" />
          <span className="text-[11px] font-semibold text-destructive tracking-wider">THREAT FEED</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-1.5 h-1.5 rounded-full bg-destructive animate-pulse" />
          <span className="text-[9px] text-destructive">LIVE</span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto scrollbar-hidden">
        {threats.map((threat, i) => {
          const type = typeConfig[threat.type];
          const sev = severityConfig[threat.severity];
          const Icon = type.icon;

          return (
            <div
              key={threat.id}
              className="p-3 border-b border-border/30 hover:bg-white/[0.02] transition-colors animate-fade-in-up"
              style={{ animationDelay: `${i * 80}ms` }}
            >
              <div className="flex items-start gap-2">
                <div className={`mt-0.5 p-1 rounded ${sev.bg} border ${sev.border}`}>
                  <Icon className={`w-3 h-3 ${sev.color}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <span className={`text-[8px] px-1 py-0.5 rounded font-bold ${sev.bg} ${sev.color} border ${sev.border}`}>
                        {threat.severity.toUpperCase()}
                      </span>
                      <span className="text-[8px] text-muted-foreground">{type.label}</span>
                    </div>
                    <span className="text-[9px] text-muted-foreground font-mono">{threat.timestamp}</span>
                  </div>
                  <p className="text-[10px] text-foreground/80 leading-relaxed">{threat.message}</p>
                  <div className="mt-1 text-[8px] text-muted-foreground">
                    SRC: {threat.source}
                    {threat.coordinates && (
                      <span className="ml-2">
                        LOC: {threat.coordinates.lat.toFixed(2)}°N {threat.coordinates.lng.toFixed(2)}°E
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
