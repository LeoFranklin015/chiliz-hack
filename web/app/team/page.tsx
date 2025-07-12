"use client";
import { useState, useEffect } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

// helper to convert deg to rad
const deg2rad = (deg: number) => (deg * Math.PI) / 180;

// generate SVG arc slice path
function slicePath(
  index: number,
  total: number,
  R = 290,
  r = 200,
  cx = 300,
  cy = 300
) {
  const gap = 2; // degrees of gap between slices
  const slice = 360 / total - gap;
  // Center the first slice at the top (subtract 90 degrees)
  const start = index * (360 / total) - slice / 2 - 90;
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

function logoPosition(index: number, total: number, radius = 250, size = 64) {
  const slice = 360 / total;
  const angle = index * slice - 90; // Start at top
  const cx = 300 + radius * Math.cos(deg2rad(angle));
  const cy = 300 + radius * Math.sin(deg2rad(angle));
  return { x: cx - size / 2, y: cy - size / 2 };
}

// Team type definition for the wheel UI
interface Team {
  id: number;
  name: string;
  code: string;
  country: string;
  founded: number;
  logo: string;
  venue: {
    id: number;
    name: string;
    address: string;
    city: string;
    capacity: number;
    surface: string;
    image: string;
  };
}

export default function TeamSelection() {
  const [teams, setTeams] = useState<Team[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    fetch("/api/teams")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch teams");
        return res.json();
      })
      .then((data) => {
        setTeams(data);
        setSelectedIndex(0);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  const totalTeams = teams.length;

  // handle rotation
  const selectPrev = () =>
    setSelectedIndex((prev) => (prev - 1 + totalTeams) % totalTeams);
  const selectNext = () => setSelectedIndex((prev) => (prev + 1) % totalTeams);

  const selectedTeam = teams[selectedIndex];

  return (
    <main className="relative min-h-screen flex flex-col items-center justify-center text-white overflow-hidden font-sans px-4 sm:px-8">
      {/* Textured background overlay */}
      <div className="pointer-events-none absolute inset-0 bg-[url('https://images.unsplash.com/photo-1522509589783-7b2a85a04e9a?auto=format&fit=crop&w=1920&q=60')] bg-cover opacity-10 mix-blend-soft-light" />

      <div className="relative z-10 flex flex-col w-full h-full items-center justify-center min-h-screen">
        {loading && <div className="text-lg">Loading teams...</div>}
        {error && <div className="text-red-500">{error}</div>}
        {!loading && !error && teams.length > 0 && (
          <div className="flex flex-col md:flex-row w-full max-w-5xl items-center justify-center gap-12 md:gap-24 py-12">
            {/* Left: Wheel */}
            <div className="flex flex-col items-center justify-center">
              <svg
                width={600}
                height={600}
                viewBox="0 0 600 600"
                className="drop-shadow-[0_0_40px_rgba(0,0,0,0.7)]"
              >
                {/* Wheel slices and logos */}
                {teams.map((team, idx) => {
                  const path = slicePath(idx, totalTeams, 290, 200, 300, 300);
                  const imgPos = logoPosition(idx, totalTeams, 250, 64);
                  return (
                    <g
                      key={team.id}
                      onMouseEnter={() => setSelectedIndex(idx)}
                      className="cursor-pointer"
                    >
                      <path
                        d={path}
                        fill="rgba(255,255,255,0.12)"
                        stroke={
                          idx === selectedIndex
                            ? "rgb(28,151,185)"
                            : "rgba(0,0,0,0.4)"
                        }
                        strokeWidth={idx === selectedIndex ? 6 : 3}
                      />
                      <image
                        href={team.logo}
                        xlinkHref={team.logo}
                        x={imgPos.x}
                        y={imgPos.y}
                        width={64}
                        height={64}
                      />
                    </g>
                  );
                })}
                {/* Centered selected team logo */}
                {selectedTeam && (
                  <motion.image
                    key={selectedTeam.logo}
                    href={selectedTeam.logo}
                    xlinkHref={selectedTeam.logo}
                    x={240}
                    y={240}
                    width={120}
                    height={120}
                    style={{ pointerEvents: "none" }}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 1.2 }}
                    transition={{ duration: 0.4, ease: "easeInOut" }}
                  />
                )}
              </svg>
              {/* Navigation arrows */}
              <div className="flex items-center gap-6 mt-8">
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
            </div>

            {/* Right: Team name and Explore Player button */}
            <div className="flex flex-col items-center md:items-start justify-center w-full md:w-1/2">
              <motion.h1
                key={selectedTeam.id}
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="text-4xl sm:text-5xl md:text-6xl font-extrabold mb-6 text-white drop-shadow-lg text-center md:text-left"
                style={{ letterSpacing: "-0.03em" }}
              >
                {selectedTeam.name}
              </motion.h1>
              <button className="mt-2 px-8 py-4 rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 text-lg font-semibold shadow-lg hover:scale-105 hover:from-cyan-400 hover:to-blue-500 transition-all focus:outline-none focus:ring-2 focus:ring-cyan-400">
                Explore Player
              </button>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
