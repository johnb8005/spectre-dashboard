import { X, MapPin, Radio, Eye, Heart, Fingerprint, Shield, Crosshair, Signal } from "lucide-react";
import type { Agent } from "../data/mock";

interface AgentDetailProps {
  agent: Agent;
  onClose: () => void;
}

const statusConfig: Record<string, { color: string; bg: string; border: string; label: string; glow: string }> = {
  active: { color: "text-success", bg: "bg-success/10", border: "border-success/30", label: "ACTIVE", glow: "glow-border-cyan" },
  compromised: { color: "text-destructive", bg: "bg-destructive/10", border: "border-destructive/30", label: "COMPROMISED", glow: "glow-border-red" },
  extraction: { color: "text-warning", bg: "bg-warning/10", border: "border-warning/30", label: "EXTRACTION", glow: "" },
  dark: { color: "text-muted-foreground", bg: "bg-muted", border: "border-muted-foreground/30", label: "DARK", glow: "" },
  standby: { color: "text-cyan", bg: "bg-cyan/10", border: "border-cyan/30", label: "STANDBY", glow: "glow-border-cyan" },
};

export default function AgentDetail({ agent, onClose }: AgentDetailProps) {
  const cfg = statusConfig[agent.status];

  return (
    <div className="absolute top-0 right-0 w-80 h-full bg-card/95 backdrop-blur-md border-l border-border z-30 animate-fade-in-up overflow-y-auto scrollbar-hidden">
      {/* Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Fingerprint className="w-4 h-4 text-gold" />
            <span className="text-[10px] text-gold tracking-widest font-semibold">AGENT DOSSIER</span>
          </div>
          <button
            onClick={onClose}
            className="w-6 h-6 rounded flex items-center justify-center hover:bg-white/10 transition-colors"
          >
            <X className="w-3.5 h-3.5 text-muted-foreground" />
          </button>
        </div>

        <div className="flex items-center gap-3">
          <div className={`w-12 h-12 rounded-lg ${cfg.bg} border ${cfg.border} flex items-center justify-center`}>
            <span className={`text-lg font-bold ${cfg.color}`}>{agent.id}</span>
          </div>
          <div>
            <div className="text-lg font-bold tracking-wider">{agent.codename}</div>
            <div className={`inline-flex items-center gap-1 text-[9px] px-2 py-0.5 rounded ${cfg.bg} ${cfg.color} border ${cfg.border} font-bold`}>
              <div className={`w-1.5 h-1.5 rounded-full ${agent.status !== "dark" ? "animate-pulse" : ""}`} style={{ backgroundColor: "currentColor" }} />
              {cfg.label}
            </div>
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="p-4 space-y-4">
        {/* Identity */}
        <Section title="IDENTITY">
          <InfoRow icon={Eye} label="COVER" value={agent.coverIdentity} />
          <InfoRow icon={Shield} label="REAL ID" value={agent.realName} />
          <InfoRow icon={Crosshair} label="MISSION" value={agent.mission} />
        </Section>

        {/* Location */}
        <Section title="LOCATION">
          <InfoRow icon={MapPin} label="POSITION" value={`${agent.location.city}, ${agent.location.country}`} />
          <div className="text-[9px] text-muted-foreground ml-5 mt-0.5">
            {agent.location.lat.toFixed(4)}°N, {agent.location.lng.toFixed(4)}°E
          </div>
        </Section>

        {/* Comms */}
        <Section title="COMMUNICATIONS">
          <InfoRow icon={Radio} label="LAST CONTACT" value={agent.lastContact} />
          <InfoRow icon={Signal} label="SIGNAL" value={agent.heartbeat > 70 ? "STRONG" : agent.heartbeat > 30 ? "WEAK" : agent.heartbeat > 0 ? "CRITICAL" : "LOST"} />
        </Section>

        {/* Vitals */}
        <Section title="VITALS">
          <div className="flex items-center gap-2 mb-2">
            <Heart className={`w-3 h-3 ${agent.heartbeat > 70 ? "text-success" : agent.heartbeat > 30 ? "text-warning" : "text-destructive"} ${agent.heartbeat > 0 ? "animate-pulse" : ""}`} />
            <span className="text-[10px] text-muted-foreground">HEARTBEAT MONITOR</span>
          </div>
          <div className="relative h-2 bg-muted rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-1000 ${
                agent.heartbeat > 70 ? "bg-success" : agent.heartbeat > 30 ? "bg-warning" : agent.heartbeat > 0 ? "bg-destructive" : "bg-muted-foreground"
              }`}
              style={{ width: `${agent.heartbeat}%` }}
            />
          </div>
          <div className="text-right text-[10px] mt-1 font-bold" style={{ color: agent.heartbeat > 70 ? "#22c55e" : agent.heartbeat > 30 ? "#f59e0b" : "#ef4444" }}>
            {agent.heartbeat}%
          </div>
        </Section>

        {/* Actions */}
        <div className="grid grid-cols-2 gap-2 pt-2">
          <ActionButton label="CONTACT" variant="gold" />
          <ActionButton label="EXTRACT" variant="warning" />
          <ActionButton label="RELOCATE" variant="cyan" />
          <ActionButton label="TERMINATE" variant="destructive" />
        </div>
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="text-[9px] text-gold/60 tracking-widest font-semibold mb-2 flex items-center gap-2">
        <div className="h-px flex-1 bg-gold/10" />
        <span>{title}</span>
        <div className="h-px flex-1 bg-gold/10" />
      </div>
      <div className="space-y-1.5">{children}</div>
    </div>
  );
}

function InfoRow({ icon: Icon, label, value }: { icon: typeof Eye; label: string; value: string }) {
  return (
    <div className="flex items-center gap-2">
      <Icon className="w-3 h-3 text-muted-foreground" />
      <span className="text-[9px] text-muted-foreground w-20">{label}</span>
      <span className="text-[10px] text-foreground font-medium">{value}</span>
    </div>
  );
}

function ActionButton({ label, variant }: { label: string; variant: string }) {
  const styles: Record<string, string> = {
    gold: "border-gold/30 text-gold hover:bg-gold/10",
    warning: "border-warning/30 text-warning hover:bg-warning/10",
    cyan: "border-cyan/30 text-cyan hover:bg-cyan/10",
    destructive: "border-destructive/30 text-destructive hover:bg-destructive/10",
  };

  return (
    <button className={`text-[9px] font-bold tracking-wider py-2 rounded border ${styles[variant]} bg-transparent transition-colors cursor-pointer`}>
      {label}
    </button>
  );
}
