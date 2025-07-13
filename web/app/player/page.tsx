"use client";
import { useState, useEffect } from "react";
import { CircularCarousel } from "../components/ui/CircularCarousel";
import ProfileCard from "../components/ui/ProfileCard";
import PerformancePredictionGraph from "../components/PerformancePredictionGraph";
import Loader from "../components/Loader";
import { useSearchParams } from "next/navigation";

interface PlayerCard {
  id: number;
  name: string;
  title: string;
  avatar: string;
  handle: string;
  status: string;
  goals?: number;
  assists?: number;
  current_season_stats?: { rating: number };
}

interface ApiPlayer {
  player: {
    id: number;
    name: string;
    photo: string;
  };
  statistics: Array<{
    team: {
      name: string;
    };
    league: {
      name: string;
    };
    games: {
      position: string;
      rating: string;
    };
    goals: {
      total: number;
      assists: number;
    };
  }>;
}

export default function PlayerPage() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedPlayer, setSelectedPlayer] = useState<PlayerCard | null>(null);
  const [players, setPlayers] = useState<PlayerCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [detailedPlayerData, setDetailedPlayerData] = useState<any>(null);
  const [showBuyModal, setShowBuyModal] = useState(false);
  const [buyAmount, setBuyAmount] = useState(1);
  const [teamName, setTeamName] = useState<string>("");
  
  const searchParams = useSearchParams();
  const teamId = searchParams.get('team');

  // Keep selectedPlayer in sync with currentIndex
  useEffect(() => {
    if (players.length > 0) {
      setSelectedPlayer(players[currentIndex]);
    }
  }, [currentIndex, players]);

  // Fetch team players
  useEffect(() => {
    const fetchTeamPlayers = async () => {
      if (!teamId) {
        setError("No team ID provided");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const response = await fetch(`/api/team-players?teamId=${teamId}`);

        if (!response.ok) {
          throw new Error("Failed to fetch team players");
        }

        const data = await response.json();

        if (data.response && Array.isArray(data.response)) {
          const transformedPlayers: PlayerCard[] = data.response.map(
            (apiPlayer: ApiPlayer) => {
              const stats = apiPlayer.statistics[0]; // Get first team's stats
              return {
                id: apiPlayer.player.id,
                name: apiPlayer.player.name,
                title: stats?.games?.position || "Player",
                avatar: apiPlayer.player.photo,
                handle: apiPlayer.player.name.toLowerCase().replace(/\s+/g, ""),
                status: "Online",
                goals: stats?.goals?.total || 0,
                assists: stats?.goals?.assists || 0,
                current_season_stats: {
                  rating: parseFloat(stats?.games?.rating || "7.0"),
                },
              };
            }
          );
          setPlayers(transformedPlayers);
          
          // Set team name from first player's team
          if (data.response[0]?.statistics[0]?.team?.name) {
            setTeamName(data.response[0].statistics[0].team.name);
          }
        } else {
          setPlayers([]);
        }
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to fetch team players"
        );
        // Fallback to mock data if API fails
        setPlayers([
          {
            id: 1,
            name: "Lionel Messi",
            title: "Forward",
            avatar: "https://i.imgur.com/1Y2WwX2.jpeg",
            handle: "leomessi",
            status: "Online",
            goals: 10,
            assists: 8,
            current_season_stats: { rating: 8.5 },
          },
          {
            id: 2,
            name: "Cristiano Ronaldo",
            title: "Forward",
            avatar: "https://i.imgur.com/tX0P2Ct.jpeg",
            handle: "cristiano",
            status: "Online",
            goals: 12,
            assists: 6,
            current_season_stats: { rating: 8.2 },
          },
          {
            id: 3,
            name: "Neymar Jr",
            title: "Forward",
            avatar: "https://i.imgur.com/MiU8N3p.jpeg",
            handle: "neymarjr",
            status: "Online",
            goals: 7,
            assists: 9,
            current_season_stats: { rating: 7.8 },
          },
        ]);
        setTeamName("Barcelona"); // Fallback team name
      } finally {
        setLoading(false);
      }
    };

    fetchTeamPlayers();
  }, [teamId]);

  // Fetch detailed player data when a player is selected
  useEffect(() => {
    const fetchPlayerDetails = async () => {
      if (!selectedPlayer) {
        setDetailedPlayerData(null);
        return;
      }

      try {
        const response = await fetch(
          `/api/player?playerId=${selectedPlayer.id}`
        );

        if (!response.ok) {
          throw new Error("Failed to fetch player details");
        }

        const data = await response.json();
        setDetailedPlayerData(data.response?.[0] || null);
      } catch (err) {
        console.error("Failed to fetch player details:", err);
        setDetailedPlayerData(null);
      }
    };

    fetchPlayerDetails();
  }, [selectedPlayer]);

  if (loading) {
    return <Loader size="lg" />;
  }

  if (error) {
    return (
      <main className="flex min-h-screen items-center justify-center text-white bg-black">
        <div className="text-center">
          <p className="text-red-400 mb-4">Error: {error}</p>
          <p className="text-zinc-500">Using fallback data</p>
        </div>
      </main>
    );
  }

  return (
    <main className="flex min-h-screen items-start justify-start overflow-hidden text-white">
      {/* Left side - Player Carousel */}
      <div className="w-1/2 p-8 flex flex-col items-center gap-6">
        <div className="text-center mb-6">
          <h2 className="text-4xl font-bold text-white mb-2">{teamName}</h2>
          <h3 className="text-2xl font-thin text-red-400 uppercase tracking-wide">Select Player</h3>
        </div>
        
        {players.length > 0 ? (
          <>
            <div className="flex flex-col items-center gap-4 w-full">
              <CircularCarousel
                itemWidth={320}
                items={players.map((player, idx) => (
                  <div
                    key={player.id}
                    className={`transition-all duration-200 ${
                      idx === currentIndex ? "scale-105" : "hover:scale-102"
                    }`}
                  >
                    <ProfileCard
                      avatarUrl={player.avatar}
                      name={player.name}
                      title={player.title}
                    />
                  </div>
                ))}
                currentIndex={currentIndex}
                onChange={setCurrentIndex}
              />

              {/* Buy Now Button */}
              <div className="text-center mt-6">
                <button
                  className="relative h-12 px-8 py-2 text-white font-mono font-bold uppercase tracking-wide overflow-hidden group"
                  style={{
                    background: "linear-gradient(90deg, rgba(207, 10, 10, 0.2) 0%, rgba(207, 10, 10, 0.4) 100%)",
                   
                    border: "1px solid rgba(207, 10, 10, 0.5)",
                    boxShadow: "0 0 20px rgba(207, 10, 10, 0.4)",
                  }}
                  onClick={() => setShowBuyModal(true)}
                >
                  <span className="relative z-10">Buy Fan Token</span>
                  <div className="absolute inset-0 bg-red-500 opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
                </button>
              </div>
            </div>
            
            {/* Buy Modal */}
            {showBuyModal && selectedPlayer && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
                <div className="bg-zinc-900/95 border border-red-500/30 rounded-2xl w-full max-w-md relative shadow-2xl">
                  {/* Modal Header */}
                  <div className="bg-zinc-800/50 border-b border-zinc-700 p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-[linear-gradient(90deg,rgba(207,10,10,0.8)_0%,rgba(207,10,10,1)_100%)] rounded-xl flex items-center justify-center">
                          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                          </svg>
                        </div>
                        <div>
                          <h3 className="text-2xl font-black text-[#cf0a0a] gaming-text">
                            Buy Fan Token
                          </h3>
                          <p className="text-zinc-400 text-sm mt-1">
                            Purchase tokens for {selectedPlayer.name}
                          </p>
                        </div>
                      </div>
                      <button
                        className="text-zinc-400 hover:text-white text-2xl transition-colors duration-200"
                        onClick={() => setShowBuyModal(false)}
                        aria-label="Close"
                      >
                        &times;
                      </button>
                    </div>
                  </div>

                  {/* Modal Content */}
                  <div className="p-6">
                    <div className="space-y-6">
                      {/* Player Info */}
                      <div className="bg-zinc-800/30 rounded-xl p-4 border border-zinc-700/50">
                        <div className="flex items-center space-x-3 mb-4">
                          <div className="w-8 h-8 bg-[linear-gradient(90deg,rgba(207,10,10,0.6)_0%,rgba(207,10,10,0.8)_100%)] rounded-lg flex items-center justify-center">
                            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                          </div>
                          <span className="text-zinc-200 font-semibold">Player Details</span>
                        </div>
                        <div className="space-y-2">
                          <div className="flex justify-between items-center">
                            <span className="text-zinc-400 text-sm">Player:</span>
                            <span className="text-white font-medium">{selectedPlayer.name}</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-zinc-400 text-sm">Position:</span>
                            <span className="text-zinc-300 font-medium">{selectedPlayer.title}</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-zinc-400 text-sm">Availability:</span>
                            <span className="text-white font-medium">1,000 tokens</span>
                          </div>
                        </div>
                      </div>

                      {/* Price Info */}
                      <div className="bg-zinc-800/30 rounded-xl p-4 border border-zinc-700/50">
                        <div className="flex items-center space-x-3 mb-4">
                          <div className="w-8 h-8 bg-[linear-gradient(90deg,rgba(207,10,10,0.6)_0%,rgba(207,10,10,0.8)_100%)] rounded-lg flex items-center justify-center">
                            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                            </svg>
                          </div>
                          <span className="text-zinc-200 font-semibold">Pricing</span>
                        </div>
                        <div className="space-y-2">
                          <div className="flex justify-between items-center">
                            <span className="text-zinc-400 text-sm">Token Price:</span>
                            <span className="text-[#cf0a0a] font-bold text-lg">$2.50</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-zinc-400 text-sm">Total Value:</span>
                            <span className="text-white font-medium">${(buyAmount * 2.50).toFixed(2)}</span>
                          </div>
                        </div>
                      </div>

                      {/* Quantity Input */}
                      <div className="space-y-3">
                        <label
                          className="block text-zinc-200 font-semibold flex items-center space-x-2"
                          htmlFor="buy-amount"
                        >
                          <svg className="w-4 h-4 text-[#cf0a0a]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
                          </svg>
                          <span>Number of Tokens</span>
                        </label>
                        <input
                          id="buy-amount"
                          type="number"
                          min={1}
                          max={1000}
                          value={buyAmount}
                          onChange={(e) => setBuyAmount(Number(e.target.value))}
                          className="w-full px-4 py-3 rounded-xl border border-zinc-600 bg-zinc-800/50 text-white placeholder-zinc-400 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-red-400 focus:border-red-400 transition-all duration-200"
                          placeholder="Enter quantity..."
                        />
                        <div className="flex justify-between text-xs text-zinc-500">
                          <span>Min: 1</span>
                          <span>Max: 1,000</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Modal Footer */}
                  <div className="bg-zinc-800/30 border-t border-zinc-700 p-6">
                    <div className="flex space-x-3">
                      <button
                        onClick={() => setShowBuyModal(false)}
                        className="flex-1 bg-transparent border border-zinc-600 text-zinc-300 hover:bg-zinc-700 hover:text-white py-3 rounded-xl transition-all duration-200 font-medium"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={() => {
                          /* handle buy logic here */
                          setShowBuyModal(false);
                        }}
                        className="flex-1 bg-[linear-gradient(90deg,rgba(207,10,10,0.2)_0%,rgba(207,10,10,0.4)_100%)] text-[#cf0a0a] font-bold hover:bg-[linear-gradient(90deg,rgba(207,10,10,0.4)_0%,rgba(207,10,10,0.6)_100%)] hover:text-white transition-all duration-300 py-3 rounded-xl border border-red-500/30"
                      >
                        Buy Tokens
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="text-center text-zinc-400">
            <p>No players found</p>
          </div>
        )}
      </div>

      {/* Right side - Performance Graph */}
      <div className="w-1/2 p-8 overflow-y-auto max-h-screen">
        {selectedPlayer ? (
          <div className="h-full">
            <h3 className="text-2xl font-bold text-white mb-6">Performance Analysis</h3>
            <PerformancePredictionGraph
              player={{
                id: selectedPlayer.id,
                name: selectedPlayer.name,
                goals: selectedPlayer.goals || 0,
                assists: selectedPlayer.assists || 0,
                current_season_stats: {
                  rating: selectedPlayer.current_season_stats?.rating || 7.0,
                },
              }}
              detailedData={detailedPlayerData}
            />
          </div>
        ) : (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <h3 className="text-2xl font-bold text-zinc-400 mb-4">
                Select a Player
              </h3>
              <p className="text-zinc-500">
                Choose a player from the carousel to view their performance
                analysis
              </p>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
