'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';

interface GameControlsProps {
  isDisabled: boolean;
  onStartGame: () => Promise<void>;
  onJoinGame: (gameCode: string) => Promise<void>;
}

const GameControls = ({ isDisabled, onStartGame, onJoinGame }: GameControlsProps) => {
  const [showJoinInput, setShowJoinInput] = useState(false);
  const [joinCode, setJoinCode] = useState('');
  const [loading, setLoading] = useState(false);

  const handleStart = async () => {
    setLoading(true);
    await onStartGame();
    setLoading(false);
  };

  const handleJoin = async () => {
    if (joinCode) {
      setLoading(true);
      await onJoinGame(joinCode);
      setLoading(false);
    }
  };

  return (
    <div className="mt-auto pt-4 border-t border-zinc-700">
      <div className="flex flex-col gap-3">
        {/* Start new game */}
        <Button
          onClick={handleStart}
          disabled={isDisabled || loading}
          className="w-full bg-red-600/20 text-red-400 hover:bg-red-600/30 disabled:opacity-50"
        >
          {loading ? 'Processing...' : 'Start New Game'}
        </Button>

        {/* Join game */}
        {!showJoinInput && (
          <Button
            onClick={() => setShowJoinInput(true)}
            disabled={isDisabled || loading}
            className="w-full bg-zinc-700/50 hover:bg-zinc-600/50 disabled:opacity-50"
          >
            Join Existing Game
          </Button>
        )}

        {/* Join code input */}
        {showJoinInput && (
          <div className="flex gap-2">
            <input
              type="text"
              value={joinCode}
              onChange={(e) => setJoinCode(e.target.value)}
              placeholder="Enter game code..."
              className="flex-1 bg-zinc-800 border border-zinc-600 rounded-md px-3 text-sm"
            />
            <Button onClick={handleJoin} disabled={!joinCode || loading}>
              {loading ? 'Processing...' : 'Join'}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default GameControls; 