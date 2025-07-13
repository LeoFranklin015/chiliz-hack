'use client';

import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';

const BattleContent = () => {
  const searchParams = useSearchParams();
  const gameId = searchParams.get('gameId');

  return (
    <div className="min-h-screen text-white relative overflow-hidden bg-black">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(207,10,10,0.2)_0%,_transparent_50%)]" />
      <div className="absolute inset-0 [mask-image:linear-gradient(to_bottom,white_10%,transparent)]">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2240%22%20height%3D%2240%22%20viewBox%3D%220%200%2040%2040%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cg%20fill%3D%22%23262626%22%20fill-opacity%3D%220.4%22%20fill-rule%3D%22evenodd%22%3E%3Cpath%20d%3D%22M0%2040L40%200H20L0%2020M40%2040V20L20%2040%22%2F%3E%3C%2Fg%3E%3C%2Fsvg%3E')]" />
      </div>

      <div className="relative z-10 container mx-auto px-6 py-20 text-center">
        <h1 className="text-6xl font-black text-red-500 gaming-text mb-4">
          BATTLE ARENA
        </h1>
        <p className="text-xl text-zinc-300">
          Game ID: <span className="font-mono text-red-400">{gameId || 'N/A'}</span>
        </p>

        <div className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
          {/* Player 1 Side */}
          <div className="bg-zinc-900/50 border border-zinc-700 rounded-xl p-6 backdrop-blur-sm">
            <h2 className="text-3xl font-bold text-white mb-6">Your Team</h2>
            <div className="space-y-4">
              {/* Placeholder for player cards */}
              {[...Array(5)].map((_, i) => (
                <div key={i} className="bg-zinc-800 h-16 rounded-lg animate-pulse" />
              ))}
            </div>
          </div>

          {/* Player 2 Side */}
          <div className="bg-zinc-900/50 border border-zinc-700 rounded-xl p-6 backdrop-blur-sm">
            <h2 className="text-3xl font-bold text-white mb-6">Opponent's Team</h2>
            <div className="space-y-4">
              {/* Placeholder for player cards */}
              {[...Array(5)].map((_, i) => (
                <div key={i} className="bg-zinc-800 h-16 rounded-lg animate-pulse" />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function BattlePage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <BattleContent />
    </Suspense>
  );
} 