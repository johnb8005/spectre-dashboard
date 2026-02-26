import { useState, useEffect, useCallback } from "react";
import {
  ComposableMap,
  Geographies,
  Geography,
  Marker,
  Line,
  Graticule,
  ZoomableGroup,
} from "react-simple-maps";
import type { Agent, ThreatEvent, Mission } from "../data/mock";

const GEO_URL = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

const HQ = { lat: 51.5074, lng: -0.1278 };

interface WorldMapProps {
  agents: Agent[];
  threats: ThreatEvent[];
  onAgentSelect: (agent: Agent) => void;
  selectedAgent: Agent | null;
  selectedMission: Mission | null;
}

const statusColor: Record<string, string> = {
  active: "#22c55e",
  compromised: "#ef4444",
  extraction: "#f59e0b",
  dark: "#71717a",
  standby: "#06b6d4",
};

const intelMarkerConfig: Record<string, { color: string; shape: "circle" | "diamond" | "square" | "triangle" }> = {
  asset: { color: "#22c55e", shape: "circle" },
  target: { color: "#ef4444", shape: "diamond" },
  safehouse: { color: "#06b6d4", shape: "square" },
  comms: { color: "#f59e0b", shape: "triangle" },
};

// Fake "live" data streams - routes between cities for visual busy-ness
const dataStreams: { from: [number, number]; to: [number, number]; color: string }[] = [
  { from: [-0.13, 51.51], to: [37.62, 55.76], color: "#c9a84c" },
  { from: [-0.13, 51.51], to: [2.35, 48.86], color: "#c9a84c" },
  { from: [-0.13, 51.51], to: [55.27, 25.20], color: "#c9a84c" },
  { from: [2.35, 48.86], to: [12.49, 41.89], color: "#22c55e" },
  { from: [37.62, 55.76], to: [104.07, 30.57], color: "#06b6d4" },
  { from: [121.47, 31.23], to: [139.69, 35.69], color: "#ef4444" },
  { from: [-99.13, 19.43], to: [-73.94, 40.71], color: "#22c55e" },
  { from: [55.27, 25.20], to: [77.21, 28.61], color: "#06b6d4" },
  { from: [-73.94, 40.71], to: [-0.13, 51.51], color: "#c9a84c" },
  { from: [139.69, 35.69], to: [151.21, -33.87], color: "#f59e0b" },
  { from: [2.35, 48.86], to: [-3.70, 40.42], color: "#22c55e" },
  { from: [13.41, 52.52], to: [37.62, 55.76], color: "#06b6d4" },
];

// Surveillance zones - pulsing circles on regions of interest
const surveillanceZones: { coords: [number, number]; radius: number; color: string; label: string }[] = [
  { coords: [37.62, 55.76], radius: 12, color: "#ef4444", label: "ZONE ALPHA" },
  { coords: [121.47, 31.23], radius: 10, color: "#ef4444", label: "ZONE BRAVO" },
  { coords: [55.27, 25.20], radius: 8, color: "#f59e0b", label: "ZONE CHARLIE" },
  { coords: [36.82, 1.29], radius: 6, color: "#06b6d4", label: "ZONE DELTA" },
  { coords: [-99.13, 19.43], radius: 7, color: "#f59e0b", label: "ZONE ECHO" },
];

// Tracking satellites (fake moving dots)
const satelliteOrbits = [
  { id: 1, baseY: 30, speed: 0.4, color: "#06b6d4" },
  { id: 2, baseY: -10, speed: -0.3, color: "#06b6d4" },
  { id: 3, baseY: 50, speed: 0.25, color: "#c9a84c" },
];

// Convert polygon coords array to SVG path points string
function polygonToPath(coords: [number, number][]): string {
  return coords.map((c) => c.join(",")).join(" ");
}

export default function WorldMap({ agents, threats, onAgentSelect, selectedAgent, selectedMission }: WorldMapProps) {
  const [hoveredAgent, setHoveredAgent] = useState<string | null>(null);
  const [hoveredIntel, setHoveredIntel] = useState<string | null>(null);
  const [tick, setTick] = useState(0);
  const [tooltipContent, setTooltipContent] = useState("");
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });
  const [position, setPosition] = useState<{ coordinates: [number, number]; zoom: number }>({
    coordinates: [20, 20],
    zoom: 1,
  });

  // Animation tick for moving elements
  useEffect(() => {
    const interval = setInterval(() => setTick((t) => t + 1), 50);
    return () => clearInterval(interval);
  }, []);

  const handleMoveEnd = useCallback((pos: { coordinates: [number, number]; zoom: number }) => {
    setPosition(pos);
  }, []);

  // Compute satellite positions
  const satPositions = satelliteOrbits.map((sat) => {
    const lng = ((tick * sat.speed) % 360) - 180;
    return { ...sat, lng, lat: sat.baseY + Math.sin(tick * 0.02 * sat.speed) * 15 };
  });

  // Animated dash offset for data streams
  const dashOffset = tick * 0.8;

  // Mission zone color based on priority
  const missionZoneColor = selectedMission
    ? selectedMission.priority === "critical"
      ? "#ef4444"
      : selectedMission.priority === "high"
      ? "#f59e0b"
      : "#06b6d4"
    : "#c9a84c";

  return (
    <div className="relative w-full h-full overflow-hidden rounded-lg border border-border bg-[#080810]">
      {/* CRT scanline overlay */}
      <div className="absolute inset-0 pointer-events-none z-20 overflow-hidden opacity-[0.03]">
        <div
          className="absolute w-full h-full"
          style={{
            backgroundImage:
              "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.03) 2px, rgba(255,255,255,0.03) 4px)",
          }}
        />
      </div>

      {/* Moving scan line */}
      <div className="absolute inset-0 pointer-events-none z-20 overflow-hidden">
        <div
          className="absolute w-full h-[2px] bg-gradient-to-r from-transparent via-gold/30 to-transparent"
          style={{ top: `${(tick * 0.5) % 100}%` }}
        />
      </div>

      {/* Corner brackets */}
      <div className="absolute top-0 left-0 w-5 h-5 border-t border-l border-gold/30 z-20 pointer-events-none" />
      <div className="absolute top-0 right-0 w-5 h-5 border-t border-r border-gold/30 z-20 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-5 h-5 border-b border-l border-gold/30 z-20 pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-5 h-5 border-b border-r border-gold/30 z-20 pointer-events-none" />

      {/* Top left info */}
      <div className="absolute top-2 left-3 z-20 pointer-events-none text-[9px] font-mono space-y-0.5">
        <div className="text-gold/50">GEO-INTEL OVERLAY v7.3</div>
        <div className="text-gold/30">PROJ: NATURAL EARTH</div>
        <div className="text-gold/30">ZOOM: {position.zoom.toFixed(1)}x</div>
        {selectedMission && (
          <div className="mt-1 text-[10px] font-bold tracking-wider animate-pulse" style={{ color: missionZoneColor }}>
            ZONE: OP-{selectedMission.codename}
          </div>
        )}
      </div>

      {/* Top right feed indicator */}
      <div className="absolute top-2 right-3 z-20 pointer-events-none flex items-center gap-2">
        <div className="flex items-center gap-1">
          <div className="w-1.5 h-1.5 rounded-full bg-success animate-pulse" />
          <span className="text-[9px] text-success/70 font-mono">SAT-FEED LIVE</span>
        </div>
      </div>

      {/* Tooltip */}
      {tooltipContent && (
        <div
          className="absolute z-30 px-2 py-1 bg-card/95 border border-gold/30 rounded text-[9px] font-mono text-gold pointer-events-none glow-border-gold"
          style={{ left: tooltipPos.x + 12, top: tooltipPos.y - 8 }}
        >
          {tooltipContent}
        </div>
      )}

      {/* Mission zone intel overlay panel (top-right of map) */}
      {selectedMission && (
        <div
          className="absolute top-10 right-3 z-20 w-52 pointer-events-none animate-fade-in-up"
        >
          <div
            className="p-2.5 rounded border bg-card/90 backdrop-blur-sm"
            style={{ borderColor: missionZoneColor + "55" }}
          >
            <div className="flex items-center gap-1.5 mb-1.5">
              <div className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: missionZoneColor }} />
              <span className="text-[9px] font-bold tracking-widest" style={{ color: missionZoneColor }}>
                OPERATIONAL ZONE
              </span>
            </div>
            <div className="text-[11px] font-bold tracking-wider text-foreground mb-1">
              OP-{selectedMission.codename}
            </div>
            <div className="text-[8px] text-muted-foreground mb-2">
              {selectedMission.classification} // {selectedMission.region}
            </div>
            <div className="space-y-1 border-t pt-1.5" style={{ borderColor: missionZoneColor + "22" }}>
              <div className="text-[7px] tracking-widest font-semibold mb-1" style={{ color: missionZoneColor + "88" }}>
                INTEL MARKERS
              </div>
              {selectedMission.intelMarkers.map((m, i) => {
                const cfg = intelMarkerConfig[m.type];
                return (
                  <div key={i} className="flex items-center gap-1.5 text-[8px]">
                    <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: cfg.color }} />
                    <span style={{ color: cfg.color }} className="font-semibold">{m.type.toUpperCase()}</span>
                    <span className="text-muted-foreground">{m.label}</span>
                  </div>
                );
              })}
            </div>
            <div className="mt-2 pt-1.5 border-t text-[8px] text-muted-foreground" style={{ borderColor: missionZoneColor + "22" }}>
              <span>AGENTS: {selectedMission.assignedAgents.join(", ")}</span>
              <span className="ml-2">DL: {selectedMission.deadline}</span>
            </div>
          </div>
        </div>
      )}

      <ComposableMap
        projection="geoNaturalEarth1"
        projectionConfig={{ scale: 160 }}
        className="w-full h-full"
        style={{ background: "transparent" }}
      >
        <ZoomableGroup
          center={position.coordinates}
          zoom={position.zoom}
          onMoveEnd={handleMoveEnd}
          minZoom={1}
          maxZoom={8}
        >
          {/* Graticule grid */}
          <Graticule stroke="#c9a84c" strokeWidth={0.15} opacity={0.15} />

          {/* Countries */}
          <Geographies geography={GEO_URL}>
            {({ geographies }) =>
              geographies.map((geo) => (
                <Geography
                  key={geo.rsmKey}
                  geography={geo}
                  fill="#141420"
                  stroke="#1e1e3a"
                  strokeWidth={0.4}
                  style={{
                    default: { outline: "none" },
                    hover: { fill: "#1a1a30", outline: "none", cursor: "default" },
                    pressed: { outline: "none" },
                  }}
                  onMouseEnter={(e) => {
                    setTooltipContent(geo.properties.name);
                    setTooltipPos({ x: e.clientX, y: e.clientY });
                  }}
                  onMouseMove={(e) => {
                    setTooltipPos({ x: e.clientX, y: e.clientY });
                  }}
                  onMouseLeave={() => setTooltipContent("")}
                />
              ))
            }
          </Geographies>

          {/* ==========================================
              MISSION ZONE OVERLAY (when a mission is selected)
              ========================================== */}
          {selectedMission && (
            <>
              {/* Zone polygon outline - animated perimeter */}
              <Line
                coordinates={selectedMission.zonePolygon}
                stroke={missionZoneColor}
                strokeWidth={1.2}
                strokeOpacity={0.5 + Math.sin(tick * 0.04) * 0.2}
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeDasharray="4 2"
                strokeDashoffset={tick * 0.5}
                fill={missionZoneColor}
                fillOpacity={0.03 + Math.sin(tick * 0.03) * 0.015}
                style={{ pointerEvents: "none" }}
              />

              {/* Second outline - slightly larger, slower animation for glow effect */}
              <Line
                coordinates={selectedMission.zonePolygon}
                stroke={missionZoneColor}
                strokeWidth={2.5}
                strokeOpacity={0.08 + Math.sin(tick * 0.025) * 0.04}
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="none"
                style={{ pointerEvents: "none" }}
              />

              {/* Zone vertex markers */}
              {selectedMission.zonePolygon.slice(0, -1).map((coord, i) => (
                <Marker key={`vertex-${i}`} coordinates={coord}>
                  <circle
                    r={1.5}
                    fill={missionZoneColor}
                    opacity={0.4 + Math.sin(tick * 0.06 + i) * 0.2}
                  />
                  <circle
                    r={3}
                    fill="none"
                    stroke={missionZoneColor}
                    strokeWidth={0.3}
                    opacity={0.2}
                  />
                </Marker>
              ))}

              {/* Zone center marker with rotating reticle */}
              <Marker coordinates={selectedMission.zoneCenter}>
                {/* Outer rotating ring */}
                <circle
                  r={16}
                  fill="none"
                  stroke={missionZoneColor}
                  strokeWidth={0.4}
                  opacity={0.2}
                  strokeDasharray="3 6"
                  strokeDashoffset={tick * 0.4}
                />
                {/* Inner rotating ring (opposite direction) */}
                <circle
                  r={10}
                  fill="none"
                  stroke={missionZoneColor}
                  strokeWidth={0.3}
                  opacity={0.15}
                  strokeDasharray="2 4"
                  strokeDashoffset={-tick * 0.3}
                />
                {/* Crosshairs */}
                <line x1={-20} x2={-6} y1={0} y2={0} stroke={missionZoneColor} strokeWidth={0.4} opacity={0.3} />
                <line x1={6} x2={20} y1={0} y2={0} stroke={missionZoneColor} strokeWidth={0.4} opacity={0.3} />
                <line x1={0} x2={0} y1={-20} y2={-6} stroke={missionZoneColor} strokeWidth={0.4} opacity={0.3} />
                <line x1={0} x2={0} y1={6} y2={20} stroke={missionZoneColor} strokeWidth={0.4} opacity={0.3} />
                {/* Tick marks on crosshairs */}
                {[-14, -10, 10, 14].map((d) => (
                  <line key={`htick-${d}`} x1={d} x2={d} y1={-1} y2={1} stroke={missionZoneColor} strokeWidth={0.3} opacity={0.25} />
                ))}
                {[-14, -10, 10, 14].map((d) => (
                  <line key={`vtick-${d}`} x1={-1} x2={1} y1={d} y2={d} stroke={missionZoneColor} strokeWidth={0.3} opacity={0.25} />
                ))}
                {/* Center pulse */}
                <circle r={2 + Math.sin(tick * 0.08) * 0.5} fill={missionZoneColor} opacity={0.3} />
                {/* Zone label */}
                <text
                  y={-24}
                  textAnchor="middle"
                  fill={missionZoneColor}
                  fontSize={4}
                  fontFamily="monospace"
                  fontWeight="bold"
                  opacity={0.7}
                >
                  OP-{selectedMission.codename}
                </text>
                <text
                  y={-19}
                  textAnchor="middle"
                  fill={missionZoneColor}
                  fontSize={2.5}
                  fontFamily="monospace"
                  opacity={0.4}
                >
                  {selectedMission.classification} // {selectedMission.priority.toUpperCase()}
                </text>
              </Marker>

              {/* Intel markers within the zone */}
              {selectedMission.intelMarkers.map((marker, i) => {
                const cfg = intelMarkerConfig[marker.type];
                const isHovered = hoveredIntel === `${selectedMission.id}-${i}`;
                const pulse = Math.sin(tick * 0.06 + i * 1.5) * 0.5;

                return (
                  <Marker
                    key={`intel-${i}`}
                    coordinates={marker.coords}
                    onMouseEnter={() => setHoveredIntel(`${selectedMission.id}-${i}`)}
                    onMouseLeave={() => setHoveredIntel(null)}
                  >
                    {/* Connection line from intel marker to zone center */}
                    {/* (rendered as a subtle indicator) */}

                    {/* Outer glow */}
                    <circle
                      r={5 + pulse}
                      fill={cfg.color}
                      opacity={0.06}
                    />

                    {/* Shape based on type */}
                    {cfg.shape === "circle" && (
                      <circle r={2.5} fill={cfg.color} opacity={0.8} />
                    )}
                    {cfg.shape === "diamond" && (
                      <rect
                        x={-2} y={-2} width={4} height={4}
                        fill={cfg.color}
                        opacity={0.8}
                        transform="rotate(45)"
                        style={{ transformOrigin: "0 0" }}
                      />
                    )}
                    {cfg.shape === "square" && (
                      <rect x={-2} y={-2} width={4} height={4} fill={cfg.color} opacity={0.8} />
                    )}
                    {cfg.shape === "triangle" && (
                      <polygon points="0,-2.5 2.2,2 -2.2,2" fill={cfg.color} opacity={0.8} />
                    )}

                    {/* Bright core */}
                    <circle r={0.8} fill="white" opacity={0.5} />

                    {/* Rotating indicator ring */}
                    <circle
                      r={4}
                      fill="none"
                      stroke={cfg.color}
                      strokeWidth={0.3}
                      opacity={0.3}
                      strokeDasharray="1.5 3"
                      strokeDashoffset={tick * 0.2 + i * 5}
                    />

                    {/* Label on hover */}
                    {isHovered && (
                      <g>
                        <rect
                          x={6} y={-10}
                          width={50} height={16}
                          rx={1}
                          fill="#111118"
                          stroke={cfg.color}
                          strokeWidth={0.4}
                          opacity={0.95}
                        />
                        <text x={9} y={-3} fill={cfg.color} fontSize={3} fontFamily="monospace" fontWeight="bold">
                          {marker.type.toUpperCase()}
                        </text>
                        <text x={9} y={2} fill="#71717a" fontSize={2.5} fontFamily="monospace">
                          {marker.label}
                        </text>
                      </g>
                    )}
                  </Marker>
                );
              })}

              {/* Lines connecting intel markers within the zone */}
              {selectedMission.intelMarkers.map((marker, i) => (
                <Line
                  key={`intel-line-${i}`}
                  from={selectedMission.zoneCenter}
                  to={marker.coords}
                  stroke={intelMarkerConfig[marker.type].color}
                  strokeWidth={0.3}
                  strokeOpacity={0.15}
                  strokeDasharray="1 3"
                  strokeDashoffset={tick * 0.2}
                  style={{ pointerEvents: "none" }}
                />
              ))}
            </>
          )}

          {/* Data stream lines (animated dashed) */}
          {dataStreams.map((stream, i) => (
            <Line
              key={`stream-${i}`}
              from={stream.from}
              to={stream.to}
              stroke={stream.color}
              strokeWidth={0.6}
              strokeOpacity={selectedMission ? 0.07 : 0.2}
              strokeLinecap="round"
              strokeDasharray="4 6"
              strokeDashoffset={dashOffset + i * 20}
              style={{ pointerEvents: "none" }}
            />
          ))}

          {/* Agent-to-HQ connection arcs */}
          {agents
            .filter((a) => a.status !== "dark" && a.status !== "standby")
            .map((agent) => (
              <Line
                key={`arc-${agent.id}`}
                from={[HQ.lng, HQ.lat]}
                to={[agent.location.lng, agent.location.lat]}
                stroke={statusColor[agent.status]}
                strokeWidth={selectedAgent?.id === agent.id ? 1.2 : 0.5}
                strokeOpacity={selectedAgent?.id === agent.id ? 0.6 : selectedMission ? 0.07 : 0.15}
                strokeLinecap="round"
                strokeDasharray="2 4"
                strokeDashoffset={dashOffset}
                style={{ pointerEvents: "none" }}
              />
            ))}

          {/* Surveillance zones (dimmed when mission zone is active) */}
          {surveillanceZones.map((zone, i) => {
            const pulseR = zone.radius + Math.sin(tick * 0.05 + i) * 3;
            return (
              <Marker key={`zone-${i}`} coordinates={zone.coords}>
                <circle
                  r={pulseR + 4}
                  fill="none"
                  stroke={zone.color}
                  strokeWidth={0.3}
                  opacity={(0.15 + Math.sin(tick * 0.06 + i) * 0.1) * (selectedMission ? 0.3 : 1)}
                />
                <circle
                  r={pulseR}
                  fill={zone.color}
                  opacity={(0.04 + Math.sin(tick * 0.04 + i * 2) * 0.02) * (selectedMission ? 0.3 : 1)}
                  stroke={zone.color}
                  strokeWidth={0.4}
                  strokeOpacity={0.2 * (selectedMission ? 0.3 : 1)}
                />
                <text
                  y={-pulseR - 3}
                  textAnchor="middle"
                  fill={zone.color}
                  fontSize={3.5}
                  fontFamily="monospace"
                  opacity={0.5 * (selectedMission ? 0.3 : 1)}
                >
                  {zone.label}
                </text>
              </Marker>
            );
          })}

          {/* Threat event markers */}
          {threats
            .filter((t) => t.coordinates)
            .map((threat) => {
              const color =
                threat.severity === "critical"
                  ? "#ef4444"
                  : threat.severity === "high"
                  ? "#f59e0b"
                  : "#06b6d4";
              const pulse = 2 + Math.sin(tick * 0.08) * 1;
              return (
                <Marker
                  key={`threat-${threat.id}`}
                  coordinates={[threat.coordinates!.lng, threat.coordinates!.lat]}
                >
                  <circle r={pulse + 3} fill={color} opacity={0.06} />
                  <circle r={pulse} fill="none" stroke={color} strokeWidth={0.4} opacity={0.3} />
                  <circle r={1.2} fill={color} opacity={0.7} />
                  <line x1={-3} x2={3} y1={0} y2={0} stroke={color} strokeWidth={0.2} opacity={0.4} />
                  <line x1={0} x2={0} y1={-3} y2={3} stroke={color} strokeWidth={0.2} opacity={0.4} />
                </Marker>
              );
            })}

          {/* Satellite tracks */}
          {satPositions.map((sat) => (
            <Marker key={`sat-${sat.id}`} coordinates={[sat.lng, sat.lat]}>
              <circle r={1} fill={sat.color} opacity={0.7} />
              <circle r={2.5} fill="none" stroke={sat.color} strokeWidth={0.3} opacity={0.3} />
              {[1, 2, 3, 4].map((t) => (
                <circle
                  key={t}
                  cx={-t * 2 * Math.sign(sat.speed)}
                  r={0.6}
                  fill={sat.color}
                  opacity={0.4 - t * 0.08}
                />
              ))}
            </Marker>
          ))}

          {/* HQ Marker (London) */}
          <Marker coordinates={[HQ.lng, HQ.lat]}>
            <rect
              x={-4} y={-4} width={8} height={8}
              fill="none" stroke="#c9a84c" strokeWidth={0.8} opacity={0.8}
              transform={`rotate(${45 + tick * 0.5})`}
              style={{ transformOrigin: "0 0" }}
            />
            <rect
              x={-2.5} y={-2.5} width={5} height={5}
              fill="none" stroke="#c9a84c" strokeWidth={0.5} opacity={0.5}
              transform={`rotate(${-tick * 0.3})`}
              style={{ transformOrigin: "0 0" }}
            />
            <circle r={1.5} fill="#c9a84c" opacity={0.9} />
            <text y={-8} textAnchor="middle" fill="#c9a84c" fontSize={4} fontFamily="monospace" fontWeight="bold" opacity={0.8}>
              MI6 HQ
            </text>
          </Marker>

          {/* Agent markers */}
          {agents.map((agent) => {
            const color = statusColor[agent.status];
            const isSelected = selectedAgent?.id === agent.id;
            const isHovered = hoveredAgent === agent.id;
            const isMissionAgent = selectedMission?.assignedAgents.includes(agent.id);
            const show = isSelected || isHovered;

            return (
              <Marker
                key={agent.id}
                coordinates={[agent.location.lng, agent.location.lat]}
                onClick={() => onAgentSelect(agent)}
                onMouseEnter={() => setHoveredAgent(agent.id)}
                onMouseLeave={() => setHoveredAgent(null)}
              >
                {/* Pulse rings */}
                {agent.status !== "dark" && (
                  <>
                    <circle
                      r={4 + Math.sin(tick * 0.06) * 2}
                      fill="none"
                      stroke={color}
                      strokeWidth={0.5}
                      opacity={0.2 + Math.sin(tick * 0.06) * 0.1}
                    />
                    <circle
                      r={7 + Math.sin(tick * 0.04 + 1) * 3}
                      fill="none"
                      stroke={color}
                      strokeWidth={0.3}
                      opacity={0.1}
                    />
                  </>
                )}

                {/* Mission agent highlight - extra ring */}
                {isMissionAgent && (
                  <circle
                    r={12}
                    fill="none"
                    stroke={missionZoneColor}
                    strokeWidth={0.6}
                    opacity={0.4 + Math.sin(tick * 0.08) * 0.2}
                    strokeDasharray="2 1.5"
                    strokeDashoffset={tick * 0.4}
                  />
                )}

                {/* Selection highlight */}
                {isSelected && (
                  <>
                    <circle r={10} fill={color} opacity={0.05} />
                    <circle
                      r={10} fill="none" stroke={color} strokeWidth={0.8} opacity={0.5}
                      strokeDasharray="2 2" strokeDashoffset={tick * 0.3}
                    />
                  </>
                )}

                {/* Main dot */}
                <circle
                  r={isSelected ? 3.5 : isHovered ? 3 : isMissionAgent ? 3 : 2.2}
                  fill={color}
                  opacity={agent.status === "dark" ? 0.3 : 0.9}
                />
                <circle r={1} fill="white" opacity={agent.status === "dark" ? 0.1 : 0.4} />

                {/* Label popup */}
                {show && (
                  <g>
                    <rect
                      x={6} y={-14} width={55} height={22} rx={1.5}
                      fill="#111118" stroke={color} strokeWidth={0.5} opacity={0.95}
                    />
                    <polygon points="5,-5 6,-3 6,-7" fill="#111118" stroke={color} strokeWidth={0.3} />
                    <text x={10} y={-5} fill={color} fontSize={4} fontFamily="monospace" fontWeight="bold">
                      {agent.codename}
                    </text>
                    <text x={10} y={1} fill="#71717a" fontSize={2.8} fontFamily="monospace">
                      {agent.location.city} // {agent.status.toUpperCase()}
                    </text>
                    <text x={10} y={5} fill="#71717a" fontSize={2.5} fontFamily="monospace">
                      {agent.location.lat.toFixed(2)}°N {agent.location.lng.toFixed(2)}°E
                    </text>
                  </g>
                )}
              </Marker>
            );
          })}
        </ZoomableGroup>
      </ComposableMap>

      {/* Map legend - bottom left */}
      <div className="absolute bottom-3 left-3 flex gap-4 text-[10px] font-mono z-20">
        {[
          { label: "ACTIVE", color: "bg-success" },
          { label: "COMPROMISED", color: "bg-destructive" },
          { label: "EXTRACTION", color: "bg-warning" },
          { label: "DARK", color: "bg-muted-foreground" },
          { label: "STANDBY", color: "bg-cyan" },
        ].map((item) => (
          <div key={item.label} className="flex items-center gap-1.5 opacity-60">
            <div className={`w-2 h-2 rounded-full ${item.color}`} />
            <span>{item.label}</span>
          </div>
        ))}
      </div>

      {/* Bottom right coordinates */}
      <div className="absolute bottom-3 right-3 text-[9px] font-mono text-gold/30 z-20">
        CENTER: {position.coordinates[1].toFixed(1)}°N {position.coordinates[0].toFixed(1)}°E
      </div>

      {/* Active agents count overlay */}
      <div className="absolute top-2 left-1/2 -translate-x-1/2 z-20 flex items-center gap-3 pointer-events-none">
        <div className="flex items-center gap-1 px-2 py-0.5 bg-card/70 border border-border/50 rounded text-[9px]">
          <div className="w-1 h-1 rounded-full bg-success animate-pulse" />
          <span className="text-muted-foreground">{agents.filter((a) => a.status === "active").length} ACTIVE</span>
        </div>
        <div className="flex items-center gap-1 px-2 py-0.5 bg-card/70 border border-destructive/30 rounded text-[9px]">
          <div className="w-1 h-1 rounded-full bg-destructive animate-pulse" />
          <span className="text-destructive/70">{agents.filter((a) => a.status === "compromised").length} COMPROMISED</span>
        </div>
        <div className="flex items-center gap-1 px-2 py-0.5 bg-card/70 border border-warning/30 rounded text-[9px]">
          <div className="w-1 h-1 rounded-full bg-warning animate-pulse" />
          <span className="text-warning/70">{agents.filter((a) => a.status === "extraction").length} EXTRACTION</span>
        </div>
      </div>
    </div>
  );
}
