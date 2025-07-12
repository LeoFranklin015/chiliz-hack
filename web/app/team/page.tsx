"use client"
import { useState } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

// helper to convert deg to rad
const deg2rad = (deg: number) => (deg * Math.PI) / 180;

// generate SVG arc slice path
function slicePath(index: number, total: number, R = 300, r = 200, cx = 310, cy = 310) {
  const slice = 360 / total;
  const start = (index * slice) - slice / 2;
  const end = start + slice;

  const largeArc = slice > 180 ? 1 : 0;

  const x1 = cx + R * Math.cos(deg2rad(start));
  const y1 = cy + R * Math.sin(deg2rad(start));
  const x2 = cx + R * Math.cos(deg2rad(end));
  const y2 = cy + R * Math.sin(deg2rad(end));

  const x3 = cx + r * Math.cos(deg2rad(end));
  const y3 = cy + r * Math.sin(deg2rad(end));
  const x4 = cx + r * Math.cos(deg2rad(start));
  const y4 = cy + r * Math.sin(deg2rad(start));

  return `M ${x1} ${y1} A ${R} ${R} 0 ${largeArc} 1 ${x2} ${y2} L ${x3} ${y3} A ${r} ${r} 0 ${largeArc} 0 ${x4} ${y4} Z`;
}

function logoPosition(index: number, total: number, radius = 250, size = 48) {
  const slice = 360 / total;
  const angle = index * slice;
  const cx = 310 + radius * Math.cos(deg2rad(angle - 90));
  const cy = 310 + radius * Math.sin(deg2rad(angle - 90));
  return { x: cx - size / 2, y: cy - size / 2 };
}

// Team type definition for the wheel UI
interface Team {
  clubLogo: string;
  name: string;
  ratings: { att: number; mid: number; def: number };
}

// Premier League teams data (20 clubs) – logo URLs are placeholders, replace with high-res logos as desired
const premierLeagueTeams: Team[] = [
  {
    clubLogo: "https://upload.wikimedia.org/wikipedia/en/5/53/Arsenal_FC.svg",
    name: "Arsenal",
    ratings: { att: 83, mid: 82, def: 81 },
  },
  {
    clubLogo: "https://upload.wikimedia.org/wikipedia/en/e/e0/Aston_Villa_FC_crest_%282016%29.svg",
    name: "Aston Villa",
    ratings: { att: 79, mid: 77, def: 78 },
  },
  {
    clubLogo: "https://upload.wikimedia.org/wikipedia/en/7/70/Brighton_%26_Hove_Albion_logo.svg",
    name: "Brighton",
    ratings: { att: 80, mid: 79, def: 78 },
  },
  {
    clubLogo: "https://upload.wikimedia.org/wikipedia/en/0/02/Burnley_FC_Logo.svg",
    name: "Burnley",
    ratings: { att: 74, mid: 73, def: 74 },
  },
  {
    clubLogo: "https://upload.wikimedia.org/wikipedia/en/c/cc/Chelsea_FC.svg",
    name: "Chelsea",
    ratings: { att: 85, mid: 87, def: 83 },
  },
  {
    clubLogo: "https://upload.wikimedia.org/wikipedia/en/0/0c/Crystal_Palace_FC_logo.svg",
    name: "Crystal Palace",
    ratings: { att: 77, mid: 75, def: 76 },
  },
  {
    clubLogo: "https://upload.wikimedia.org/wikipedia/en/7/7c/Everton_FC_logo.svg",
    name: "Everton",
    ratings: { att: 76, mid: 75, def: 76 },
  },
  {
    clubLogo: "https://upload.wikimedia.org/wikipedia/en/3/3c/Fulham_FC_%282018%29.svg",
    name: "Fulham",
    ratings: { att: 76, mid: 75, def: 74 },
  },
  {
    clubLogo: "https://upload.wikimedia.org/wikipedia/en/0/0c/Liverpool_FC.svg",
    name: "Liverpool",
    ratings: { att: 88, mid: 85, def: 86 },
  },
  {
    clubLogo: "https://upload.wikimedia.org/wikipedia/en/3/3e/LutonTownFCbadge.png",
    name: "Luton Town",
    ratings: { att: 70, mid: 70, def: 71 },
  },
  {
    clubLogo: "https://upload.wikimedia.org/wikipedia/en/e/eb/Manchester_City_FC_badge.svg",
    name: "Man City",
    ratings: { att: 90, mid: 89, def: 88 },
  },
  {
    clubLogo: "https://upload.wikimedia.org/wikipedia/en/7/7a/Manchester_United_FC_crest.svg",
    name: "Man United",
    ratings: { att: 86, mid: 84, def: 82 },
  },
  {
    clubLogo: "https://upload.wikimedia.org/wikipedia/en/5/56/Newcastle_United_Logo.svg",
    name: "Newcastle",
    ratings: { att: 82, mid: 80, def: 79 },
  },
  {
    clubLogo: "https://upload.wikimedia.org/wikipedia/en/8/8c/Norwich_City.svg",
    name: "Norwich City",
    ratings: { att: 72, mid: 70, def: 71 },
  },
  {
    clubLogo: "https://upload.wikimedia.org/wikipedia/en/9/9c/Sheffield_United_FC_logo.svg",
    name: "Sheffield Utd",
    ratings: { att: 73, mid: 71, def: 72 },
  },
  {
    clubLogo: "https://upload.wikimedia.org/wikipedia/en/f/fd/FC_Southampton.svg",
    name: "Southampton",
    ratings: { att: 75, mid: 73, def: 74 },
  },
  {
    clubLogo: "https://upload.wikimedia.org/wikipedia/en/b/b4/Tottenham_Hotspur.svg",
    name: "Tottenham",
    ratings: { att: 85, mid: 82, def: 80 },
  },
  {
    clubLogo: "https://upload.wikimedia.org/wikipedia/en/c/c2/West_Ham_United_FC_logo.svg",
    name: "West Ham",
    ratings: { att: 81, mid: 79, def: 78 },
  },
  {
    clubLogo: "https://upload.wikimedia.org/wikipedia/en/f/fc/Wolverhampton_Wanderers.svg",
    name: "Wolves",
    ratings: { att: 78, mid: 77, def: 76 },
  },
  {
    clubLogo: "https://upload.wikimedia.org/wikipedia/en/e/e5/AFC_Bournemouth.svg",
    name: "Bournemouth",
    ratings: { att: 74, mid: 72, def: 72 },
  },
];

export default function TeamSelection() {
  const [selectedIndex, setSelectedIndex] = useState(4); // start at Chelsea
  const totalTeams = premierLeagueTeams.length;

  // handle rotation
  const selectPrev = () => setSelectedIndex((prev) => (prev - 1 + totalTeams) % totalTeams);
  const selectNext = () => setSelectedIndex((prev) => (prev + 1) % totalTeams);

  const selectedTeam = premierLeagueTeams[selectedIndex];

  return (
    <main className="relative min-h-screen flex flex-col items-start justify-center bg-[#0d0d0d] text-white overflow-hidden font-sans px-8">
      {/* Textured background overlay */}
      <div className="pointer-events-none absolute inset-0 bg-[url('https://images.unsplash.com/photo-1522509589783-7b2a85a04e9a?auto=format&fit=crop&w=1920&q=60')] bg-cover opacity-10 mix-blend-soft-light" />

      {/* Team wheel SVG */}
      <div className="relative z-10 flex flex-col items-center gap-6">
        <svg width={620} height={620} viewBox="0 0 620 620" className="drop-shadow-[0_0_20px_rgba(0,0,0,0.6)]">
          {/* Team name */}
          <text textAnchor="middle" x={310} y={340} fontSize={22} stroke="black" fill="white" className="font-bold select-none">
            {selectedTeam.name}
          </text>

          {premierLeagueTeams.map((team, idx) => {
            const path = slicePath(idx, totalTeams);
            const imgPos = logoPosition(idx, totalTeams, 260, 50);
            return (
              <g
                key={team.name}
                onMouseEnter={() => setSelectedIndex(idx)}
                className="cursor-pointer"
              >
                <path
                  d={path}
                  fill="rgba(255,255,255,0.12)"
                  stroke={idx === selectedIndex ? 'rgb(28,151,185)' : 'rgba(0,0,0,0.4)'}
                  strokeWidth={idx === selectedIndex ? 6 : 3}
                />
                <image href={team.clubLogo} xlinkHref={team.clubLogo} x={imgPos.x} y={imgPos.y} width={50} height={50} />
              </g>
            );
          })}
        </svg>

        {/* Ratings bars */}
        <div className="w-60 space-y-1">
          {([
            { label: 'Attack', value: selectedTeam.ratings.att },
            { label: 'Mid', value: selectedTeam.ratings.mid },
            { label: 'Defense', value: selectedTeam.ratings.def },
          ] as const).map(({ label, value }) => (
            <div key={label}>
              <p className="text-xs tracking-wide">{label}</p>
              <div className="w-full h-2 bg-white/30">
                <div className="h-2 bg-white" style={{ width: `${value}%` }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Navigation arrows */}
      <div className="flex items-center gap-6 mt-8 ml-[28rem]">
        <button
          onClick={selectPrev}
          aria-label="Previous Team"
          className="w-12 h-12 flex items-center justify-center rounded-full bg-gray-800 border border-gray-700 hover:bg-gray-700 transition-colors"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>
        <button
          onClick={selectNext}
          aria-label="Next Team"
          className="w-12 h-12 flex items-center justify-center rounded-full bg-gray-800 border border-gray-700 hover:bg-gray-700 transition-colors"
        >
          <ArrowRight className="w-6 h-6" />
        </button>
      </div>


    </main>
  );
}
