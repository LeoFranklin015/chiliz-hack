import React from 'react'
import { motion } from 'framer-motion'

const AboutSection = () => {
  const platformFeatures = [
    {
      icon: '⚡',
      title: 'Real-Time Trading',
      description: 'Live market updates during matches',
      stat: '24/7',
      statLabel: 'Active Markets'
    },
    {
      icon: '🏆',
      title: 'Performance Based',
      description: 'Token values tied to actual gameplay',
      stat: '100%',
      statLabel: 'Data Accuracy'
    },
    {
      icon: '💰',
      title: 'Fair Rewards',
      description: 'Profits shared between traders and players',
      stat: '€2.4M',
      statLabel: 'Total Rewards'
    },
    {
      icon: '🔒',
      title: 'Secure Trading',
      description: 'Blockchain-secured transactions',
      stat: '256-bit',
      statLabel: 'Encryption'
    }
  ]

  return (
    <section className="relative py-24 bg-gradient-to-b from-black to-gray-900">
      <div className="max-w-7xl mx-auto px-6">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center space-x-3 bg-gray-800/50 backdrop-blur-sm border border-gray-600 rounded-full px-6 py-3 mb-6">
            <span className="text-2xl">📰</span>
            <span className="text-white font-semibold">ABOUT SCOREX</span>
          </div>
          <h2 className="text-5xl md:text-6xl font-black text-white mb-6">
            The Future of <span className="text-green-400">Fantasy Sports</span>
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-16">
          {/* Main content card */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="lg:col-span-8"
          >
            <div className="bg-gray-800/30 backdrop-blur-sm border border-gray-700 rounded-2xl p-8 h-full">
              <div className="space-y-6">
                <h3 className="text-3xl font-bold text-white">Revolutionary Platform</h3>
                
                <div className="space-y-4 text-gray-300 leading-relaxed">
                  <p className="text-lg">
                    ScoreX revolutionizes fantasy sports by introducing performance-driven tokenization. 
                    We eliminate speculation and pump-and-dump schemes by tying player token values 
                    directly to real-world performance metrics.
                  </p>
                  
                  <p>
                    Our platform creates a fair ecosystem where both token holders and actual players 
                    benefit from exceptional performance. At the end of each season, the total market 
                    pool is distributed proportionally between investors and the athletes themselves.
                  </p>
                  
                  <p>
                    Join thousands of traders who are transforming their football knowledge into real profits 
                    while supporting the players they believe in.
                  </p>
                </div>

                <div className="flex flex-wrap gap-4 pt-4">
                  <button className="flex items-center space-x-2 bg-green-500 hover:bg-green-400 text-black font-bold px-6 py-3 rounded-lg transition-all duration-300 hover:scale-105">
                    <span>▶</span>
                    <span>Start Trading</span>
                  </button>
                  <button className="flex items-center space-x-2 bg-gray-700/50 hover:bg-gray-600/50 text-white font-bold px-6 py-3 rounded-lg transition-all duration-300">
                    <span>📊</span>
                    <span>View Analytics</span>
                  </button>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Stats sidebar */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="lg:col-span-4"
          >
            <div className="bg-gray-800/30 backdrop-blur-sm border border-gray-700 rounded-2xl p-6 h-full">
              <h4 className="text-xl font-bold text-white mb-6">Platform Metrics</h4>
              
              <div className="space-y-6">
                <div className="flex justify-between items-center p-4 bg-gray-700/30 rounded-lg">
                  <div>
                    <div className="text-2xl font-bold text-green-400">24,891</div>
                    <div className="text-sm text-gray-400">Active Users</div>
                  </div>
                  <div className="text-green-400 text-2xl">👥</div>
                </div>
                
                <div className="flex justify-between items-center p-4 bg-gray-700/30 rounded-lg">
                  <div>
                    <div className="text-2xl font-bold text-blue-400">€2.4M</div>
                    <div className="text-sm text-gray-400">Total Volume</div>
                  </div>
                  <div className="text-blue-400 text-2xl">💎</div>
                </div>
                
                <div className="flex justify-between items-center p-4 bg-gray-700/30 rounded-lg">
                  <div>
                    <div className="text-2xl font-bold text-purple-400">156</div>
                    <div className="text-sm text-gray-400">Player Tokens</div>
                  </div>
                  <div className="text-purple-400 text-2xl">🎴</div>
                </div>
                
                <div className="flex justify-between items-center p-4 bg-gray-700/30 rounded-lg">
                  <div>
                    <div className="text-2xl font-bold text-yellow-400">5</div>
                    <div className="text-sm text-gray-400">Leagues</div>
                  </div>
                  <div className="text-yellow-400 text-2xl">🏆</div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Platform features grid */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <h3 className="text-3xl font-bold text-white text-center mb-12">Key Features</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {platformFeatures.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-gray-800/30 backdrop-blur-sm border border-gray-700 rounded-xl p-6 hover:border-green-400/50 transition-all duration-300 hover:scale-105 group"
              >
                <div className="text-center">
                  <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">
                    {feature.icon}
                  </div>
                  <h4 className="text-lg font-bold text-white mb-2">{feature.title}</h4>
                  <p className="text-gray-400 text-sm mb-4 leading-relaxed">
                    {feature.description}
                  </p>
                  
                  <div className="border-t border-gray-600 pt-4">
                    <div className="text-2xl font-bold text-green-400">{feature.stat}</div>
                    <div className="text-xs text-gray-400">{feature.statLabel}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Mission statement */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="mt-16"
        >
          <div className="bg-gradient-to-r from-green-500/10 to-blue-500/10 border border-green-400/30 rounded-2xl p-8 text-center">
            <div className="text-4xl mb-4">🎯</div>
            <h3 className="text-2xl font-bold text-green-400 mb-4">Our Mission</h3>
            <p className="text-gray-300 text-lg leading-relaxed max-w-3xl mx-auto">
              To create the most transparent and fair fantasy sports ecosystem where 
              performance truly matters and everyone wins when talent succeeds. We're building 
              a future where sports fans can directly support and profit from the players they believe in.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export default AboutSection 