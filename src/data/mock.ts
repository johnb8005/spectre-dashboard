export interface Agent {
  id: string;
  codename: string;
  realName: string;
  status: "active" | "compromised" | "extraction" | "dark" | "standby";
  location: { lat: number; lng: number; city: string; country: string };
  mission: string;
  lastContact: string;
  heartbeat: number;
  coverIdentity: string;
}

export interface Mission {
  id: string;
  codename: string;
  classification: "TOP SECRET" | "SECRET" | "CLASSIFIED";
  status: "active" | "pending" | "completed" | "aborted";
  priority: "critical" | "high" | "medium" | "low";
  region: string;
  briefing: string;
  assignedAgents: string[];
  deadline: string;
  /** Center point of the operational zone */
  zoneCenter: [number, number];
  /** Polygon outline of the operational zone [lng, lat][] */
  zonePolygon: [number, number][];
  /** Key intel points within the zone */
  intelMarkers: { coords: [number, number]; label: string; type: "asset" | "target" | "safehouse" | "comms" }[];
}

export interface ThreatEvent {
  id: string;
  timestamp: string;
  type: "intercept" | "movement" | "signal" | "breach" | "anomaly";
  severity: "critical" | "high" | "medium" | "low";
  source: string;
  message: string;
  coordinates?: { lat: number; lng: number };
}

export interface SatellitePass {
  id: string;
  designation: string;
  type: "SIGINT" | "IMINT" | "ELINT" | "COMINT";
  overRegion: string;
  windowStart: string;
  windowEnd: string;
  status: "scheduled" | "active" | "completed";
}

export const agents: Agent[] = [
  {
    id: "007",
    codename: "NIGHTSHADE",
    realName: "[REDACTED]",
    status: "active",
    location: { lat: 48.8566, lng: 2.3522, city: "Paris", country: "France" },
    mission: "OP-GOLDEN VIPER",
    lastContact: "2 min ago",
    heartbeat: 98,
    coverIdentity: "Art Dealer",
  },
  {
    id: "003",
    codename: "PHANTOM",
    realName: "[REDACTED]",
    status: "active",
    location: { lat: 55.7558, lng: 37.6173, city: "Moscow", country: "Russia" },
    mission: "OP-IRON CURTAIN",
    lastContact: "8 min ago",
    heartbeat: 94,
    coverIdentity: "Energy Consultant",
  },
  {
    id: "009",
    codename: "VIPER",
    realName: "[REDACTED]",
    status: "compromised",
    location: { lat: 31.2304, lng: 121.4737, city: "Shanghai", country: "China" },
    mission: "OP-SILK ROAD",
    lastContact: "47 min ago",
    heartbeat: 23,
    coverIdentity: "Import/Export",
  },
  {
    id: "002",
    codename: "SPECTER",
    realName: "[REDACTED]",
    status: "extraction",
    location: { lat: 36.2048, lng: 138.2529, city: "Tokyo", country: "Japan" },
    mission: "OP-RISING SUN",
    lastContact: "3 min ago",
    heartbeat: 76,
    coverIdentity: "Tech Executive",
  },
  {
    id: "006",
    codename: "WRAITH",
    realName: "[REDACTED]",
    status: "dark",
    location: { lat: -33.8688, lng: 151.2093, city: "Sydney", country: "Australia" },
    mission: "OP-SOUTHERN CROSS",
    lastContact: "6 hrs ago",
    heartbeat: 0,
    coverIdentity: "Marine Biologist",
  },
  {
    id: "004",
    codename: "ORACLE",
    realName: "[REDACTED]",
    status: "active",
    location: { lat: 25.2048, lng: 55.2708, city: "Dubai", country: "UAE" },
    mission: "OP-SANDSTORM",
    lastContact: "1 min ago",
    heartbeat: 99,
    coverIdentity: "Financial Advisor",
  },
  {
    id: "008",
    codename: "RAVEN",
    realName: "[REDACTED]",
    status: "standby",
    location: { lat: 51.5074, lng: -0.1278, city: "London", country: "UK" },
    mission: "UNASSIGNED",
    lastContact: "Just now",
    heartbeat: 100,
    coverIdentity: "MI6 HQ",
  },
  {
    id: "005",
    codename: "BLACKOUT",
    realName: "[REDACTED]",
    status: "active",
    location: { lat: 19.4326, lng: -99.1332, city: "Mexico City", country: "Mexico" },
    mission: "OP-AZTEC GOLD",
    lastContact: "14 min ago",
    heartbeat: 87,
    coverIdentity: "Journalist",
  },
];

export const missions: Mission[] = [
  {
    id: "M-001",
    codename: "GOLDEN VIPER",
    classification: "TOP SECRET",
    status: "active",
    priority: "critical",
    region: "Western Europe",
    briefing: "Intercept and neutralize arms shipment routed through Marseille. Intel suggests connection to SPECTRE cell operating in Mediterranean.",
    assignedAgents: ["007"],
    deadline: "2026-03-01",
    zoneCenter: [3.0, 45.0],
    zonePolygon: [
      [-5, 48], [3, 51], [8, 49], [10, 46], [7, 43], [3, 41], [-2, 43], [-5, 46], [-5, 48],
    ],
    intelMarkers: [
      { coords: [5.37, 43.30], label: "ARMS CACHE", type: "target" },
      { coords: [2.35, 48.86], label: "NIGHTSHADE", type: "asset" },
      { coords: [7.27, 43.71], label: "SAFEHOUSE NICE", type: "safehouse" },
      { coords: [1.44, 43.60], label: "RELAY TOULOUSE", type: "comms" },
    ],
  },
  {
    id: "M-002",
    codename: "IRON CURTAIN",
    classification: "TOP SECRET",
    status: "active",
    priority: "critical",
    region: "Eastern Europe",
    briefing: "Deep cover infiltration of suspected nuclear proliferation network. Agent embedded in Rosatom subsidiary.",
    assignedAgents: ["003"],
    deadline: "2026-04-15",
    zoneCenter: [38.0, 56.0],
    zonePolygon: [
      [30, 60], [37, 62], [45, 60], [46, 55], [42, 51], [35, 50], [30, 53], [30, 60],
    ],
    intelMarkers: [
      { coords: [37.62, 55.76], label: "PHANTOM", type: "asset" },
      { coords: [30.32, 59.93], label: "DEAD DROP SPB", type: "comms" },
      { coords: [39.72, 54.19], label: "NUCLEAR SITE", type: "target" },
      { coords: [33.0, 56.3], label: "SAFEHOUSE SMOL", type: "safehouse" },
    ],
  },
  {
    id: "M-003",
    codename: "SILK ROAD",
    classification: "SECRET",
    status: "active",
    priority: "high",
    region: "East Asia",
    briefing: "Track and disrupt cyber-espionage operation targeting Western defense contractors. Agent status: COMPROMISED - extraction pending.",
    assignedAgents: ["009"],
    deadline: "2026-02-28",
    zoneCenter: [121.0, 31.0],
    zonePolygon: [
      [117, 34], [122, 35], [125, 33], [124, 29], [120, 27], [117, 29], [117, 34],
    ],
    intelMarkers: [
      { coords: [121.47, 31.23], label: "VIPER (BLOWN)", type: "asset" },
      { coords: [120.15, 30.27], label: "CYBER NODE", type: "target" },
      { coords: [118.80, 32.06], label: "EXFIL POINT", type: "safehouse" },
      { coords: [121.80, 29.87], label: "SIGINT TAP", type: "comms" },
    ],
  },
  {
    id: "M-004",
    codename: "SANDSTORM",
    classification: "TOP SECRET",
    status: "active",
    priority: "high",
    region: "Middle East",
    briefing: "Monitor financial flows through Dubai shell companies linked to terrorist financing network.",
    assignedAgents: ["004"],
    deadline: "2026-05-20",
    zoneCenter: [55.0, 25.0],
    zonePolygon: [
      [51, 27], [55, 28], [57, 26], [56, 23], [53, 22], [51, 24], [51, 27],
    ],
    intelMarkers: [
      { coords: [55.27, 25.20], label: "ORACLE", type: "asset" },
      { coords: [54.37, 24.45], label: "SHELL CO. HQ", type: "target" },
      { coords: [55.95, 25.80], label: "SAFEHOUSE DXB", type: "safehouse" },
      { coords: [53.68, 24.03], label: "FININT TAP", type: "comms" },
    ],
  },
  {
    id: "M-005",
    codename: "RISING SUN",
    classification: "SECRET",
    status: "active",
    priority: "critical",
    region: "East Asia",
    briefing: "Extraction protocol initiated. Agent cover potentially blown during meeting with Yakuza intermediary. Standby for EXFIL.",
    assignedAgents: ["002"],
    deadline: "2026-02-27",
    zoneCenter: [139.0, 36.0],
    zonePolygon: [
      [136, 38], [140, 39], [142, 37], [141, 34], [138, 33], [136, 35], [136, 38],
    ],
    intelMarkers: [
      { coords: [139.69, 35.69], label: "SPECTER", type: "asset" },
      { coords: [135.50, 34.69], label: "YAKUZA MEET", type: "target" },
      { coords: [140.50, 37.50], label: "EXFIL COAST", type: "safehouse" },
      { coords: [137.10, 35.18], label: "RELAY NAGOYA", type: "comms" },
    ],
  },
];

export const threatFeed: ThreatEvent[] = [
  {
    id: "T-001",
    timestamp: "14:32:07",
    type: "intercept",
    severity: "critical",
    source: "SIGINT-ECHELON",
    message: "Encrypted burst transmission detected. Origin: 55.75°N 37.62°E. Pattern matches SPECTRE cipher protocol.",
    coordinates: { lat: 55.75, lng: 37.62 },
  },
  {
    id: "T-002",
    timestamp: "14:28:51",
    type: "breach",
    severity: "critical",
    source: "CYBER-DIV",
    message: "Firewall breach attempt on MI6 QUANTUM network. Attack vector: zero-day exploit. Source IP traced to Shanghai.",
    coordinates: { lat: 31.23, lng: 121.47 },
  },
  {
    id: "T-003",
    timestamp: "14:25:33",
    type: "movement",
    severity: "high",
    source: "HUMINT-PARIS",
    message: "Target VENOM spotted at Gare du Nord. Armed escort confirmed. Moving northeast toward Belgian border.",
    coordinates: { lat: 48.88, lng: 2.35 },
  },
  {
    id: "T-004",
    timestamp: "14:21:15",
    type: "signal",
    severity: "medium",
    source: "SAT-KEYHOLE",
    message: "Anomalous heat signature detected at coordinates 36.2°N 138.3°E. Possible underground facility activity.",
    coordinates: { lat: 36.2, lng: 138.3 },
  },
  {
    id: "T-005",
    timestamp: "14:18:42",
    type: "anomaly",
    severity: "high",
    source: "FININT-SWIFT",
    message: "Unusual wire transfer: $47M routed through 6 shell companies. Final destination: Cayman Islands account linked to JANUS.",
  },
  {
    id: "T-006",
    timestamp: "14:15:09",
    type: "intercept",
    severity: "medium",
    source: "COMINT-PRISM",
    message: "Phone intercept - known SPECTRE operative discussing 'delivery' timeline. Reference to 'the package' arriving Thursday.",
  },
  {
    id: "T-007",
    timestamp: "14:11:28",
    type: "movement",
    severity: "low",
    source: "IMINT-DRONE",
    message: "Routine patrol: No unusual activity at Site ECHO-7. Perimeter secure. Next pass scheduled 18:00 UTC.",
  },
  {
    id: "T-008",
    timestamp: "14:08:55",
    type: "breach",
    severity: "high",
    source: "COUNTER-INTEL",
    message: "Agent VIPER safe house potentially compromised. Surveillance detected on adjacent building. Recommending immediate relocation.",
    coordinates: { lat: 31.24, lng: 121.48 },
  },
];

export const satellitePasses: SatellitePass[] = [
  { id: "S-001", designation: "KH-14 CRYSTAL", type: "IMINT", overRegion: "Eastern Europe", windowStart: "15:00", windowEnd: "15:22", status: "scheduled" },
  { id: "S-002", designation: "MENTOR-7", type: "SIGINT", overRegion: "Middle East", windowStart: "14:30", windowEnd: "15:45", status: "active" },
  { id: "S-003", designation: "ORION-3", type: "ELINT", overRegion: "East Asia", windowStart: "16:00", windowEnd: "16:18", status: "scheduled" },
  { id: "S-004", designation: "MERCURY-12", type: "COMINT", overRegion: "South America", windowStart: "17:30", windowEnd: "17:52", status: "scheduled" },
];

export const systemStats = {
  encryptedChannels: 847,
  activeInterceptions: 23,
  satellitesOnline: 14,
  secureNodes: 2048,
  dataProcessed: "4.7 TB",
  threatLevel: "ELEVATED" as const,
  globalAlerts: 7,
  networkLatency: "12ms",
};
