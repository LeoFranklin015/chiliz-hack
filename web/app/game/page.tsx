'use client';

import React, { useRef, useState } from 'react';
import { Users } from 'lucide-react';

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
}

// Token data
const tokensData: Token[] = [
  { id: '1', name: 'Messi', image: 'https://via.placeholder.com/80x80/10b981/ffffff?text=M' },
  { id: '2', name: 'Ronaldo', image: 'https://via.placeholder.com/80x80/10b981/ffffff?text=R' },
  { id: '3', name: 'Mbappé', image: 'https://via.placeholder.com/80x80/10b981/ffffff?text=MB' },
  { id: '4', name: 'Neymar', image: 'https://via.placeholder.com/80x80/10b981/ffffff?text=N' },
  { id: '5', name: 'Salah', image: 'https://via.placeholder.com/80x80/10b981/ffffff?text=S' },
  { id: '6', name: 'De Bruyne', image: 'https://via.placeholder.com/80x80/10b981/ffffff?text=DB' },
  { id: '7', name: 'Lewandowski', image: 'https://via.placeholder.com/80x80/10b981/ffffff?text=L' },
  { id: '8', name: 'Haaland', image: 'https://via.placeholder.com/80x80/10b981/ffffff?text=H' },
  { id: '9', name: 'Modrić', image: 'https://via.placeholder.com/80x80/10b981/ffffff?text=MO' },
  { id: '10', name: 'Bellingham', image: 'https://via.placeholder.com/80x80/10b981/ffffff?text=B' },
];

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
    pos: 'N/A',
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

// Main component
export default function FootballGame() {
  const [selected, setSelected] = useState<Token[]>([]);
  const [active, setActive] = useState<string | null>(null);
  const fieldRef = useRef<HTMLDivElement>(null);

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

  const fieldPlayers = selected.map(toFieldPlayer);

  return (
    <div className="py-10 flex flex-col lg:flex-row gap-6 max-w-7xl mx-auto px-4">
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
        <h3 className="text-lg font-semibold text-red-400 mb-3 flex items-center gap-2">
          <Users size={20} />
          Your Player Tokens
        </h3>
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
                />
                <span className="block text-sm text-zinc-200 font-medium">
                  {token.name}
                </span>
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
      </div>
    </div>
  );
}