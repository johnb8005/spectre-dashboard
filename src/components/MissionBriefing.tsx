import { Target, Clock, Users, ChevronRight, MapPin } from "lucide-react";
import type { Mission } from "../data/mock";

interface MissionBriefingProps {
  missions: Mission[];
  selectedMission: Mission | null;
  onMissionSelect: (mission: Mission) => void;
}

const classificationStyle: Record<string, string> = {
  "TOP SECRET": "text-destructive bg-destructive/10 border-destructive/30 glow-border-red",
  SECRET: "text-warning bg-warning/10 border-warning/30",
  CLASSIFIED: "text-cyan bg-cyan/10 border-cyan/30",
};

const priorityStyle: Record<string, string> = {
  critical: "text-destructive",
  high: "text-warning",
  medium: "text-cyan",
  low: "text-muted-foreground",
};

const statusStyle: Record<string, { color: string; bg: string }> = {
  active: { color: "text-success", bg: "bg-success" },
  pending: { color: "text-warning", bg: "bg-warning" },
  completed: { color: "text-cyan", bg: "bg-cyan" },
  aborted: { color: "text-destructive", bg: "bg-destructive" },
};

export default function MissionBriefing({ missions, selectedMission, onMissionSelect }: MissionBriefingProps) {
  return (
    <div className="h-full flex flex-col">
      <div className="p-3 border-b border-border flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Target className="w-3.5 h-3.5 text-gold" />
          <span className="text-[11px] font-semibold text-gold tracking-wider">ACTIVE MISSIONS</span>
        </div>
        <div className="flex items-center gap-2">
          {selectedMission && (
            <span className="text-[8px] text-gold/60 tracking-wider animate-pulse">ZONE ACTIVE</span>
          )}
          <span className="text-[10px] text-muted-foreground">{missions.length} OPS</span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto scrollbar-hidden">
        {missions.map((mission, i) => {
          const sSt = statusStyle[mission.status];
          const isSelected = selectedMission?.id === mission.id;

          return (
            <div
              key={mission.id}
              onClick={() => onMissionSelect(mission)}
              className={`
                p-3 border-b border-border/30 cursor-pointer group animate-fade-in-up transition-all duration-200
                ${isSelected
                  ? "bg-gold/5 border-l-2 border-l-gold"
                  : "hover:bg-white/[0.02] border-l-2 border-l-transparent"
                }
              `}
              style={{ animationDelay: `${i * 60}ms` }}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className={`text-[8px] px-1.5 py-0.5 rounded border font-bold ${classificationStyle[mission.classification]}`}>
                    {mission.classification}
                  </span>
                  <span className={`text-[8px] font-bold ${priorityStyle[mission.priority]}`}>
                    P:{mission.priority.toUpperCase()}
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <div className={`w-1.5 h-1.5 rounded-full ${sSt.bg} ${mission.status === "active" ? "animate-pulse" : ""}`} />
                  <span className={`text-[8px] font-semibold ${sSt.color}`}>{mission.status.toUpperCase()}</span>
                </div>
              </div>

              <div className="flex items-center justify-between mb-1.5">
                <span className={`text-[12px] font-bold tracking-wider ${isSelected ? "text-gold" : "text-foreground"}`}>
                  OP-{mission.codename}
                </span>
                <div className="flex items-center gap-1">
                  {isSelected && (
                    <MapPin className="w-3 h-3 text-gold animate-pulse" />
                  )}
                  <ChevronRight className={`w-3 h-3 text-muted-foreground transition-all ${isSelected ? "opacity-100 rotate-90 text-gold" : "opacity-0 group-hover:opacity-100"}`} />
                </div>
              </div>

              <p className="text-[9px] text-muted-foreground leading-relaxed mb-2 line-clamp-2">
                {mission.briefing}
              </p>

              <div className="flex items-center justify-between text-[8px] text-muted-foreground">
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1">
                    <Users className="w-2.5 h-2.5" />
                    <span>{mission.assignedAgents.length} AGENT{mission.assignedAgents.length > 1 ? "S" : ""}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="w-2.5 h-2.5" />
                    <span>{mission.deadline}</span>
                  </div>
                </div>
                <span>{mission.region}</span>
              </div>

              {/* Expanded intel when selected */}
              {isSelected && (
                <div className="mt-2 pt-2 border-t border-gold/15 space-y-1 animate-fade-in-up">
                  <div className="text-[8px] text-gold/50 tracking-widest font-semibold mb-1">ZONE INTEL MARKERS</div>
                  {mission.intelMarkers.map((marker, j) => {
                    const typeIcon: Record<string, string> = {
                      asset: "text-success",
                      target: "text-destructive",
                      safehouse: "text-cyan",
                      comms: "text-warning",
                    };
                    return (
                      <div key={j} className="flex items-center gap-2 text-[8px]">
                        <div className={`w-1.5 h-1.5 rounded-full ${typeIcon[marker.type].replace("text-", "bg-")}`} />
                        <span className={`font-semibold ${typeIcon[marker.type]}`}>{marker.type.toUpperCase()}</span>
                        <span className="text-muted-foreground">{marker.label}</span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
