import React from 'react'
import CardSwap, { Card } from './ui/cardswap'

const FeaturesSection = () => {
  return (
    <section className="relative min-h-screen   flex items-center justify-center py-20">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left side - Text content */}
          <div className="space-y-8">
            <div>
              <h2 className="text-5xl md:text-6xl font-black text-white mb-6 leading-tight">
                Revolutionary
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-lime-400">
                  Gaming Experience
                </span>
              </h2>
              <p className="text-xl text-gray-300 leading-relaxed">
                ScoreX transforms fantasy sports with performance-driven tokenization. 
                No speculation, no pump-and-dump - just pure skill and real rewards.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gray-800/50 backdrop-blur-sm border border-cyan-400/20 rounded-lg p-6">
                <div className="text-cyan-400 text-2xl font-bold mb-2">24/7</div>
                <div className="text-white text-sm font-medium mb-1">Live Trading</div>
                <div className="text-gray-400 text-xs">Real-time market dynamics</div>
              </div>
              
              <div className="bg-gray-800/50 backdrop-blur-sm border border-lime-400/20 rounded-lg p-6">
                <div className="text-lime-400 text-2xl font-bold mb-2">100%</div>
                <div className="text-white text-sm font-medium mb-1">Performance Based</div>
                <div className="text-gray-400 text-xs">Zero speculation trading</div>
              </div>
            </div>
          </div>

          {/* Right side - CardSwap component */}
          <div className="relative h-[600px]">
            <CardSwap
              width={350}
              height={450}
              cardDistance={60}
              verticalDistance={70}
              delay={4000}
              pauseOnHover={true}
              skewAmount={8}
              easing="elastic"
            >
              <Card className="bg-gradient-to-br from-cyan-500/20 to-blue-600/20 border-cyan-400/30 backdrop-blur-sm">
                <div className="p-8 h-full flex flex-col justify-between">
                  <div>
                    <div className="w-16 h-16 bg-cyan-400 rounded-full flex items-center justify-center mb-6">
                      <span className="text-2xl">⚡</span>
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-4">Performance Trading</h3>
                    <p className="text-gray-300 leading-relaxed">
                      Player token values fluctuate based on real match performance metrics, 
                      not market speculation. Every goal, assist, and save matters.
                    </p>
                  </div>
                  <div className="text-cyan-400 text-sm font-semibold">
                    Real-time price updates
                  </div>
                </div>
              </Card>

              <Card className="bg-gradient-to-br from-lime-500/20 to-green-600/20 border-lime-400/30 backdrop-blur-sm">
                <div className="p-8 h-full flex flex-col justify-between">
                  <div>
                    <div className="w-16 h-16 bg-lime-400 rounded-full flex items-center justify-center mb-6">
                      <span className="text-2xl">🏆</span>
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-4">Season Rewards</h3>
                    <p className="text-gray-300 leading-relaxed">
                      At season end, the total market pool is distributed between 
                      token holders and actual players. Everyone wins when talent succeeds.
                    </p>
                  </div>
                  <div className="text-lime-400 text-sm font-semibold">
                    Fair reward distribution
                  </div>
                </div>
              </Card>

              <Card className="bg-gradient-to-br from-purple-500/20 to-pink-600/20 border-purple-400/30 backdrop-blur-sm">
                <div className="p-8 h-full flex flex-col justify-between">
                  <div>
                    <div className="w-16 h-16 bg-purple-400 rounded-full flex items-center justify-center mb-6">
                      <span className="text-2xl">📈</span>
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-4">Live Markets</h3>
                    <p className="text-gray-300 leading-relaxed">
                      Trade during matches with instant price updates. 
                      Watch your portfolio grow as your players perform on the field.
                    </p>
                  </div>
                  <div className="text-purple-400 text-sm font-semibold">
                    Instant market reactions
                  </div>
                </div>
              </Card>

              <Card className="bg-gradient-to-br from-orange-500/20 to-red-600/20 border-orange-400/30 backdrop-blur-sm">
                <div className="p-8 h-full flex flex-col justify-between">
                  <div>
                    <div className="w-16 h-16 bg-orange-400 rounded-full flex items-center justify-center mb-6">
                      <span className="text-2xl">⚖️</span>
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-4">Fair Economics</h3>
                    <p className="text-gray-300 leading-relaxed">
                      No pump-and-dump schemes or artificial inflation. 
                      Pure performance-driven economics that reward skill and knowledge.
                    </p>
                  </div>
                  <div className="text-orange-400 text-sm font-semibold">
                    Transparent pricing model
                  </div>
                </div>
              </Card>
            </CardSwap>
          </div>
        </div>
      </div>
    </section>
  )
}

export default FeaturesSection 