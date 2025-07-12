"use client";
import { CircularCarousel } from "../components/ui/CircularCarousel";
import ProfileCard from "../components/ui/ProfileCard";

interface PlayerCard {
  id: number;
  name: string;
  title: string;
  avatar: string;
  handle: string;
  status: string;
}

const players: PlayerCard[] = [
  {
    id: 1,
    name: "Lionel Messi",
    title: "Forward",
    avatar: "https://i.imgur.com/1Y2WwX2.jpeg",
    handle: "leomessi",
    status: "Online",
  },
  {
    id: 2,
    name: "Cristiano Ronaldo",
    title: "Forward",
    avatar: "https://i.imgur.com/tX0P2Ct.jpeg",
    handle: "cristiano",
    status: "Online",
  },
  {
    id: 3,
    name: "Neymar Jr",
    title: "Forward",
    avatar: "https://i.imgur.com/MiU8N3p.jpeg",
    handle: "neymarjr",
    status: "Online",
  },
];

export default function PlayerPage() {
  return (
    <main
      className="flex min-h-screen items-center justify-start overflow-hidden  text-white"
      
    >
      <div className="w-1/2">
        <CircularCarousel
          itemWidth={320}
          items={players.map((player) => (
            <ProfileCard
              key={player.id}
              avatarUrl={player.avatar}
              name={player.name}
              title={player.title}
              handle={player.handle}
              status={player.status}
            />
          ))}
        />
      </div>
    </main>
  );
}
