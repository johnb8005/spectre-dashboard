import { Satellite, Clock } from "lucide-react";
import type { SatellitePass } from "../data/mock";

interface SatellitePanelProps {
  passes: SatellitePass[];
}

const typeColor: Record<string, string> = {
  SIGINT: "text-cyan",
  IMINT: "text-gold",
  ELINT: "text-warning",
  COMINT: "text-success",
};

const statusStyle: Record<string, { color: string; bg: string }> = {
  scheduled: { color: "text-muted-foreground", bg: "bg-muted" },
  active: { color: "text-success", bg: "bg-success/10" },
  completed: { color: "text-cyan", bg: "bg-cyan/10" },
};

export default function SatellitePanel({ passes }: SatellitePanelProps) {
  return (
    <div className="h-full flex flex-col">
      <div className="p-3 border-b border-border flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Satellite className="w-3.5 h-3.5 text-cyan" />
          <span className="text-[11px] font-semibold text-cyan tracking-wider">SATELLITE PASSES</span>
        </div>
        <span className="text-[10px] text-muted-foreground">{passes.length} SCHEDULED</span>
      </div>

      <div className="flex-1 overflow-y-auto scrollbar-hidden p-2 space-y-2">
        {passes.map((pass, i) => {
          const st = statusStyle[pass.status];

          return (
            <div
              key={pass.id}
              className="p-2.5 rounded border border-border/50 bg-muted/30 hover:bg-white/[0.02] transition-colors animate-fade-in-up"
              style={{ animationDelay: `${i * 70}ms` }}
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[10px] font-bold tracking-wider">{pass.designation}</span>
                <span className={`text-[8px] px-1.5 py-0.5 rounded ${st.bg} ${st.color} font-semibold`}>
                  {pass.status.toUpperCase()}
                </span>
              </div>
              <div className="flex items-center justify-between text-[9px]">
                <span className={`font-semibold ${typeColor[pass.type]}`}>{pass.type}</span>
                <span className="text-muted-foreground">{pass.overRegion}</span>
              </div>
              <div className="flex items-center gap-1 mt-1 text-[9px] text-muted-foreground">
                <Clock className="w-2.5 h-2.5" />
                <span>{pass.windowStart} - {pass.windowEnd} UTC</span>
              </div>

              {pass.status === "active" && (
                <div className="mt-2 h-1 bg-muted rounded-full overflow-hidden">
                  <div className="h-full bg-success rounded-full animate-pulse" style={{ width: "45%" }} />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
