'use client';

import { useState } from 'react';
import * as QRCode from 'qrcode.react';

// Re-use button from existing components
import { Button } from '@/components/ui/button';

interface GameControlsProps {
  isDisabled: boolean;
  onStartGame: (gameCode: string) => void;
  onJoinGame: (gameCode: string) => void;
}

const GameControls = ({ isDisabled, onStartGame, onJoinGame }: GameControlsProps) => {
  const [showJoinInput, setShowJoinInput] = useState(false);
  const [joinCode, setJoinCode] = useState('');

  const handleStart = () => {
    // Mimic API call and generate a random 6-digit code
    const gameCode = Math.floor(100000 + Math.random() * 900000).toString();
    onStartGame(gameCode);
  };

  const handleJoin = () => {
    if (joinCode) {
      onJoinGame(joinCode);
    }
  };

  return (
    <div className="mt-auto pt-4 border-t border-zinc-700">
      <div className="flex flex-col gap-3">
        {/* Start new game */}
        <Button
          onClick={handleStart}
          disabled={isDisabled}
          className="w-full bg-red-600/20 text-red-400 hover:bg-red-600/30 disabled:opacity-50"
        >
          Start New Game
        </Button>

        {/* Join game */}
        {!showJoinInput && (
          <Button
            onClick={() => setShowJoinInput(true)}
            disabled={isDisabled}
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
            <Button onClick={handleJoin} disabled={!joinCode}>
              Join
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default GameControls; 