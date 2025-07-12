import express, { Request, Response } from 'express';
import cron from 'node-cron';
import { ethers } from "hardhat";
import { PlayerToken as PlayerTokenType } from "./typechain-types/contracts/PlayerToken";
import { ApiFootballAdapter } from "./src/adapter/api-football-adapter";
import * as fs from "fs";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// MongoDB Data API configuration
const MONGODB_API_KEY = process.env.MONGODB_API_KEY;
const MONGODB_ENDPOINT = process.env.MONGODB_ENDPOINT;
const MONGODB_DATABASE_NAME = process.env.MONGODB_DATABASE_NAME;
const MONGODB_DATA_SOURCE = process.env.MONGODB_DATA_SOURCE;
const COLLECTION_NAME = 'player_stats';

// Configuration
const config = {
  leagueId: 61, // Ligue 1
  season: 2024,
  initialSupply: '1000000',
  apiFootballKey: process.env.API_FOOTBALL_KEY || ''
};

// Initialize API adapter
const adapter = new ApiFootballAdapter({
  apiKey: config.apiFootballKey
});

// MongoDB Data API helper functions
async function makeMongoDBRequest(action: string, data?: any) {
  const url = `${MONGODB_ENDPOINT}/action/${action}`;
  
  const requestBody = {
    dataSource: MONGODB_DATA_SOURCE,
    database: MONGODB_DATABASE_NAME,
    collection: COLLECTION_NAME,
    ...data
  };

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'api-key': MONGODB_API_KEY || ''
      },
      body: JSON.stringify(requestBody)
    });

    if (!response.ok) {
      throw new Error(`MongoDB API request failed: ${response.status} ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('❌ MongoDB Data API request failed:', error);
    throw error;
  }
}

// Initialize MongoDB Data API connection
async function connectToMongoDB() {
  try {
    // Test connection by making a simple find request
    await makeMongoDBRequest('find', { filter: {}, limit: 1 });
    console.log('✅ Connected to MongoDB Data API');
  } catch (error) {
    console.error('❌ Failed to connect to MongoDB Data API:', error);
    throw error;
  }
}

interface RegistryPlayer {
  contractAddress: string;
  playerName: string;
  teamName: string;
  position: string;
  deployedAt: string;
  tokenName: string;
  tokenSymbol: string;
}

interface Registry {
  leagueId: number;
  season: number;
  createdAt: string;
  lastUpdated: string;
  players: Record<number, RegistryPlayer>;
}

/**
 * Load player registry from file
 */
function loadPlayerRegistry(): Registry | null {
  const registryFile = `player-registry-${config.leagueId}-${config.season}.json`;
  
  if (fs.existsSync(registryFile)) {
    try {
      const registry = JSON.parse(fs.readFileSync(registryFile, 'utf8')) as Registry;
      console.log(`📖 Loaded registry with ${Object.keys(registry.players).length} players`);
      return registry;
    } catch (error) {
      console.error('❌ Failed to load registry:', error);
      return null;
    }
  }
  
  console.log('⚠️  No registry file found');
  return null;
}

/**
 * Update player stats for all players in registry
 */
async function updateAllPlayerStats(): Promise<void> {
  console.log('\n🔄 Starting scheduled player stats update...');
  
  const registry = loadPlayerRegistry();
  if (!registry) {
    console.log('❌ No registry available for updates');
    return;
  }

  const playerIds = Object.keys(registry.players);
  console.log(`📊 Found ${playerIds.length} players to update`);

  let successCount = 0;
  let errorCount = 0;

  for (const playerIdStr of playerIds) {
    const playerId = parseInt(playerIdStr);
    const playerData = registry.players[playerId];
    
    try {
      console.log(`\n🔄 Updating stats for ${playerData.playerName} (${playerData.contractAddress})`);
      
      // Get contract instance
      const playerToken = await ethers.getContractAt("PlayerToken", playerData.contractAddress) as PlayerTokenType;
      
      // Create player object for the update function
      const player = {
        player: playerId,
        firstname: playerData.playerName.split(' ')[0] || '',
        lastname: playerData.playerName.split(' ').slice(1).join(' ') || '',
        teamname: playerData.teamName,
        position: playerData.position,
        nationality: '',
        age: 0,
        teamId: 0,
        teamName: playerData.teamName,
        teamCode: '',
        teamCountry: ''
      };

      // Update player stats only (skip initialization and minting)
      await updatePlayerStatsOnly(playerToken, player, config.leagueId, config.season, adapter);
      
      successCount++;
      console.log(`✅ Successfully updated ${playerData.playerName}`);
      
      // Add delay between updates to respect rate limits
      await new Promise(resolve => setTimeout(resolve, 2000));
      
    } catch (error) {
      errorCount++;
      console.error(`❌ Failed to update ${playerData.playerName}:`, error);
    }
  }

  console.log(`\n📊 Update Summary:`);
  console.log(`- Total players: ${playerIds.length}`);
  console.log(`- Successful updates: ${successCount}`);
  console.log(`- Failed updates: ${errorCount}`);
  console.log(`- Update completed at: ${new Date().toISOString()}`);
}

/**
 * Get stored stats from MongoDB Data API
 */
async function getStoredStats(playerId: number): Promise<any> {
  try {
    const result = await makeMongoDBRequest('findOne', {
      filter: { playerId }
    });
    return result.document;
  } catch (error) {
    console.error('❌ Failed to get stored stats:', error);
    return null;
  }
}

/**
 * Store stats in MongoDB Data API
 */
async function storeStats(playerId: number, stats: any): Promise<void> {
  try {
    await makeMongoDBRequest('updateOne', {
      filter: { playerId },
      update: {
        $set: { 
          ...stats, 
          playerId,
          updatedAt: new Date(),
          lastApiFetch: new Date()
        }
      },
      upsert: true
    });
    console.log(`       💾 Stats stored in MongoDB Data API for player ${playerId}`);
  } catch (error) {
    console.error('❌ Failed to store stats in MongoDB Data API:', error);
  }
}

/**
 * Compare two stats objects
 */
function areStatsEqual(stats1: any, stats2: any): boolean {
  const keys = ['goals', 'assists', 'penalties_scored', 'shots_total', 'shots_on_target', 
                'duels_total', 'duels_won', 'tackles_total', 'appearances', 'yellow_cards', 'red_cards'];
  
  for (const key of keys) {
    if (stats1[key] !== stats2[key]) {
      return false;
    }
  }
  return true;
}

/**
 * Update only player stats (without initialization and minting)
 */
async function updatePlayerStatsOnly(
  playerToken: PlayerTokenType,
  player: any,
  leagueId: number,
  season: number,
  adapter: ApiFootballAdapter
): Promise<void> {
  const fullName = `${player.firstname} ${player.lastname}`;
  
  // Get stored stats from MongoDB
  const storedStats = await getStoredStats(player.player);
  
  // Fetch real player stats from API Football
  console.log(`       📊 Fetching real stats for ${fullName}...`);
  let newStats = {
    goals: 0,
    assists: 0,
    penalties_scored: 0,
    shots_total: 0,
    shots_on_target: 0,
    duels_total: 0,
    duels_won: 0,
    tackles_total: 0,
    appearances: 0,
    yellow_cards: 0,
    red_cards: 0,
    lastUpdated: Math.floor(Date.now() / 1000),
  };
  
  try {
    const apiPlayerStats = await adapter.fetchPlayerStats(player.player, leagueId, season);
    
    if (apiPlayerStats && apiPlayerStats.statistics.length > 0) {
      const playerStats = apiPlayerStats.statistics[0];
      newStats = {
        goals: playerStats.goals.total || 0,
        assists: playerStats.goals.assists || 0,
        penalties_scored: playerStats.penalty.scored || 0,
        shots_total: playerStats.shots.total || 0,
        shots_on_target: playerStats.shots.on || 0,
        duels_total: playerStats.duels.total || 0,
        duels_won: playerStats.duels.won || 0,
        tackles_total: playerStats.tackles.total || 0,
        appearances: playerStats.games.appearences || 0,
        yellow_cards: playerStats.cards.yellow || 0,
        red_cards: playerStats.cards.red || 0,
        lastUpdated: Math.floor(Date.now() / 1000),
      };
      console.log(`       ✅ Using real stats from API Football`);
    } else {
      console.log(`       ⚠️  No API data available, using default stats`);
    }
  } catch (error) {
    console.log(`       ⚠️  API call failed, using default stats`);
  }
  
  // Store new stats in MongoDB
  await storeStats(player.player, newStats);
  
  // Compare with stored stats
  if (storedStats && areStatsEqual(storedStats, newStats)) {
    console.log(`       ⏭️  Stats unchanged for ${fullName}, skipping blockchain update`);
    return;
  }
  
  console.log(`       📊 Updating player stats on blockchain...`);
  try {
    const statsTx = await playerToken.updatePlayerStats(newStats, { gasLimit: 1000000 });
    await statsTx.wait();
    console.log(`       ✅ Player stats updated successfully on blockchain`);
  } catch (statsError) {
    console.error(`       ❌ Stats update failed:`, statsError);
    throw statsError;
  }
}

// Schedule cron job to run every 24 hours at 2:00 AM
cron.schedule('0 2 * * *', async () => {
  console.log('⏰ Scheduled player stats update triggered');
  await updateAllPlayerStats();
}, {
  scheduled: true,
  timezone: "UTC"
});

app.post('/api/update-stats', async (req: Request, res: Response) => {
  try {
    console.log('🔄 Manual stats update triggered via API');
    await updateAllPlayerStats();
    res.json({ 
      success: true, 
      message: 'Player stats update completed',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('❌ Manual update failed:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Update failed',
      timestamp: new Date().toISOString()
    });
  }
});

app.get('/api/health', (req: Request, res: Response) => {
  res.json({ 
    status: 'healthy',
    timestamp: new Date().toISOString(),
    nextUpdate: 'Daily at 2:00 AM UTC'
  });
});

app.get('/api/status', (req: Request, res: Response) => {
  const registry = loadPlayerRegistry();
  res.json({
    registryLoaded: !!registry,
    playerCount: registry ? Object.keys(registry.players).length : 0,
    lastUpdate: registry?.lastUpdated,
    config: {
      leagueId: config.leagueId,
      season: config.season
    }
  });
});

// Database stats endpoint
app.get('/api/db-stats', async (req: Request, res: Response) => {
  try {
    const countResult = await makeMongoDBRequest('countDocuments', {
      filter: {}
    });
    
    const lastUpdatedResult = await makeMongoDBRequest('findOne', {
      filter: {},
      sort: { updatedAt: -1 }
    });
    
    res.json({
      totalPlayers: countResult.count,
      lastUpdated: lastUpdatedResult.document?.updatedAt,
      database: MONGODB_DATABASE_NAME,
      collection: COLLECTION_NAME
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to get database stats' });
  }
});

// Clear database endpoint
app.delete('/api/db-clear', async (req: Request, res: Response) => {
  try {
    await makeMongoDBRequest('deleteMany', {
      filter: {}
    });
    res.json({ message: 'Database cleared successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to clear database' });
  }
});

// Start server
async function startServer() {
  try {
    // Connect to MongoDB first
    await connectToMongoDB();
    
    // Start Express server
    app.listen(PORT, () => {
      console.log(`🚀 Player Stats Update Server running on port ${PORT}`);
      console.log(`⏰ Scheduled updates: Daily at 2:00 AM UTC`);
      console.log(`🔗 Health check: http://localhost:${PORT}/api/health`);
      console.log(`🔗 Manual update: POST http://localhost:${PORT}/api/update-stats`);
      console.log(`🔗 Status: http://localhost:${PORT}/api/status`);
      console.log(`🔗 DB Stats: http://localhost:${PORT}/api/db-stats`);
      console.log(`🔗 Clear DB: DELETE http://localhost:${PORT}/api/db-clear`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
}

startServer();

// Handle graceful shutdown
process.on('SIGTERM', async () => {
  console.log('🛑 Server shutting down gracefully...');
  console.log('✅ MongoDB Data API connection closed');
  process.exit(0);
});

process.on('SIGINT', async () => {
  console.log('🛑 Server shutting down gracefully...');
  console.log('✅ MongoDB Data API connection closed');
  process.exit(0);
});
