import { useState, useEffect } from "react";
import { Shield, Wifi, Lock, Satellite, AlertTriangle } from "lucide-react";

export default function TopBar() {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  const utc = time.toUTCString().split(" ").slice(1).join(" ");
  const zulu = time.toISOString().split("T")[1].split(".")[0] + "Z";

  return (
    <div className="h-12 border-b border-border bg-card/80 backdrop-blur-sm flex items-center justify-between px-4 relative overflow-hidden">
      {/* Scan line */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute w-full h-[1px] bg-gradient-to-r from-transparent via-gold/20 to-transparent top-0" />
      </div>

      {/* Left section */}
      <div className="flex items-center gap-5">
        <div className="flex items-center gap-2">
          <Shield className="w-4 h-4 text-gold" />
          <span className="text-gold font-semibold text-sm tracking-[0.2em] text-shadow-gold">
            SPECTRE
          </span>
          <span className="text-muted-foreground text-[10px] tracking-wider">
            v7.3.1
          </span>
        </div>

        <div className="h-4 w-px bg-border" />

        <div className="flex items-center gap-1.5 px-2 py-0.5 bg-destructive/10 border border-destructive/30 rounded glow-border-red">
          <AlertTriangle className="w-3 h-3 text-destructive animate-pulse" />
          <span className="text-destructive text-[10px] font-semibold tracking-wider animate-flicker">
            TOP SECRET // SCI
          </span>
        </div>

        <div className="h-4 w-px bg-border" />

        <div className="flex items-center gap-3 text-[10px] text-muted-foreground">
          <div className="flex items-center gap-1">
            <Lock className="w-3 h-3 text-success" />
            <span>AES-256</span>
          </div>
          <div className="flex items-center gap-1">
            <Wifi className="w-3 h-3 text-success" />
            <span>SECURE</span>
          </div>
          <div className="flex items-center gap-1">
            <Satellite className="w-3 h-3 text-cyan" />
            <span>14 SAT</span>
          </div>
        </div>
      </div>

      {/* Center */}
      <div className="absolute left-1/2 -translate-x-1/2 text-[10px] text-muted-foreground tracking-widest">
        GEO-INTELLIGENCE COMMAND & CONTROL
      </div>

      {/* Right section */}
      <div className="flex items-center gap-5">
        <div className="text-[10px] text-muted-foreground flex items-center gap-4">
          <span>{utc}</span>
          <div className="flex items-center gap-1">
            <div className="w-1.5 h-1.5 rounded-full bg-success animate-pulse" />
            <span className="text-cyan font-semibold tracking-wider">{zulu}</span>
          </div>
        </div>

        <div className="h-4 w-px bg-border" />

        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-full border border-gold/40 flex items-center justify-center text-[9px] text-gold font-bold">
            M
          </div>
          <div className="text-[10px]">
            <div className="text-foreground font-medium">DIRECTOR</div>
            <div className="text-muted-foreground">CLEARANCE: OMEGA</div>
          </div>
        </div>
      </div>
    </div>
  );
}
