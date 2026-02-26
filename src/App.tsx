import { useState } from "react";
import TopBar from "./components/TopBar";
import StatsBar from "./components/StatsBar";
import WorldMap from "./components/WorldMap";
import AgentPanel from "./components/AgentPanel";
import AgentDetail from "./components/AgentDetail";
import ThreatFeed from "./components/ThreatFeed";
import MissionBriefing from "./components/MissionBriefing";
import SatellitePanel from "./components/SatellitePanel";
import RadarWidget from "./components/RadarWidget";
import CryptoTerminal from "./components/CryptoTerminal";
import { agents, missions, threatFeed, satellitePasses } from "./data/mock";
import type { Agent, Mission } from "./data/mock";

export default function App() {
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null);
  const [selectedMission, setSelectedMission] = useState<Mission | null>(null);

  const handleMissionSelect = (mission: Mission) => {
    setSelectedMission((prev) => (prev?.id === mission.id ? null : mission));
  };

  return (
    <div className="h-screen w-screen flex flex-col bg-background text-foreground overflow-hidden">
      {/* Top bar */}
      <TopBar />

      {/* Main content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left sidebar - Agents */}
        <div className="w-64 flex-shrink-0">
          <AgentPanel
            agents={agents}
            selectedAgent={selectedAgent}
            onAgentSelect={setSelectedAgent}
          />
        </div>

        {/* Center area */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Map area */}
          <div className="flex-1 relative p-2">
            <WorldMap
              agents={agents}
              threats={threatFeed}
              onAgentSelect={setSelectedAgent}
              selectedAgent={selectedAgent}
              selectedMission={selectedMission}
            />

            {/* Agent detail overlay */}
            {selectedAgent && (
              <AgentDetail
                agent={selectedAgent}
                onClose={() => setSelectedAgent(null)}
              />
            )}
          </div>

          {/* Bottom panels */}
          <div className="h-56 flex border-t border-border flex-shrink-0">
            <div className="flex-1 border-r border-border">
              <CryptoTerminal />
            </div>
            <div className="w-44 border-r border-border">
              <RadarWidget />
            </div>
            <div className="w-64">
              <SatellitePanel passes={satellitePasses} />
            </div>
          </div>
        </div>

        {/* Right sidebar */}
        <div className="w-72 flex-shrink-0 flex flex-col border-l border-border">
          <div className="flex-1 border-b border-border overflow-hidden">
            <MissionBriefing
              missions={missions}
              selectedMission={selectedMission}
              onMissionSelect={handleMissionSelect}
            />
          </div>
          <div className="h-[45%] overflow-hidden">
            <ThreatFeed threats={threatFeed} />
          </div>
        </div>
      </div>

      {/* Bottom stats bar */}
      <StatsBar />
    </div>
  );
}
