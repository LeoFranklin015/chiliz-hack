'use client';

import React, { useRef, useState, useEffect } from 'react';
import { Users } from 'lucide-react';
import GameControls from '../components/GameControls';
import QRCodeModal from '../components/QRCodeModal';
import { useRouter } from 'next/navigation';
import { useAccount } from 'wagmi';
import { walletClient, client } from "../../lib/client";
import { GAME_CONTRACT_ABI } from '../../lib/const';


const GAME_CONTRACT_ADDRESS = "0x7a1ba7d0500eefef98f7da64d3f84b4ba501931c";

// Types
interface Player {
  name: string;
  asset: string;
  origin: string;
  height: string;
  shirt: string;
  pos: string;
  dob: string;
  goals: number;
  games: number;
  x: number;
  y: number;
}

interface Token {
  id: string;
  name: string;
  image: string;
  contractAddress?: string;
  playerData?: {
    playerId: string;
    playerName: string;
    teamName: string;
    position: string;
    teamCode: string;
    teamLogo: string;
    teamVenue: string;
    teamContractAddress: string;
    teamId: string;
    image: string;
    tokenName: string;
    tokenSymbol: string;
    deployedAt: string;
  };
}

// Formation positions for 5-a-side, on one half of the pitch
const formationPositions = [
  { x: 30, y: -270 },    // GK
  { x: 120, y: -360 },  // Defender L
  { x: 120, y: -180 },   // Defender R
  { x: 210, y: -315 },   // Forward L
  { x: 210, y: -225 },    // Forward R
];

const positionForIndex = (index: number) => formationPositions[index] || { x: 0, y: 0 };

// Convert token to field player
const toFieldPlayer = (token: Token, index: number): Player => {
  const pos = positionForIndex(index);
  return {
    name: token.name,
    asset: token.image,
    origin: 'N/A',
    height: 'N/A',
    shirt: (index + 1).toString(),
    pos: token.playerData?.position || 'N/A',
    dob: 'N/A',
    goals: 0,
    games: 0,
    x: pos.x,
    y: pos.y,
  };
};

// Player component
const PlayerDot = ({ player, active, onClick }: { player: Player; active: boolean; onClick(): void }) => (
  <div
    className="ff-player"
    style={{ 
      transform: `translateX(${player.x}px) translateY(${player.y}px)`,
      position: 'absolute',
      width: '50px',
      height: '50px',
      cursor: 'pointer',
      textAlign: 'center',
      zIndex: 10
    }}
    onClick={onClick}
  >
    <div className="ff-player__img">
      <img 
        src={player.asset} 
        alt={player.name} 
        width={50} 
        height={50}
        style={{
          borderRadius: '50%',
          border: active ? '2px solid #facc15' : '2px solid #10b981',
          boxShadow: active ? '0 0 8px #facc15' : 'none'
        }}
      />
    </div>
    <span 
      className="ff-player__label"
      style={{
        fontSize: '0.65rem',
        color: '#e5e7eb',
        whiteSpace: 'nowrap',
        textShadow: '0 1px 2px rgba(0,0,0,0.8)',
        display: 'block',
        marginTop: '2px'
      }}
    >
      {player.name}
    </span>
  </div>
);

// Helper ABI for ERC20
const ERC20_ABI = [
  {
    "constant": true,
    "inputs": [{ "name": "owner", "type": "address" }],
    "name": "balanceOf",
    "outputs": [{ "name": "", "type": "uint256" }],
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [
      { "name": "owner", "type": "address" },
      { "name": "spender", "type": "address" }
    ],
    "name": "allowance",
    "outputs": [{ "name": "", "type": "uint256" }],
    "type": "function"
  },
  {
    "constant": false,
    "inputs": [
      { "name": "spender", "type": "address" },
      { "name": "amount", "type": "uint256" }
    ],
    "name": "approve",
    "outputs": [{ "name": "", "type": "bool" }],
    "type": "function"
  }
];

// Main component
export default function FootballGame() {
  const [selected, setSelected] = useState<Token[]>([]);
  const [active, setActive] = useState<string | null>(null);
  const [gameCode, setGameCode] = useState<string | null>(null);
  const [tokensData, setTokensData] = useState<Token[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const fieldRef = useRef<HTMLDivElement>(null);
  const { address, isConnected } = useAccount();

  // Fetch user's tokens when address changes
  useEffect(() => {
    if (!address || !isConnected) {
      setTokensData([]);
      setSelected([]);
      return;
    }

    const fetchTokens = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const response = await fetch(`/api/tokens?address=${address}`);
        const data = await response.json();
        
        if (data.success) {
          // Transform API data to match our Token interface
          const transformedTokens: Token[] = data.data.map((token: any) => ({
            id: token.contractAddress,
            name: token.playerData?.playerName || token.tokenName || 'Unknown Player',
            image: token.playerData?.image || 'https://via.placeholder.com/80x80/10b981/ffffff?text=?',
            contractAddress: token.contractAddress,
            playerData: token.playerData
          }));
          
          setTokensData(transformedTokens);
        } else {
          setError(data.error || 'Failed to fetch tokens');
        }
      } catch (err) {
        console.error('Error fetching tokens:', err);
        setError('Failed to fetch tokens from wallet');
      } finally {
        setLoading(false);
      }
    };

    fetchTokens();
  }, [address, isConnected]);

  const toggleSelect = (token: Token) => {
    setSelected((prev) => {
      const already = prev.find((t) => t.id === token.id);
      if (already) {
        return prev.filter((t) => t.id !== token.id);
      }
      if (prev.length >= 5) return prev; // MAX 5 PLAYERS
      return [...prev, token];
    });
  };

  // Add async join game logic
  async function handleJoinGameContract(joinCode: string) {
    if (!walletClient || !address || selected.length !== 5) return;
    try {
      setLoading(true);
      setError(null);
      // Prepare joiner token addresses
      const contractAddresses = selected.map((t) => t.contractAddress);
      const TOKENS_PER_CONTRACT = 200;
      // 1. Check balances and allowances, approve if needed
      for (const tokenAddr of contractAddresses) {
        // Check balance
        const balance = await client.readContract({
          address: tokenAddr as `0x${string}`,
          abi: ERC20_ABI,
          functionName: "balanceOf",
          args: [address as `0x${string}`],
        });
        if (BigInt(balance as string) < BigInt(TOKENS_PER_CONTRACT)) {
          setError(`Insufficient balance for token ${tokenAddr}`);
          setLoading(false);
          return;
        }
        // Check allowance
        const allowance = await client.readContract({
          address: tokenAddr as `0x${string}`,
          abi: ERC20_ABI,
          functionName: "allowance",
          args: [address as `0x${string}`, GAME_CONTRACT_ADDRESS as `0x${string}`],
        });
        if (BigInt(allowance as string) < BigInt(TOKENS_PER_CONTRACT)) {
          // Approve
          await walletClient.writeContract({
            address: tokenAddr as `0x${string}`,
            abi: ERC20_ABI,
            functionName: "approve",
            args: [GAME_CONTRACT_ADDRESS as `0x${string}`, BigInt(TOKENS_PER_CONTRACT)],
            account: address as `0x${string}`,
          });
        }
      }
      // 2. Call joinGame
      const hash = await walletClient.writeContract({
        address: GAME_CONTRACT_ADDRESS as `0x${string}`,
        abi: GAME_CONTRACT_ABI,
        functionName: "joinGame",
        args: [joinCode, contractAddresses],
        account: address as `0x${string}`,
      });
      // 3. Wait for transaction receipt
      await client.waitForTransactionReceipt({ hash });
      // 4. Navigate to battle page
      router.push(`/game/battle?gameId=${joinCode}`);
    } catch (err: any) {
      setError(err?.message || "Failed to join game");
    } finally {
      setLoading(false);
    }
  }

  // Add this function to handle the contract call
  async function handleStartGameContract() {
    if (!walletClient || !address || selected.length !== 5) return;
    try {
      setLoading(true);
      setError(null);
      const contractAddresses = selected.map((t) => t.contractAddress);
      const TOKENS_PER_CONTRACT = 200; // adjust if needed
      // 1. Check balances and allowances, approve if needed
      for (const tokenAddr of contractAddresses) {
        // Check balance
        const balance = await client.readContract({
          address: tokenAddr as `0x${string}`,
          abi: ERC20_ABI,
          functionName: "balanceOf",
          args: [address as `0x${string}`],
        });
        if (BigInt(balance as string) < BigInt(TOKENS_PER_CONTRACT)) {
          setError(`Insufficient balance for token ${tokenAddr}`);
          setLoading(false);
          return;
        }
        // Check allowance
        const allowance = await client.readContract({
          address: tokenAddr as `0x${string}`,
          abi: ERC20_ABI,
          functionName: "allowance",
          args: [address as `0x${string}`, GAME_CONTRACT_ADDRESS as `0x${string}`],
        });
        if (BigInt(allowance as string) < BigInt(TOKENS_PER_CONTRACT)) {
          // Approve
          await walletClient.writeContract({
            address: tokenAddr as `0x${string}`,
            abi: ERC20_ABI,
            functionName: "approve",
            args: [GAME_CONTRACT_ADDRESS as `0x${string}`, BigInt(TOKENS_PER_CONTRACT)],
            account: address as `0x${string}`,
          });
        }
      }
      // 2. Call createGame
      const hash = await walletClient.writeContract({
        address: GAME_CONTRACT_ADDRESS as `0x${string}`,
        abi: GAME_CONTRACT_ABI,
        functionName: "createGame",
        args: [contractAddresses],
        account: address as `0x${string}`,
      });
      console.log("hash", hash);
      // 3. Wait for transaction receipt
      const receipt = await client.waitForTransactionReceipt({ hash });
      console.log("receipt", receipt);
      // 4. Parse logs for GameCreated event
      let gameCode = null;
      try {
        const { decodeEventLog } = require("viem");
        for (const log of receipt.logs) {
          try {
            const parsed = decodeEventLog({
              abi: GAME_CONTRACT_ABI,
              data: log.data,
              topics: log.topics,
            });
            if (parsed.eventName === "GameCreated") {
              gameCode = parsed.args.gameCode || parsed.args[1];
              break;
            }
          } catch (e) { /* skip non-matching logs */ }
        }
      } catch (e) { /* viem not available or error */ }
      if (gameCode) {
        console.log("gameCode", gameCode);
        setGameCode(gameCode.toString());
      } else {
        setError("Game created but code not found in logs");
      }
    } catch (err: any) {
      setError(err?.message || "Failed to create game");
    } finally {
      setLoading(false);
    }
  }

  const fieldPlayers = selected.map(toFieldPlayer);

  return (
    <div className="py-10 flex flex-col items-center gap-6 max-w-7xl mx-auto px-4">
      <div className="w-full flex flex-col lg:flex-row gap-6">
        {/* Football Field */}
        <div className="flex-1 relative">
          <div 
            className="ff-stage"
            style={{
              position: 'relative',
              width: '100%',
              height: '500px',
              overflow: 'visible',
              perspective: '1400px'
            }}
            onClick={() => setActive(null)}
          >
            <div 
              ref={fieldRef} 
              className="ff-world"
              style={{
                position: 'absolute',
                left: '50%',
                top: '50%',
                transform: 'translate(-50%, -50%) translateZ(-200px)',
                transformStyle: 'preserve-3d',
                transition: 'transform 0.6s ease'
              }}
            >
              {/* Pitch container – red theme */}
              <div className="relative w-[800px] h-[480px] bg-gradient-to-br from-green-800 to-lime-900 border-4 border-green-500 rounded-xl shadow-xl">
                {/* Field markings */}
                <div 
                  className="absolute inset-0"
                >
                  {/* Outline */}
                  <div className="absolute inset-0 border-4 border-white rounded-xl pointer-events-none" />

                  {/* Midline */}
                  <div className="absolute left-1/2 top-0 -translate-x-1/2 w-1 h-full bg-white opacity-90" />

                  {/* Centre circle */}
                  <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-28 h-28 border-4 border-white rounded-full opacity-90" />

                  {/* Penalty boxes */}
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-24 h-56 border-4 border-white rounded-md opacity-90" />
                  <div className="absolute right-0 top-1/2 -translate-y-1/2 w-24 h-56 border-4 border-white rounded-md opacity-90" />

                  {/* Six-yard boxes */}
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-12 h-32 border-4 border-white rounded opacity-90" />
                  <div className="absolute right-0 top-1/2 -translate-y-1/2 w-12 h-32 border-4 border-white rounded opacity-90" />

                  {/* Goals */}
                  <div className="absolute -left-2 top-1/2 -translate-y-1/2 w-2 h-20 bg-white" />
                  <div className="absolute -right-2 top-1/2 -translate-y-1/2 w-2 h-20 bg-white" />
                </div>
              </div>
              
              {/* Players */}
              {fieldPlayers.map((p, idx) => (
                <PlayerDot 
                  key={p.name} 
                  player={p} 
                  active={active === p.name} 
                  onClick={() => setActive(p.name)} 
                />
              ))}
            </div>
          </div>
          
          {fieldPlayers.length === 0 && (
            <p className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-zinc-500 text-sm text-center">
              Select up to 5 tokens to place on the field
            </p>
          )}
        </div>

        {/* Token Selection Panel */}
        <div className="w-full lg:w-80 bg-zinc-900/40 rounded-xl p-4 backdrop-blur-sm border border-zinc-700 h-[80vh] overflow-y-auto">
          <div>
            <h3 className="text-lg font-semibold text-red-400 mb-3 flex items-center gap-2">
              <Users size={20} />
              Your Player Tokens
            </h3>
            
            {!isConnected ? (
              <div className="text-center py-8">
                <p className="text-zinc-400 mb-4">Connect your wallet to see your player tokens</p>
                <div className="text-xs text-zinc-500">
                  You need to connect your wallet to view and select your player tokens for the game.
                </div>
              </div>
            ) : loading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-400 mx-auto mb-4"></div>
                <p className="text-zinc-400">Loading your tokens...</p>
              </div>
            ) : error ? (
              <div className="text-center py-8">
                <p className="text-red-400 mb-2">Error loading tokens</p>
                <p className="text-xs text-zinc-500">{error}</p>
              </div>
            ) : tokensData.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-zinc-400 mb-2">No player tokens found</p>
                <p className="text-xs text-zinc-500">
                  You don't have any player tokens in your wallet. Visit the marketplace to purchase some!
                </p>
              </div>
            ) : (
              <>
                <p className="text-xs text-zinc-400 mb-4">
                  Select up to 5 players ({selected.length}/5)
                </p>
                
                <div className="grid grid-cols-2 gap-3">
                  {tokensData.map((token) => {
                    const isSel = !!selected.find((t) => t.id === token.id);
                    return (
                      <div
                        key={token.id}
                        onClick={() => toggleSelect(token)}
                        className={`cursor-pointer rounded-lg p-3 text-center border-2 transition-all duration-200 hover:scale-105 ${
                          isSel 
                            ? 'border-red-500 bg-red-500/10 shadow-lg shadow-red-500/20' 
                            : 'border-zinc-700 hover:border-zinc-600 bg-zinc-800/50'
                        }`}
                      >
                        <img 
                          src={token.image} 
                          alt={token.name} 
                          width={90} 
                          height={90} 
                          className="mx-auto rounded-full mb-2"
                          onError={(e) => {
                            e.currentTarget.src = 'https://via.placeholder.com/80x80/10b981/ffffff?text=?';
                          }}
                        />
                        <span className="block text-sm text-zinc-200 font-medium">
                          {token.name}
                        </span>
                        {token.playerData?.position && (
                          <span className="block text-xs text-zinc-400 mt-1">
                            {token.playerData.position}
                          </span>
                        )}
                        {isSel && (
                          <div className="mt-1 text-xs text-red-400">
                            Selected
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
                
                {selected.length > 0 && (
                  <div className="mt-4 pt-4 border-t border-zinc-700">
                    <button
                      onClick={() => setSelected([])}
                      className="w-full py-2 px-4 bg-red-600/20 text-red-400 rounded-lg border border-red-600/30 hover:bg-red-600/30 transition-colors"
                    >
                      Clear All
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {/* Game Controls - moved outside and below */}
      <div className="w-full max-w-md mt-[-150px] ml-[-300px] z-100">
        <GameControls
          isDisabled={selected.length < 5 || !isConnected || loading}
          onStartGame={handleStartGameContract}
          onJoinGame={handleJoinGameContract}
        />
      </div>

      {gameCode && <QRCodeModal gameCode={gameCode} onClose={() => setGameCode(null)} />}
    </div>
  );
}