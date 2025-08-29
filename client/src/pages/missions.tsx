import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Navbar from "@/components/navbar";
import MissionCard from "@/components/mission-card";
import MissionModal from "@/components/mission-modal";
import ResultsModal from "@/components/results-modal";
import { useMissions } from "@/hooks/use-missions";
import type { Mission } from "@shared/schema";

export default function MissionsPage() {
  const [selectedMission, setSelectedMission] = useState<Mission | null>(null);
  const [showResults, setShowResults] = useState(false);
  const [currentResult, setCurrentResult] = useState<any>(null);

  const { data: missions = [] } = useQuery({
    queryKey: ["/api/missions"]
  });

  const { data: userProgress = [] } = useQuery({
    queryKey: ["/api/user/user1/progress"]
  });

  const { data: user } = useQuery({
    queryKey: ["/api/user/user1"]
  });

  const { data: leaderboard = [] } = useQuery({
    queryKey: ["/api/leaderboard"]
  });

  const handleStartMission = (mission: Mission) => {
    setSelectedMission(mission);
  };

  const handleCloseMission = () => {
    setSelectedMission(null);
  };

  const handleShowResults = (result: any) => {
    setCurrentResult(result);
    setShowResults(true);
  };

  const handleCloseResults = () => {
    setShowResults(false);
    setCurrentResult(null);
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      
      <main className="pt-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Gamified MIL Missions
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Build critical thinking skills through interactive challenges and earn points on the leaderboard
          </p>
        </div>

        {/* User Stats & Progress Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          <div className="bg-card border border-border rounded-xl p-6 text-center" data-testid="stat-total-score">
            <div className="text-3xl font-bold text-primary mb-2">{user?.totalScore || 0}</div>
            <div className="text-sm text-muted-foreground">Total Score</div>
          </div>
          <div className="bg-card border border-border rounded-xl p-6 text-center" data-testid="stat-missions-completed">
            <div className="text-3xl font-bold text-accent mb-2">{user?.missionsCompleted || 0}</div>
            <div className="text-sm text-muted-foreground">Missions Completed</div>
          </div>
          <div className="bg-card border border-border rounded-xl p-6 text-center" data-testid="stat-achievements">
            <div className="text-3xl font-bold text-yellow-500 mb-2">{user?.achievements?.length || 0}</div>
            <div className="text-sm text-muted-foreground">Achievements</div>
          </div>
          <div className="bg-card border border-border rounded-xl p-6 text-center" data-testid="stat-global-rank">
            <div className="text-3xl font-bold text-purple-500 mb-2">#{user?.globalRank || "N/A"}</div>
            <div className="text-sm text-muted-foreground">Global Rank</div>
          </div>
        </div>

        {/* Mission Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8 mb-12">
          {missions.map((mission: Mission) => {
            const progress = userProgress.find((p: any) => p.missionId === mission.id);
            return (
              <MissionCard
                key={mission.id}
                mission={mission}
                progress={progress}
                onStart={() => handleStartMission(mission)}
              />
            );
          })}
        </div>

        {/* Leaderboard & Achievements Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Leaderboard */}
          <div className="bg-card border border-border rounded-2xl p-8" data-testid="leaderboard-section">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
              <span className="text-2xl">🏆</span>
              Global Leaderboard
            </h2>
            
            <div className="space-y-4">
              {leaderboard.slice(0, 5).map((user: any, index: number) => (
                <div key={user.id} className={`leaderboard-entry flex items-center justify-between p-4 rounded-xl ${
                  index === 0 ? 'bg-gradient-to-r from-yellow-500/10 to-yellow-600/5 border border-yellow-500/20' :
                  index === 1 ? 'bg-gradient-to-r from-gray-400/10 to-gray-500/5 border border-gray-400/20' :
                  index === 2 ? 'bg-gradient-to-r from-amber-600/10 to-amber-700/5 border border-amber-600/20' :
                  'bg-gradient-to-r from-muted/50 to-muted/25 border border-border'
                }`} data-testid={`leaderboard-entry-${index}`}>
                  <div className="flex items-center gap-4">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                      index === 0 ? 'bg-yellow-500 text-yellow-50' :
                      index === 1 ? 'bg-gray-400 text-gray-50' :
                      index === 2 ? 'bg-amber-600 text-amber-50' :
                      'bg-muted text-muted-foreground'
                    }`}>
                      {index + 1}
                    </div>
                    <div>
                      <div className="font-semibold">{user.username}</div>
                      <div className="text-sm text-muted-foreground">{user.level}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={`font-bold ${
                      index === 0 ? 'text-yellow-500' :
                      index === 1 ? 'text-gray-400' :
                      index === 2 ? 'text-amber-600' :
                      'text-foreground'
                    }`}>
                      {user.totalScore}
                    </div>
                    <div className="text-xs text-muted-foreground">points</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Achievements */}
          <div className="bg-card border border-border rounded-2xl p-8" data-testid="achievements-section">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
              <span className="text-2xl">🎖️</span>
              Recent Achievements
            </h2>
            
            <div className="space-y-4">
              {user?.achievements?.slice(0, 3).map((achievement: string, index: number) => (
                <div key={achievement} className="achievement-badge flex items-center gap-4 p-4 bg-gradient-to-r from-emerald-500/10 to-emerald-600/5 border border-emerald-500/20 rounded-xl" data-testid={`achievement-${index}`}>
                  <div className="w-12 h-12 bg-emerald-500/20 rounded-xl flex items-center justify-center text-2xl">🎯</div>
                  <div>
                    <div className="font-semibold">{achievement}</div>
                    <div className="text-sm text-muted-foreground">Achievement unlocked!</div>
                  </div>
                </div>
              )) || (
                <div className="text-center py-8 text-muted-foreground">
                  <p>No achievements yet. Complete missions to earn them!</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Modals */}
      {selectedMission && (
        <MissionModal
          mission={selectedMission}
          onClose={handleCloseMission}
          onShowResults={handleShowResults}
        />
      )}

      {showResults && currentResult && (
        <ResultsModal
          result={currentResult}
          onClose={handleCloseResults}
          onNext={() => {
            setShowResults(false);
            // Handle next question logic
          }}
        />
      )}
    </div>
  );
}
