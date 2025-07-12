"use client"

import { useState } from "react"
import { Badge } from "../components/ui/badge"
import { ArrowRight } from "lucide-react"
import Link from "next/link"
import TopNav from "../components/ui/topnavbar"

const leagues = [
  {
    id: "premier-league",
    name: "Premier League",
    country: "England",
    teams: 20,
    value: "$6.2B",
    tier: "Elite",
    accent: "border-cyan-500/50 text-cyan-400",
    image: "/api/placeholder/600/200"
  },
  {
    id: "la-liga",
    name: "La Liga",
    country: "Spain",
    teams: 20,
    value: "$4.8B",
    tier: "Elite",
    accent: "border-orange-500/50 text-orange-400",
    image: "/api/placeholder/600/200"
  },
  {
    id: "bundesliga",
    name: "Bundesliga",
    country: "Germany",
    teams: 18,
    value: "$4.3B",
    tier: "Elite",
    accent: "border-red-500/50 text-red-400",
    image: "/api/placeholder/600/200"
  },
  {
    id: "serie-a",
    name: "Serie A",
    country: "Italy",
    teams: 20,
    value: "$3.9B",
    tier: "Elite",
    accent: "border-green-500/50 text-green-400",
    image: "/api/placeholder/600/200"
  },
  {
    id: "ligue-1",
    name: "Ligue 1",
    country: "France",
    teams: 20,
    value: "$2.1B",
    tier: "Top",
    accent: "border-blue-500/50 text-blue-400",
    image: "/api/placeholder/600/200"
  },
  {
    id: "mls",
    name: "Major League Soccer",
    country: "USA",
    teams: 29,
    value: "$1.8B",
    tier: "Growing",
    accent: "border-purple-500/50 text-purple-400",
    image: "/api/placeholder/600/200"
  },
]

export default function LeaguesPage() {
  const [selectedTier, setSelectedTier] = useState("All")
  const tiers = ["All", "Elite", "Top", "Growing"]

  const filteredLeagues = selectedTier === "All" ? leagues : leagues.filter((league) => league.tier === selectedTier)

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-950 via-zinc-900 to-zinc-950 text-white font-sans">
      <TopNav />
      
      {/* Hero Section */}
      <div className="container mx-auto px-6 py-16 text-center relative z-10">
        <div className="inline-block mb-4">
          <Badge
            variant="outline"
            className="border-cyan-500/50 text-cyan-400 bg-cyan-500/10 px-4 py-2 text-sm font-mono tracking-wider uppercase"
          >
            Global Football Ecosystem
          </Badge>
        </div>
        <h1 className="text-5xl md:text-7xl font-mono font-bold mb-6 tracking-tight leading-tight">
          ELITE FOOTBALL
          <span className="block text-cyan-400">LEAGUES</span>
        </h1>
        <p className="text-xl text-zinc-400 max-w-2xl mx-auto leading-relaxed">
          Explore the world's most prestigious football competitions
        </p>
      </div>

      {/* Tier Filter */}
      <div className="flex justify-center mb-12 relative z-10">
        <div className="flex space-x-2 bg-zinc-900/70 rounded-full p-2 backdrop-blur-sm border border-zinc-800/50">
          {tiers.map((tier) => (
            <button
              key={tier}
              onClick={() => setSelectedTier(tier)}
              className={`px-6 py-2 rounded-full font-mono font-medium tracking-wide uppercase transition-all duration-300 ${
                selectedTier === tier
                  ? "bg-cyan-600 text-white shadow-lg"
                  : "text-zinc-400 hover:text-white hover:bg-zinc-800/50"
              }`}
            >
              {tier}
            </button>
          ))}
        </div>
      </div>

      {/* Leagues Grid */}
      <div className="container mx-auto px-6 pb-16 space-y-4 relative z-10">
        {filteredLeagues.map((league) => (
          <Link key={league.id} href={`/map?league=${league.id}`}>
            <div className="relative rounded-xl overflow-hidden shadow-lg hover:shadow-cyan-500/20 transition-all duration-300 group h-32">
              {/* Background Image */}
              <div 
                className="absolute inset-0 bg-cover bg-center transition-all duration-300 group-hover:scale-105"
                style={{
                  backgroundImage: `url(${league.image})`,
                  filter: "grayscale(100%) brightness(0.3)",
                }}
              />
              
              {/* Colored overlay on hover */}
              <div 
                className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 via-transparent to-cyan-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                style={{
                  filter: "none",
                }}
              />
              
              {/* Dark overlay for text readability */}
              <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-black/80" />
              
              <div className="relative h-full p-6 flex items-center justify-between">
                {/* Left - League Info */}
                <div className="flex-1">
                  <div className="flex items-center space-x-4 mb-2">
                    <h3 className="text-2xl font-mono font-bold text-white tracking-wide">{league.name}</h3>
                    <Badge
                      className={`bg-zinc-800/50 ${league.accent} border px-3 py-1 text-xs uppercase font-mono`}
                    >
                      {league.tier}
                    </Badge>
                  </div>
                  <p className="text-zinc-300 text-lg font-medium mb-3">{league.country}</p>
                  
                  {/* Stats */}
                  <div className="flex space-x-8 text-sm">
                    <div>
                      <span className="text-zinc-400 uppercase tracking-wide">Teams</span>
                      <div className="text-white font-mono font-bold">{league.teams}</div>
                    </div>
                    <div>
                      <span className="text-zinc-400 uppercase tracking-wide">Value</span>
                      <div className="text-white font-mono font-bold">{league.value}</div>
                    </div>
                    <div>
                      <span className="text-zinc-400 uppercase tracking-wide">Rating</span>
                      <div className="text-white font-mono font-bold">9.{Math.floor(Math.random() * 10)}</div>
                    </div>
                  </div>
                </div>

                {/* Right - Arrow with Line */}
                <div className="flex-shrink-0 ml-6">
                  <div className="flex items-center space-x-2">
                    <div className="w-12 h-0.5 bg-zinc-600 group-hover:bg-cyan-400 transition-colors duration-300"></div>
                    <div className="w-12 h-12 bg-zinc-800/50 rounded-full flex items-center justify-center group-hover:bg-cyan-500/20 transition-all duration-300 border border-zinc-700/50 group-hover:border-cyan-500/50">
                      <ArrowRight className="w-6 h-6 text-zinc-400 group-hover:text-cyan-400 transition-colors duration-300" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Hover Effect Border */}
              <div className="absolute inset-0 border-2 border-transparent group-hover:border-cyan-500/30 transition-all duration-300 rounded-xl pointer-events-none" />
            </div>
          </Link>
        ))}
      </div>

      {/* Stats Section */}
      <div className="container mx-auto px-6 py-16 grid grid-cols-2 md:grid-cols-4 gap-6 text-center relative z-10">
        <div className="bg-zinc-900/50 p-6 rounded-xl border border-zinc-800/50 backdrop-blur-sm">
          <div className="text-4xl font-mono font-bold text-cyan-400 mb-2">127</div>
          <div className="text-zinc-400 uppercase font-medium tracking-wide">Total Teams</div>
        </div>
        <div className="bg-zinc-900/50 p-6 rounded-xl border border-zinc-800/50 backdrop-blur-sm">
          <div className="text-4xl font-mono font-bold text-cyan-400 mb-2">$23.1B</div>
          <div className="text-zinc-400 uppercase font-medium tracking-wide">Combined Value</div>
        </div>
        <div className="bg-zinc-900/50 p-6 rounded-xl border border-zinc-800/50 backdrop-blur-sm">
          <div className="text-4xl font-mono font-bold text-cyan-400 mb-2">2.8B</div>
          <div className="text-zinc-400 uppercase font-medium tracking-wide">Global Fans</div>
        </div>
        <div className="bg-zinc-900/50 p-6 rounded-xl border border-zinc-800/50 backdrop-blur-sm">
          <div className="text-4xl font-mono font-bold text-cyan-400 mb-2">45</div>
          <div className="text-zinc-400 uppercase font-medium tracking-wide">Countries</div>
        </div>
      </div>
    </div>
  )
}
