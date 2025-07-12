import { ethers } from "hardhat";
import * as fs from "fs";
import * as path from "path";

async function main() {
    const [deployer] = await ethers.getSigners();
    console.log("Deployer address:", deployer.address);

    // Read deployment summary to get token addresses
    const deploymentSummaryPath = path.join(__dirname, "../../deployment-summary-1752340057956.json");
    const deploymentSummary = JSON.parse(fs.readFileSync(deploymentSummaryPath, "utf8"));
    
    // Get the first 5 tokens for testing
    const tokensToCheck = deploymentSummary.deployedTokensList.slice(0, 5);
    
    console.log(`Checking ${tokensToCheck.length} PlayerToken contracts...`);

    for (const tokenData of tokensToCheck) {
        try {
            const tokenContract = await ethers.getContractAt("PlayerToken", tokenData.tokenAddress);
            
            // Try to get player stats
            const stats = await tokenContract.getPlayerStats();
            console.log(`\n📊 ${tokenData.playerName} (${tokenData.position}):`);
            console.log(`   Goals: ${stats.goals}`);
            console.log(`   Assists: ${stats.assists}`);
            console.log(`   Appearances: ${stats.appearances}`);
            console.log(`   Duels won: ${stats.duels_won}`);
            console.log(`   Tackles: ${stats.tackles_total}`);
            
            // Try to calculate performance
            const performance = await tokenContract.calculatePerformance(tokenData.position);
            console.log(`   Performance score: ${performance}`);
            
        } catch (error: any) {
            console.log(`❌ Failed to check ${tokenData.tokenAddress}:`, error.message);
        }
    }

    console.log("\nToken check completed!");
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    }); 