import { useState, useEffect } from "react";
import { Terminal } from "lucide-react";

const terminalLines = [
  { text: "> INIT SECURE_CHANNEL --protocol=AES256-GCM", delay: 0 },
  { text: "[OK] Channel established. Latency: 12ms", delay: 400 },
  { text: "> AUTH --cert=/vault/omega.pem --level=5", delay: 800 },
  { text: "[OK] Authentication verified. Clearance: OMEGA", delay: 1200 },
  { text: "> QUERY AGENT_NETWORK --status=ALL", delay: 1600 },
  { text: "[INFO] 8 agents registered. 5 active. 1 compromised.", delay: 2000 },
  { text: "> DECRYPT INTERCEPT T-001 --cipher=SPECTRE", delay: 2400 },
  { text: "[WARN] Partial decrypt. Entropy mismatch at block 47.", delay: 2800 },
  { text: "> TRACE FINANCIAL_FLOW --target=JANUS --depth=6", delay: 3200 },
  { text: "[INFO] 6 shell companies identified. Total: $47.2M", delay: 3600 },
  { text: "> SAT_UPLINK MENTOR-7 --region=MIDEAST", delay: 4000 },
  { text: "[OK] Uplink active. Signal: -67dBm. Window: 75min", delay: 4400 },
  { text: "> MONITOR THREAT_MATRIX --refresh=5s", delay: 4800 },
  { text: "[ALERT] Threat level ELEVATED. 2 critical events.", delay: 5200 },
];

export default function CryptoTerminal() {
  const [visibleLines, setVisibleLines] = useState<number>(0);

  useEffect(() => {
    const timers: NodeJS.Timeout[] = [];
    terminalLines.forEach((line, i) => {
      timers.push(
        setTimeout(() => setVisibleLines(i + 1), line.delay + 500)
      );
    });

    const resetTimer = setTimeout(() => {
      setVisibleLines(0);
      setTimeout(() => {
        terminalLines.forEach((line, i) => {
          timers.push(
            setTimeout(() => setVisibleLines(i + 1), line.delay + 500)
          );
        });
      }, 300);
    }, 8000);

    return () => {
      timers.forEach(clearTimeout);
      clearTimeout(resetTimer);
    };
  }, []);

  return (
    <div className="h-full flex flex-col">
      <div className="p-3 border-b border-border flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Terminal className="w-3.5 h-3.5 text-success" />
          <span className="text-[11px] font-semibold text-success tracking-wider">CRYPTO TERMINAL</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-1.5 h-1.5 rounded-full bg-success animate-pulse" />
          <span className="text-[9px] text-success">ACTIVE</span>
        </div>
      </div>

      <div className="flex-1 overflow-hidden p-3 font-mono">
        {terminalLines.slice(0, visibleLines).map((line, i) => (
          <div
            key={i}
            className={`text-[9px] leading-relaxed ${
              line.text.startsWith(">")
                ? "text-success"
                : line.text.includes("[ALERT]") || line.text.includes("[WARN]")
                ? "text-warning"
                : line.text.includes("[OK]")
                ? "text-cyan/70"
                : "text-muted-foreground"
            }`}
          >
            {line.text}
          </div>
        ))}
        <span className="text-success animate-blink text-[10px]">_</span>
      </div>
    </div>
  );
}
