export default function RadarWidget() {
  return (
    <div className="h-full flex flex-col items-center justify-center p-3">
      <div className="text-[9px] text-cyan tracking-widest font-semibold mb-3">PROXIMITY RADAR</div>
      <div className="relative w-32 h-32">
        <svg viewBox="0 0 200 200" className="w-full h-full">
          {/* Background circles */}
          {[30, 60, 90].map(r => (
            <circle key={r} cx="100" cy="100" r={r} fill="none" stroke="#06b6d4" strokeWidth="0.5" opacity="0.15" />
          ))}

          {/* Cross hairs */}
          <line x1="100" y1="10" x2="100" y2="190" stroke="#06b6d4" strokeWidth="0.3" opacity="0.15" />
          <line x1="10" y1="100" x2="190" y2="100" stroke="#06b6d4" strokeWidth="0.3" opacity="0.15" />

          {/* Sweep */}
          <path
            d="M100,100 L100,10 A90,90 0 0,1 163.6,36.4 Z"
            fill="url(#sweepGrad)"
            className="animate-radar"
            style={{ transformOrigin: "100px 100px" }}
          />

          <defs>
            <linearGradient id="sweepGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#06b6d4" stopOpacity="0" />
              <stop offset="100%" stopColor="#06b6d4" stopOpacity="0.3" />
            </linearGradient>
          </defs>

          {/* Blips */}
          <circle cx="135" cy="70" r="3" fill="#22c55e" opacity="0.8">
            <animate attributeName="opacity" values="0.3;0.9;0.3" dur="2s" repeatCount="indefinite" />
          </circle>
          <circle cx="65" cy="130" r="3" fill="#22c55e" opacity="0.6">
            <animate attributeName="opacity" values="0.5;1;0.5" dur="2.5s" repeatCount="indefinite" />
          </circle>
          <circle cx="120" cy="140" r="3" fill="#ef4444" opacity="0.7">
            <animate attributeName="opacity" values="0.4;0.9;0.4" dur="1.5s" repeatCount="indefinite" />
          </circle>
          <circle cx="80" cy="60" r="3" fill="#f59e0b" opacity="0.6">
            <animate attributeName="opacity" values="0.3;0.8;0.3" dur="3s" repeatCount="indefinite" />
          </circle>

          {/* Center dot */}
          <circle cx="100" cy="100" r="3" fill="#06b6d4" />
        </svg>
      </div>
      <div className="flex gap-4 mt-2 text-[8px] text-muted-foreground">
        <span>RANGE: 50KM</span>
        <span>CONTACTS: 4</span>
      </div>
    </div>
  );
}
