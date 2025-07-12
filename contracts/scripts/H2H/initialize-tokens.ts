import { ethers } from "hardhat";
import * as fs from "fs";
import * as path from "path";

async function main() {
    const [deployer] = await ethers.getSigners();
    console.log("Deployer address:", deployer.address);

    // Read deployment summary to get token addresses and player data
    const deploymentSummaryPath = path.join(__dirname, "../../deployment-summary-1752340057956.json");
    const deploymentSummary = JSON.parse(fs.readFileSync(deploymentSummaryPath, "utf8"));
    
    // Get the first 10 tokens for testing
    const tokensToInitialize = deploymentSummary.deployedTokensList.slice(0, 10);
    
    console.log(`Initializing ${tokensToInitialize.length} PlayerToken contracts...`);

    for (const tokenData of tokensToInitialize) {
        try {
            const tokenContract = await ethers.getContractAt("PlayerToken", tokenData.tokenAddress);
            
            // Check if already initialized
            const metadata = await tokenContract.getPlayerMetadata();
            if (metadata.playerId !== 0n) {
                console.log(`Token ${tokenData.tokenAddress} already initialized for ${tokenData.playerName}`);
                continue;
            }

            // Initialize the token with player metadata
            const initializeTx = await tokenContract.initialize(
                tokenData.playerId,
                tokenData.playerName,
                tokenData.teamName,
                tokenData.position,
                "Ligue 1", // league
                "2024",    // season
                10000      // initial supply
            );
            
            await initializeTx.wait();
            console.log(`✅ Initialized ${tokenData.playerName} (${tokenData.position}) at ${tokenData.tokenAddress}`);
            
            // Add some basic stats to make the game work
            const statsTx = await tokenContract.updatePlayerStats({
                goals: Math.floor(Math.random() * 10),
                assists: Math.floor(Math.random() * 10),
                penalties_scored: Math.floor(Math.random() * 3),
                shots_total: Math.floor(Math.random() * 50),
                shots_on_target: Math.floor(Math.random() * 25),
                duels_total: Math.floor(Math.random() * 100),
                duels_won: Math.floor(Math.random() * 50),
                tackles_total: Math.floor(Math.random() * 30),
                appearances: Math.floor(Math.random() * 20) + 5,
                yellow_cards: Math.floor(Math.random() * 5),
                red_cards: Math.floor(Math.random() * 2),
                lastUpdated: 0 // will be set by the contract
            });
            
            await statsTx.wait();
            console.log(`📊 Added stats for ${tokenData.playerName}`);
            
        } catch (error: any) {
            console.log(`❌ Failed to initialize ${tokenData.tokenAddress}:`, error.message);
        }
    }

    console.log("Token initialization completed!");
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    }); 