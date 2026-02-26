import { useState, useEffect } from "react";
import { Satellite, Radio, ShieldCheck, Database, Activity, AlertTriangle, Network, Gauge } from "lucide-react";
import { systemStats } from "../data/mock";

interface StatItem {
  icon: typeof Satellite;
  label: string;
  value: string | number;
  color: string;
  pulse?: boolean;
}

export default function StatsBar() {
  const [activeInterceptions, setActiveInterceptions] = useState(systemStats.activeInterceptions);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveInterceptions(prev => prev + (Math.random() > 0.5 ? 1 : -1));
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const stats: StatItem[] = [
    { icon: Radio, label: "ENCRYPTED CH", value: systemStats.encryptedChannels, color: "text-gold" },
    { icon: Satellite, label: "SATELLITES", value: systemStats.satellitesOnline, color: "text-cyan" },
    { icon: Activity, label: "INTERCEPTS", value: activeInterceptions, color: "text-warning", pulse: true },
    { icon: ShieldCheck, label: "SECURE NODES", value: systemStats.secureNodes.toLocaleString(), color: "text-success" },
    { icon: Database, label: "DATA/24H", value: systemStats.dataProcessed, color: "text-cyan" },
    { icon: AlertTriangle, label: "THREAT LEVEL", value: systemStats.threatLevel, color: "text-destructive", pulse: true },
    { icon: Network, label: "GLOBAL ALERTS", value: systemStats.globalAlerts, color: "text-warning" },
    { icon: Gauge, label: "LATENCY", value: systemStats.networkLatency, color: "text-success" },
  ];

  return (
    <div className="h-10 border-t border-border bg-card/60 backdrop-blur-sm flex items-center justify-between px-2">
      <div className="flex items-center gap-1">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className="flex items-center gap-1.5 px-3 py-1 rounded hover:bg-white/[0.02] transition-colors">
              <Icon className={`w-3 h-3 ${stat.color} ${stat.pulse ? "animate-pulse" : ""}`} />
              <span className="text-[8px] text-muted-foreground tracking-wider">{stat.label}</span>
              <span className={`text-[10px] font-bold ${stat.color}`}>{stat.value}</span>
            </div>
          );
        })}
      </div>

      <div className="flex items-center gap-2 text-[8px] text-muted-foreground">
        <span>SYS.STATUS:</span>
        <span className="text-success font-bold">OPERATIONAL</span>
        <span className="animate-blink">_</span>
      </div>
    </div>
  );
}
