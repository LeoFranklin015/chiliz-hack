"use client";
import { CircularCarousel } from "../components/ui/CircularCarousel";
import ModelViewer from "../components/ui/ModelViewer";

interface PlayerCard {
  id: number;
  name: string;
  model: string;
}

const players: PlayerCard[] = [
  {
    id: 1,
    name: "Lionel Messi",
    model: "/messi.glb",
  },
  {
    id: 2,
    name: "Cristiano Ronaldo",
    model: "/ronaldo.glb",
  },
  {
    id: 3,
    name: "Neymar Jr",
    model: "/messi.glb", // Placeholder
  },
];

export default function PlayerPage() {
  return (
    <main
      className="flex min-h-screen items-center justify-start overflow-hidden bg-[#0d0d0d] text-white"
      style={{
        backgroundImage: `radial-gradient(ellipse 80% 50% at 50% -20%, rgba(120, 119, 198, 0.3), transparent)`,
      }}
    >
      <div className="w-1/2">
        <CircularCarousel
          itemWidth={280}
          items={players.map((player) => (
            <div
              key={player.id}
              className="relative flex h-[400px] w-[280px] flex-col justify-end overflow-hidden rounded-2xl border border-white/10 bg-white/5 text-center backdrop-blur-md"
            >
              <ModelViewer modelPath={player.model} />
              <div className="z-10 w-full bg-black/30 p-4 backdrop-blur-sm">
                <h2 className="text-xl font-bold tracking-wider text-white">
                  {player.name}
                </h2>
              </div>
            </div>
          ))}
        />
      </div>
    </main>
  );
}
