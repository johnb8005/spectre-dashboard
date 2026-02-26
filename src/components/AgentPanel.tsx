import { User, Radio, MapPin, Heart, Eye } from "lucide-react";
import type { Agent } from "../data/mock";

interface AgentPanelProps {
  agents: Agent[];
  selectedAgent: Agent | null;
  onAgentSelect: (agent: Agent) => void;
}

const statusConfig: Record<string, { color: string; bg: string; border: string; label: string }> = {
  active: { color: "text-success", bg: "bg-success/10", border: "border-success/30", label: "ACTIVE" },
  compromised: { color: "text-destructive", bg: "bg-destructive/10", border: "border-destructive/30", label: "COMPROMISED" },
  extraction: { color: "text-warning", bg: "bg-warning/10", border: "border-warning/30", label: "EXTRACTION" },
  dark: { color: "text-muted-foreground", bg: "bg-muted", border: "border-muted-foreground/30", label: "DARK" },
  standby: { color: "text-cyan", bg: "bg-cyan/10", border: "border-cyan/30", label: "STANDBY" },
};

export default function AgentPanel({ agents, selectedAgent, onAgentSelect }: AgentPanelProps) {
  return (
    <div className="h-full flex flex-col border-r border-border bg-card/50">
      <div className="p-3 border-b border-border flex items-center justify-between">
        <div className="flex items-center gap-2">
          <User className="w-3.5 h-3.5 text-gold" />
          <span className="text-[11px] font-semibold text-gold tracking-wider">FIELD AGENTS</span>
        </div>
        <span className="text-[10px] text-muted-foreground">{agents.length} DEPLOYED</span>
      </div>

      <div className="flex-1 overflow-y-auto scrollbar-hidden">
        {agents.map((agent, i) => {
          const cfg = statusConfig[agent.status];
          const isSelected = selectedAgent?.id === agent.id;

          return (
            <div
              key={agent.id}
              onClick={() => onAgentSelect(agent)}
              className={`
                p-3 border-b border-border/50 cursor-pointer transition-all duration-200
                ${isSelected ? "bg-gold/5 border-l-2 border-l-gold" : "hover:bg-white/[0.02] border-l-2 border-l-transparent"}
                animate-fade-in-up
              `}
              style={{ animationDelay: `${i * 50}ms` }}
            >
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-2">
                  <div className={`w-5 h-5 rounded-full ${cfg.bg} border ${cfg.border} flex items-center justify-center`}>
                    <span className={`text-[8px] font-bold ${cfg.color}`}>{agent.id}</span>
                  </div>
                  <span className="text-[11px] font-semibold tracking-wider">{agent.codename}</span>
                </div>
                <span className={`text-[8px] px-1.5 py-0.5 rounded ${cfg.bg} ${cfg.color} border ${cfg.border} font-semibold`}>
                  {cfg.label}
                </span>
              </div>

              <div className="space-y-1 ml-7">
                <div className="flex items-center gap-1.5 text-[9px] text-muted-foreground">
                  <MapPin className="w-2.5 h-2.5" />
                  <span>{agent.location.city}, {agent.location.country}</span>
                </div>
                <div className="flex items-center gap-1.5 text-[9px] text-muted-foreground">
                  <Radio className="w-2.5 h-2.5" />
                  <span>{agent.lastContact}</span>
                </div>
                <div className="flex items-center gap-1.5 text-[9px] text-muted-foreground">
                  <Eye className="w-2.5 h-2.5" />
                  <span>{agent.coverIdentity}</span>
                </div>
                <div className="flex items-center gap-2 mt-1">
                  <Heart className={`w-2.5 h-2.5 ${agent.heartbeat > 70 ? "text-success" : agent.heartbeat > 30 ? "text-warning" : agent.heartbeat > 0 ? "text-destructive" : "text-muted-foreground"}`} />
                  <div className="flex-1 h-1 bg-muted rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-1000 ${
                        agent.heartbeat > 70 ? "bg-success" : agent.heartbeat > 30 ? "bg-warning" : agent.heartbeat > 0 ? "bg-destructive" : "bg-muted-foreground"
                      }`}
                      style={{ width: `${agent.heartbeat}%` }}
                    />
                  </div>
                  <span className="text-[8px] text-muted-foreground w-6 text-right">{agent.heartbeat}%</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
