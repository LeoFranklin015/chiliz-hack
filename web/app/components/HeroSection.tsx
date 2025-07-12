import React from "react";
import { motion } from "framer-motion";
import { CustomConnectButton } from "./ConnectButton";

const HeroSection = () => {
  const gameModes = [
    {
      title: "KICK OFF",
      subtitle: "Quick Match",
      description: "Start trading instantly",
      image: "bg-gradient-to-br from-blue-500 to-cyan-600",
      modes: "5 Modes",
      featured: true,
    },
    {
      title: "ONLINE TRADING",
      subtitle: "2.4K Online",
      description: "Live market trading",
      image: "bg-gradient-to-br from-green-500 to-emerald-600",
      modes: "Live",
    },
    {
      title: "TOURNAMENTS",
      subtitle: "Compete & Earn",
      description: "Weekly competitions",
      image: "bg-gradient-to-br from-purple-500 to-pink-600",
      modes: "Weekly",
    },
  ];

  const advancedModes = [
    {
      title: "CLASSIC MATCH",
      subtitle: "Traditional Trading",
      image: "bg-gradient-to-br from-gray-600 to-slate-700",
      modes: "14 Modes",
    },
    {
      title: "HOUSE RULES",
      subtitle: "Custom Trading",
      image: "bg-gradient-to-br from-orange-500 to-red-600",
      modes: "Custom",
    },
    {
      title: "SCOREX FOOTBALL",
      subtitle: "Fantasy League",
      image: "bg-gradient-to-br from-teal-500 to-blue-600",
      modes: "League",
    },
  ];

  const ultimateTeamModes = [
    {
      title: "SQUAD BATTLES",
      subtitle: "AI Challenges",
      image: "bg-gradient-to-br from-yellow-500 to-orange-600",
    },
    {
      title: "DIVISION RIVALS",
      subtitle: "Ranked Trading",
      image: "bg-gradient-to-br from-indigo-500 to-purple-600",
    },
    {
      title: "FUT CHAMPS",
      subtitle: "Elite Competition",
      image: "bg-gradient-to-br from-red-500 to-pink-600",
    },
  ];

  return (
    <section className="relative min-h-screen flex items-center justify-center py-20 overflow-hidden">
      {/* Background with blur effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-black to-gray-800" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/40" />

      {/* Hero player image on the right */}
      <div className="absolute right-0 top-0 bottom-0 w-1/2 z-10">
        <div className="relative h-full">
          <div className="absolute inset-0 bg-gradient-to-l from-transparent via-transparent to-black/80 z-20" />
          {/* Player silhouette */}
          <div className="absolute right-8 bottom-0 w-96 h-full bg-gradient-to-t from-blue-600/30 to-transparent rounded-l-3xl">
            <div className="absolute bottom-20 right-8 text-right text-white">
              <div className="text-6xl font-black mb-2">SCOREX</div>
              <div className="text-lg opacity-80">
                Fantasy Sports Revolution
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="relative z-30 max-w-7xl mx-auto px-6 w-full">
        {/* Top navigation bar */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex justify-between items-center mb-12"
        >
          <div className="flex items-center space-x-4">
            <div className="text-3xl font-black text-white">
              <span className="text-green-400">⚽</span> SCOREX
            </div>
          </div>
          <button className="flex items-center space-x-2 bg-gray-800/50 backdrop-blur-sm border border-gray-600 rounded-lg px-4 py-2 text-white hover:border-green-400 transition-colors">
            <span>☰</span>
            <span className="text-sm font-semibold">FULL MENU</span>
          </button>
        </motion.div>

        <div className="grid grid-cols-12 gap-6">
          {/* Left side - Game modes */}
          <div className="col-span-8 space-y-8">
            {/* Quick Play Section */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-black text-white">QUICK PLAY</h2>
                <span className="text-sm text-gray-400">
                  {gameModes[0].modes}
                </span>
              </div>

              <div className="grid grid-cols-3 gap-4">
                {gameModes.map((mode, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 + index * 0.1 }}
                    className={`relative ${
                      mode.image
                    } rounded-xl overflow-hidden cursor-pointer group transition-all duration-300 hover:scale-105 ${
                      mode.featured ? "row-span-2" : ""
                    }`}
                  >
                    <div className="absolute inset-0 bg-black/30 group-hover:bg-black/20 transition-colors" />
                    <div className="relative p-6 h-full flex flex-col justify-end">
                      <div className="mb-2">
                        {mode.subtitle && (
                          <div className="text-xs text-white/80 mb-1">
                            {mode.subtitle}
                          </div>
                        )}
                        <h3 className="text-lg font-black text-white">
                          {mode.title}
                        </h3>
                        <p className="text-sm text-white/90">
                          {mode.description}
                        </p>
                      </div>
                      {index === 0 && (
                        <button className="flex items-center space-x-2 text-white bg-white/20 backdrop-blur-sm rounded-lg px-3 py-2 text-sm font-semibold">
                          <span>▶</span>
                          <span>SELECT</span>
                        </button>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* VOLTA Section */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-black text-white">VOLTA</h2>
                <span className="text-sm text-gray-400">14 Modes</span>
              </div>

              <div className="grid grid-cols-3 gap-4">
                {advancedModes.map((mode, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 + index * 0.1 }}
                    className={`relative ${mode.image} rounded-xl overflow-hidden cursor-pointer group transition-all duration-300 hover:scale-105 h-32`}
                  >
                    <div className="absolute inset-0 bg-black/40 group-hover:bg-black/30 transition-colors" />
                    <div className="relative p-4 h-full flex flex-col justify-end">
                      <h3 className="text-sm font-black text-white">
                        {mode.title}
                      </h3>
                      <p className="text-xs text-white/80">{mode.subtitle}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Ultimate Team Section */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.8 }}
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-black text-white">
                  ULTIMATE TEAM
                </h2>
                <span className="text-sm text-gray-400">4 Modes</span>
              </div>

              <div className="grid grid-cols-4 gap-3">
                {ultimateTeamModes.map((mode, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.9 + index * 0.1 }}
                    className={`relative ${mode.image} rounded-lg overflow-hidden cursor-pointer group transition-all duration-300 hover:scale-105 h-24`}
                  >
                    <div className="absolute inset-0 bg-black/40 group-hover:bg-black/30 transition-colors" />
                    <div className="relative p-3 h-full flex flex-col justify-end">
                      <h3 className="text-xs font-bold text-white">
                        {mode.title}
                      </h3>
                      <p className="text-xs text-white/70">{mode.subtitle}</p>
                    </div>
                  </motion.div>
                ))}

                {/* Add one more card to complete the row */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.2 }}
                  className="relative bg-gradient-to-br from-green-500 to-teal-600 rounded-lg overflow-hidden cursor-pointer group transition-all duration-300 hover:scale-105 h-24"
                >
                  <div className="absolute inset-0 bg-black/40 group-hover:bg-black/30 transition-colors" />
                  <div className="relative p-3 h-full flex flex-col justify-end">
                    <h3 className="text-xs font-bold text-white">
                      CAREER MODE
                    </h3>
                    <p className="text-xs text-white/70">Build Portfolio</p>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </div>

          {/* Right side - Stats and info */}
          <div className="col-span-4">
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="space-y-6"
            >
              {/* Platform stats */}
              <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-600 rounded-xl p-6">
                <h3 className="text-lg font-bold text-white mb-4">
                  Platform Stats
                </h3>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-gray-300">Online Players</span>
                    <span className="text-green-400 font-bold">2,847</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-300">Active Trades</span>
                    <span className="text-blue-400 font-bold">1,293</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-300">Daily Volume</span>
                    <span className="text-purple-400 font-bold">€284K</span>
                  </div>
                </div>
              </div>

              {/* Featured player */}
              <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-600 rounded-xl p-6">
                <h3 className="text-lg font-bold text-white mb-4">
                  Featured Player
                </h3>
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full mx-auto mb-3 flex items-center justify-center">
                    <span className="text-black font-bold">MB</span>
                  </div>
                  <h4 className="text-white font-bold">Kylian Mbappé</h4>
                  <p className="text-gray-400 text-sm">PSG • ST • 94 OVR</p>
                  <div className="mt-3 text-green-400 font-bold">
                    €1,247 CHZ
                  </div>
                  <div className="text-green-400 text-sm">+12.5% today</div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
