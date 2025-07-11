import React from 'react'
import { motion } from 'framer-motion'

const PartnershipSection = () => {
  const mainPartners = [
    { name: 'FIFA', logo: '🏆', tier: 'Official Partner' },
    { name: 'UEFA', logo: '⚽', tier: 'Official Partner' },
    { name: 'Premier League', logo: '🦁', tier: 'League Partner' },
    { name: 'La Liga', logo: '🔥', tier: 'League Partner' }
  ]

  const additionalPartners = [
    { name: 'Bundesliga', logo: '🦅' },
    { name: 'Serie A', logo: '🏛️' },
    { name: 'Ligue 1', logo: '🗼' },
    { name: 'MLS', logo: '🌟' }
  ]

  return (
    <section className="relative py-24 bg-black">
      <div className="max-w-7xl mx-auto px-6">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center space-x-3 bg-gray-800/50 backdrop-blur-sm border border-gray-600 rounded-full px-6 py-3 mb-6">
            <span className="text-2xl">🤝</span>
            <span className="text-white font-semibold">PARTNERSHIPS</span>
          </div>
          <h2 className="text-5xl md:text-6xl font-black text-white mb-6">
            Official <span className="text-green-400">Partners</span>
          </h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Trusted by leading football organizations worldwide
          </p>
        </motion.div>

        {/* Main partners grid */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mb-16"
        >
          <h3 className="text-2xl font-bold text-white mb-8">Official Partners</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {mainPartners.map((partner, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-gray-800/30 backdrop-blur-sm border border-gray-700 rounded-xl p-8 hover:border-green-400/50 transition-all duration-300 hover:scale-105 group text-center"
              >
                <div className="text-6xl mb-4 group-hover:scale-110 transition-transform duration-300">
                  {partner.logo}
                </div>
                <h4 className="text-xl font-bold text-white mb-2">{partner.name}</h4>
                <div className="text-sm text-green-400 font-semibold mb-4">{partner.tier}</div>
                <div className="w-full h-1 bg-gray-700 rounded-full overflow-hidden">
                  <div className="h-full bg-green-400 rounded-full w-full"></div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Additional partners */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mb-16"
        >
          <h3 className="text-2xl font-bold text-white mb-8">League Partners</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
            {additionalPartners.map((partner, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-gray-800/20 backdrop-blur-sm border border-gray-700 rounded-lg p-4 hover:border-green-400/30 transition-all duration-300 hover:scale-105 group text-center"
              >
                <div className="text-3xl mb-2 group-hover:scale-110 transition-transform duration-300">
                  {partner.logo}
                </div>
                <div className="text-sm font-semibold text-gray-300 group-hover:text-green-400 transition-colors duration-300">
                  {partner.name}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Partnership benefits */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="grid grid-cols-1 lg:grid-cols-3 gap-8"
        >
          <div className="bg-gray-800/30 backdrop-blur-sm border border-gray-700 rounded-xl p-8 text-center group hover:border-green-400/50 transition-all duration-300">
            <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
              <span className="text-3xl">📊</span>
            </div>
            <h4 className="text-xl font-bold text-white mb-4">Official Data</h4>
            <p className="text-gray-400 leading-relaxed">
              Access to real-time, official match statistics and player performance data 
              directly from league partners.
            </p>
            <div className="mt-6 flex items-center justify-center space-x-2 text-sm text-green-400">
              <span>✓</span>
              <span>Verified & Authentic</span>
            </div>
          </div>
          
          <div className="bg-gray-800/30 backdrop-blur-sm border border-gray-700 rounded-xl p-8 text-center group hover:border-blue-400/50 transition-all duration-300">
            <div className="w-16 h-16 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
              <span className="text-3xl">🛡️</span>
            </div>
            <h4 className="text-xl font-bold text-white mb-4">Verified Players</h4>
            <p className="text-gray-400 leading-relaxed">
              All player tokens are verified and authorized by official league partnerships 
              ensuring authenticity.
            </p>
            <div className="mt-6 flex items-center justify-center space-x-2 text-sm text-blue-400">
              <span>✓</span>
              <span>League Authorized</span>
            </div>
          </div>
          
          <div className="bg-gray-800/30 backdrop-blur-sm border border-gray-700 rounded-xl p-8 text-center group hover:border-purple-400/50 transition-all duration-300">
            <div className="w-16 h-16 bg-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
              <span className="text-3xl">🌍</span>
            </div>
            <h4 className="text-xl font-bold text-white mb-4">Global Reach</h4>
            <p className="text-gray-400 leading-relaxed">
              Trade players from all major leagues worldwide with comprehensive 
              coverage and fair market access.
            </p>
            <div className="mt-6 flex items-center justify-center space-x-2 text-sm text-purple-400">
              <span>✓</span>
              <span>Worldwide Coverage</span>
            </div>
          </div>
        </motion.div>

        {/* Call to action */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="text-center mt-16"
        >
          <div className="bg-gradient-to-r from-gray-800/50 to-gray-700/50 backdrop-blur-sm border border-gray-600 rounded-2xl p-8 max-w-2xl mx-auto">
            <h3 className="text-2xl font-bold text-white mb-4">Join the Network</h3>
            <p className="text-gray-300 mb-6">
              Experience trading with official data from the world's top football organizations.
            </p>
            <button className="flex items-center space-x-2 bg-green-500 hover:bg-green-400 text-black font-bold px-8 py-4 rounded-lg transition-all duration-300 hover:scale-105 mx-auto">
              <span>▶</span>
              <span>Explore All Leagues</span>
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export default PartnershipSection 