import React from 'react'
import { motion } from 'framer-motion'

const SalientFeaturesSection = () => {
  const features = [
    {
      icon: '⚡',
      title: 'Real-time Trading',
      description: 'Trade player tokens instantly during live matches with real-time price updates based on performance.',
      color: 'from-yellow-500/10 to-orange-500/10',
      borderColor: 'border-yellow-400/30',
      textColor: 'text-yellow-400'
    },
    {
      icon: '🏆',
      title: 'Performance Metrics',
      description: 'Advanced analytics tracking goals, assists, saves, and comprehensive match statistics.',
      color: 'from-green-500/10 to-emerald-500/10',
      borderColor: 'border-green-400/30',
      textColor: 'text-green-400'
    },
    {
      icon: '💎',
      title: 'NFT Collections',
      description: 'Collect rare and legendary player cards with unique attributes and exclusive benefits.',
      color: 'from-purple-500/10 to-pink-500/10',
      borderColor: 'border-purple-400/30',
      textColor: 'text-purple-400'
    },
    {
      icon: '🔒',
      title: 'Secure Trading',
      description: 'Blockchain-secured transactions with smart contracts ensuring fair and transparent trading.',
      color: 'from-blue-500/10 to-cyan-500/10',
      borderColor: 'border-blue-400/30',
      textColor: 'text-blue-400'
    }
  ]

  return (
    <section className="relative py-20">
      {/* Decorative elements */}
      <div className="absolute top-10 right-10 w-32 h-32 bg-green-400/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-10 left-10 w-24 h-24 bg-blue-400/10 rounded-full blur-2xl"></div>
      
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-black text-white mb-6">
            Salient Features <span className="text-green-400">⭐</span>
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Discover what makes ScoreX the most advanced fantasy sports tokenization platform 
            in the world. Experience the future of sports trading today.
          </p>
        </motion.div>

        {/* Features grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className={`bg-gradient-to-br ${feature.color} backdrop-blur-sm border ${feature.borderColor} rounded-xl p-8 hover:scale-105 transition-all duration-300 group relative overflow-hidden`}
            >
              {/* Background decoration */}
              <div className="absolute top-0 right-0 w-20 h-20 bg-white/5 rounded-full -translate-y-10 translate-x-10"></div>
              
              <div className="relative z-10">
                <div className="text-5xl mb-6 group-hover:scale-110 transition-transform duration-300">
                  {feature.icon}
                </div>
                <h3 className={`text-xl font-bold ${feature.textColor} mb-4`}>
                  {feature.title}
                </h3>
                <p className="text-gray-300 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Additional features showcase */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-8"
        >
          {/* Left side - Feature highlight */}
          <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-8">
            <h3 className="text-2xl font-bold text-green-400 mb-6">🎮 Gaming Experience</h3>
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                <span className="text-gray-300">Interactive player cards with animations</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                <span className="text-gray-300">Live match integration and updates</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                <span className="text-gray-300">Achievement system and leaderboards</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                <span className="text-gray-300">Social trading and community features</span>
              </div>
            </div>
          </div>

          {/* Right side - Performance metrics */}
          <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-8">
            <h3 className="text-2xl font-bold text-blue-400 mb-6">📈 Advanced Analytics</h3>
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <span className="text-gray-300">Market Accuracy</span>
                <div className="flex items-center space-x-2">
                  <div className="w-24 h-2 bg-gray-700 rounded-full overflow-hidden">
                    <div className="w-[95%] h-full bg-green-400 rounded-full"></div>
                  </div>
                  <span className="text-green-400 font-bold">95%</span>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-300">Price Prediction</span>
                <div className="flex items-center space-x-2">
                  <div className="w-24 h-2 bg-gray-700 rounded-full overflow-hidden">
                    <div className="w-[88%] h-full bg-blue-400 rounded-full"></div>
                  </div>
                  <span className="text-blue-400 font-bold">88%</span>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-300">User Satisfaction</span>
                <div className="flex items-center space-x-2">
                  <div className="w-24 h-2 bg-gray-700 rounded-full overflow-hidden">
                    <div className="w-[97%] h-full bg-purple-400 rounded-full"></div>
                  </div>
                  <span className="text-purple-400 font-bold">97%</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export default SalientFeaturesSection 