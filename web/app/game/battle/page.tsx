'use client';

import { useSearchParams } from 'next/navigation';
import { Suspense, useEffect, useState } from 'react';
import NavBar1 from '../../components/ui/NavBar1';

const validatingTexts = [
  'Validating your team',
  'Calculating match stats',
  'Checking player stamina',
  'Rolling the ball',
  'Final whistle coming up',
];

const BattleContent = () => {
  const searchParams = useSearchParams();
  const gameId = searchParams.get('gameId');
  const [statusIdx, setStatusIdx] = useState(0);
  const [result, setResult] = useState<null | 'win' | 'lose'>(null);

  useEffect(() => {
    if (result) return;
    if (statusIdx < validatingTexts.length - 1) {
      const timeout = setTimeout(() => setStatusIdx(idx => idx + 1), 1400);
      return () => clearTimeout(timeout);
    } else {
      // Simulate receiving the result event
      const timeout = setTimeout(() => {
        setResult(Math.random() > 0.5 ? 'win' : 'lose');
      }, 1800);
      return () => clearTimeout(timeout);
    }
  }, [statusIdx, result]);

  return (
    <div
      className="relative min-h-screen w-full flex flex-col items-center bg-black"
      style={{
        minHeight: '100vh',
        height: '100vh',
        background:
          'linear-gradient(to top, rgba(0,0,0,0.95) 0%, rgba(34,34,34,0.85) 60%, rgba(207,10,10,0.7) 100%), url(/football-ground.jpg) center/cover no-repeat',
      }}
    >
      <NavBar1 />
      <div className="flex-1 flex flex-col items-center justify-center w-full z-10 px-4 pt-24">
        <h1 className="text-5xl font-extrabold text-red-600 mb-2 tracking-tight" style={{fontFamily: 'Oswald, sans-serif'}}>BATTLE ARENA</h1>
        <p className="text-base text-zinc-300 mb-6 font-mono">
          Game ID: <span className="text-red-400">{gameId || 'N/A'}</span>
        </p>
        <div className="w-full max-w-md mx-auto bg-zinc-900/90 rounded-xl border border-red-700 p-6 flex flex-col items-center shadow-none">
          <h2 className="text-xl font-bold text-white mb-4 tracking-wide">Your Team</h2>
          <div className="space-y-2 w-full mb-6">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="bg-zinc-800 h-10 rounded-md w-full border border-zinc-700" />
            ))}
          </div>
          <div className="flex flex-col items-center justify-center min-h-[60px] w-full">
            {!result ? (
              <div className="text-lg font-medium text-red-300 tracking-wide transition-all duration-300">
                {validatingTexts[statusIdx]}
              </div>
            ) : (
              <div className={`text-2xl font-bold mt-2 ${result === 'win' ? 'text-green-400' : 'text-red-500'}`}
                style={{letterSpacing: 1}}>
                {result === 'win' ? 'You Won' : 'You Lost'}
              </div>
            )}
          </div>
        </div>
        <div className="mt-6 text-sm text-zinc-400 italic">
          Opponent's team is hidden until the match is over.
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