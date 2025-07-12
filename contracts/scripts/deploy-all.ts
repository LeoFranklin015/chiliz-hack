import { ethers } from "hardhat";
import { PlayerToken as PlayerTokenType } from "../typechain-types/contracts/PlayerToken";
import * as fs from "fs";
import * as path from "path";
import dotenv from "dotenv";
import { ApiFootballAdapter, ApiFootballTeam, ApiFootballPlayer } from "../src/adapter/api-football-adapter";

// Load environment variables
dotenv.config();

// Type definitions
interface Config {
  leagueId: number;
  season: number;
  initialSupply: string;
  apiFootballKey: string;
}

interface Team {
  id: number;
  name: string;
  code: string;
  country: string;
}

interface Player {
  player: number;
  firstname: string;
  lastname: string;
  teamname: string;
  position: string;
  nationality: string;
  age: number;
  teamId?: number;
  teamName?: string;
  teamCode?: string;
  teamCountry?: string;
}

interface PlayerWithTeam extends Player {
  teamId: number;
  teamName: string;
  teamCode: string;
  teamCountry: string;
}

interface PlayerStats {
  goals: number;
  assists: number;
  penalties_scored: number;
  shots_total: number;
  shots_on_target: number;
  duels_total: number;
  duels_won: number;
  tackles_total: number;
  appearances: number;
  yellow_cards: number;
  red_cards: number;
  lastUpdated: number;
}

interface DeploymentInfo {
  playerId: number;
  playerName: string;
  tokenName: string;
  tokenSymbol: string;
  tokenAddress: string;
  teamId: number;
  teamName: string;
  position: string;
  nationality: string;
  age: number;
  deploymentTime: string;
  blockNumber: number;
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

interface DeploymentSummary {
  totalTeams: number;
  totalPlayers: number;
  deployedTokens: number;
  failedDeployments: number;
  leagueId: number;
  leagueName: string;
  season: number;
  deploymentTime: string;
  registryFile: string;
  deployedTokensList: DeploymentInfo[];
}

// League name mapping
const LEAGUE_NAMES: Record<number, string> = {
  74: 'Brasileiro Women',
  61: 'Ligue 1',
  39: 'Premier League',
  140: 'La Liga',
  135: 'Serie A',
};

async function main() {
  const config: Config = {
    leagueId: 74, // Ligue 1 - confirmed working
    season: 2025, // Current season - confirmed working
    initialSupply: '1000000',
    apiFootballKey: process.env.API_FOOTBALL_KEY || ''
  };

  // Validate required environment variables
  if (!config.apiFootballKey) {
    throw new Error('API_FOOTBALL_KEY environment variable is required');
  }

  console.log('Configuration:', {
    leagueId: config.leagueId,
    season: config.season,
    initialSupply: config.initialSupply
  });

  // Initialize registry
  const registryFile = `player-registry-${config.leagueId}-${config.season}.json`;
  const registry = loadOrCreateRegistry(registryFile, config);

  // Initialize API adapter
  const adapter = new ApiFootballAdapter({
    apiKey: config.apiFootballKey
  });

  const leagueName = LEAGUE_NAMES[config.leagueId] || `League ${config.leagueId}`;

  try {
    // Step 1: Fetch all teams
    console.log('\n📋 Step 1: Fetching all teams...');
    const apiTeams = await adapter.fetchTeams(config.leagueId, config.season);
    console.log(`✅ Found ${apiTeams.length} teams`);

    // Convert API teams to our format
    const teams: Team[] = apiTeams.map(apiTeam => ({
      id: apiTeam.team.id,
      name: apiTeam.team.name,
      code: apiTeam.team.code,
      country: apiTeam.team.country
    }));

    // Step 2: Process each team sequentially
    console.log('\n👥 Step 2: Processing teams and deploying player tokens...');
    const allDeployedTokens: DeploymentInfo[] = [];
    let totalPlayersProcessed = 0;

    for (let teamIndex = 0; teamIndex < teams.length; teamIndex++) {
      const team = teams[teamIndex];
      console.log(`\n🏆 Processing Team ${teamIndex + 1}/${teams.length}: ${team.name}`);
      console.log(`   Team ID: ${team.id}, Country: ${team.country}`);

      try {
        // Fetch players for this team
        console.log(`   📥 Fetching players for ${team.name}...`);
        const apiPlayers = await adapter.fetchTeamPlayers(team.id, config.leagueId, config.season);
        
        console.log(`   🔍 Raw API response: ${apiPlayers.length} players found`);
        if (apiPlayers.length > 0) {
          console.log(`   📊 Sample player data:`, {
            id: apiPlayers[0].player.id,
            name: `${apiPlayers[0].player.firstname} ${apiPlayers[0].player.lastname}`,
            statsCount: apiPlayers[0].statistics.length
          });
        }
        
        // Convert API players to our format
        const players: Player[] = apiPlayers.map(apiPlayer => {
          const stats = apiPlayer.statistics[0]; // Get first stats entry
          return {
            player: apiPlayer.player.id,
            firstname: apiPlayer.player.firstname,
            lastname: apiPlayer.player.lastname,
            teamname: stats?.team.name || team.name,
            position: stats?.games.position || 'Unknown',
            nationality: apiPlayer.player.nationality,
            age: apiPlayer.player.age
          };
        });

        // Add team info to each player
        const playersWithTeam: PlayerWithTeam[] = players.map(player => ({
          ...player,
          teamId: team.id,
          teamName: team.name,
          teamCode: team.code,
          teamCountry: team.country
        }));

        console.log(`   ✅ Found ${players.length} players in ${team.name}`);

        // Deploy tokens for all players in this team
        console.log(`   🎯 Deploying tokens for all players in ${team.name}...`);
        const teamDeployedTokens = await deployTokensForTeam(
          playersWithTeam, 
          team, 
          leagueName, 
          config, 
          totalPlayersProcessed,
          registry,
          registryFile,
          adapter
        );

        allDeployedTokens.push(...teamDeployedTokens);
        totalPlayersProcessed += players.length;

        console.log(`   ✅ Successfully deployed ${teamDeployedTokens.length}/${players.length} tokens for ${team.name}`);

        // Save registry after each team
        saveRegistry(registry, registryFile);
        console.log(`   💾 Registry updated and saved to ${registryFile}`);

        // Add delay between teams to respect API rate limits
        if (teamIndex < teams.length - 1) {
          console.log(`   ⏳ Waiting 3 seconds before next team...`);
          await adapter.waitForRateLimit(3000);
        }

      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        console.error(`   ❌ Failed to process team ${team.name}:`, errorMessage);
      }
    }

    // Step 3: Generate deployment summary
    console.log('\n📊 Step 3: Generating deployment summary...');
    
    const summary: DeploymentSummary = {
      totalTeams: teams.length,
      totalPlayers: totalPlayersProcessed,
      deployedTokens: allDeployedTokens.length,
      failedDeployments: totalPlayersProcessed - allDeployedTokens.length,
      leagueId: config.leagueId,
      leagueName: leagueName,
      season: config.season,
      deploymentTime: new Date().toISOString(),
      registryFile: registryFile,
      deployedTokensList: allDeployedTokens
    };

    console.log('\n🎉 Deployment Summary:');
    console.log(`- Total teams processed: ${summary.totalTeams}`);
    console.log(`- Total players processed: ${summary.totalPlayers}`);
    console.log(`- Successfully deployed: ${summary.deployedTokens}`);
    console.log(`- Failed deployments: ${summary.failedDeployments}`);
    console.log(`- League: ${summary.leagueName} (${summary.leagueId})`);
    console.log(`- Season: ${summary.season}`);
    console.log(`- Registry file: ${summary.registryFile}`);

    // Save final deployment summary to file
    const summaryFile = `deployment-summary-${Date.now()}.json`;
    fs.writeFileSync(summaryFile, JSON.stringify(summary, null, 2));
    console.log(`\n📄 Deployment summary saved to: ${summaryFile}`);

    // Final registry save
    saveRegistry(registry, registryFile);
    console.log(`\n💾 Final registry saved to: ${registryFile}`);
    console.log(`📊 Registry contains ${Object.keys(registry.players).length} player contracts`);

    return summary;

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('❌ Deployment failed:', errorMessage);
    // Save registry even on failure
    saveRegistry(registry, registryFile);
    console.log(`💾 Registry saved to ${registryFile} despite deployment failure`);
    throw error;
  }
}

/**
 * Load existing registry or create new one
 */
function loadOrCreateRegistry(registryFile: string, config: Config): Registry {
  if (fs.existsSync(registryFile)) {
    console.log(`📖 Loading existing registry from ${registryFile}`);
    const existingRegistry = JSON.parse(fs.readFileSync(registryFile, 'utf8')) as Registry;
    
    // Validate registry structure
    if (existingRegistry.leagueId === config.leagueId && 
        existingRegistry.season === config.season) {
      console.log(`✅ Found existing registry with ${Object.keys(existingRegistry.players).length} players`);
      return existingRegistry;
    } else {
      console.log(`⚠️  Existing registry is for different league/season, creating new one`);
    }
  }

  console.log(`📝 Creating new registry for league ${config.leagueId}, season ${config.season}`);
  return {
    leagueId: config.leagueId,
    season: config.season,
    createdAt: new Date().toISOString(),
    lastUpdated: new Date().toISOString(),
    players: {}
  };
}

/**
 * Save registry to file
 */
function saveRegistry(registry: Registry, registryFile: string): void {
  registry.lastUpdated = new Date().toISOString();
  fs.writeFileSync(registryFile, JSON.stringify(registry, null, 2));
}

/**
 * Deploy tokens for all players in a specific team
 */
async function deployTokensForTeam(
  players: PlayerWithTeam[], 
  team: Team, 
  leagueName: string, 
  config: Config, 
  totalPlayersProcessed: number, 
  registry: Registry, 
  registryFile: string,
  adapter: ApiFootballAdapter
): Promise<DeploymentInfo[]> {
  const PlayerToken = await ethers.getContractFactory("PlayerToken");
  const deployedTokens: DeploymentInfo[] = [];

  for (let i = 0; i < players.length; i++) {
    const player = players[i];
    
    try {
      // Check if player already has a contract in registry
      if (registry.players[player.player]) {
        console.log(`     ⏭️  Skipping ${player.firstname} ${player.lastname} - already deployed at ${registry.players[player.player].contractAddress}`);
        continue;
      }

      // Generate token name and symbol
      const fullName = `${player.firstname} ${player.lastname}`;
      const tokenName = `${fullName} (${leagueName} ${config.season})`;
      const tokenSymbol = generateTokenSymbol(fullName);

      console.log(`     Deploying token for ${fullName} (${i + 1}/${players.length})`);
      console.log(`       Name: ${tokenName}`);
      console.log(`       Symbol: ${tokenSymbol}`);
      console.log(`       Player ID: ${player.player}`);

      // Deploy player token contract with minimal constructor
      const playerToken = (await PlayerToken.deploy(
        tokenName,
        tokenSymbol
      )) as unknown as PlayerTokenType;
      
      await playerToken.waitForDeployment();
      const tokenAddress = await playerToken.getAddress();

      // Initialize the contract with player data
      const initializeTx = await playerToken.initialize(
        player.player,
        fullName,
        player.teamname,
        player.position,
        leagueName,
        config.season.toString(),
        config.initialSupply
      );
      await initializeTx.wait();

      // Fetch real player stats from API Football
      console.log(`       📊 Fetching real stats for ${fullName}...`);
      let stats: PlayerStats;
      
      try {
        const apiPlayerStats = await adapter.fetchPlayerStats(player.player, config.leagueId, config.season);
        
        if (apiPlayerStats && apiPlayerStats.statistics.length > 0) {
          const playerStats = apiPlayerStats.statistics[0];
          stats = {
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
          // Fallback to mock stats if API doesn't return data
          stats = generateMockStats();
          console.log(`       ⚠️  Using mock stats (no API data available)`);
        }
      } catch (error) {
        // Fallback to mock stats if API call fails
        stats = generateMockStats();
        console.log(`       ⚠️  Using mock stats (API call failed)`);
      }
      
      const statsTx = await playerToken.updatePlayerStats(stats);
      await statsTx.wait();

      // Store deployment info
      const deploymentInfo: DeploymentInfo = {
        playerId: player.player,
        playerName: fullName,
        tokenName: tokenName,
        tokenSymbol: tokenSymbol,
        tokenAddress: tokenAddress,
        teamId: player.teamId,
        teamName: player.teamName,
        position: player.position,
        nationality: player.nationality,
        age: player.age,
        deploymentTime: new Date().toISOString(),
        blockNumber: (await playerToken.deploymentTransaction())?.blockNumber || 0
      };

      deployedTokens.push(deploymentInfo);

      // Add to registry
      registry.players[player.player] = {
        contractAddress: tokenAddress,
        playerName: fullName,
        teamName: player.teamName,
        position: player.position,
        deployedAt: new Date().toISOString(),
        tokenName: tokenName,
        tokenSymbol: tokenSymbol
      };

      console.log(`       ✅ Token deployed to: ${tokenAddress}`);
      console.log(`       ✅ Initialized with player data`);
      console.log(`       ✅ Updated with player stats`);
      console.log(`       📝 Added to registry`);

      // Save registry periodically (every 5 deployments)
      if ((i + 1) % 5 === 0) {
        saveRegistry(registry, registryFile);
        console.log(`       💾 Registry saved (${i + 1}/${players.length} players)`);
      }

      // Add delay between deployments and API calls
      await adapter.waitForRateLimit(2000);

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      console.error(`       ❌ Failed to deploy token for ${player.firstname} ${player.lastname}:`, errorMessage);
    }
  }

  return deployedTokens;
}

/**
 * Generate mock player stats as fallback
 */
function generateMockStats(): PlayerStats {
  return {
    goals: Math.floor(Math.random() * 20) + 1,
    assists: Math.floor(Math.random() * 15) + 1,
    penalties_scored: Math.floor(Math.random() * 5),
    shots_total: Math.floor(Math.random() * 50) + 10,
    shots_on_target: Math.floor(Math.random() * 30) + 5,
    duels_total: Math.floor(Math.random() * 100) + 20,
    duels_won: Math.floor(Math.random() * 70) + 10,
    tackles_total: Math.floor(Math.random() * 20) + 1,
    appearances: Math.floor(Math.random() * 25) + 5,
    yellow_cards: Math.floor(Math.random() * 5),
    red_cards: Math.floor(Math.random() * 2),
    lastUpdated: Math.floor(Date.now() / 1000),
  };
}

/**
 * Generate a token symbol from player name
 */
function generateTokenSymbol(fullName: string): string {
  const names = fullName.split(' ');
  if (names.length >= 2) {
    // Use first letter of first name + first 2-3 letters of last name
    const firstName = names[0];
    const lastName = names[names.length - 1];
    return (firstName.charAt(0) + lastName.substring(0, 3)).toUpperCase();
  } else {
    // Use first 4 letters of single name
    return fullName.substring(0, 4).toUpperCase();
  }
}

/**
 * Validate player data for deployment
 */
function validatePlayerForDeployment(player: Player): boolean {
  return Boolean(player.player && 
         player.firstname && 
         player.lastname && 
         player.teamname && 
         player.position);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
}); 