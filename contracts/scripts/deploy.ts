import { ethers } from "hardhat";
import { PlayerToken as PlayerTokenType } from "../typechain-types/contracts/PlayerToken";

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with the account:", deployer.address);

  const PlayerToken = await ethers.getContractFactory("PlayerToken");
  const playerToken = (await PlayerToken.deploy(
    "PlayerToken",
    "PT"
  )) as unknown as PlayerTokenType;
  await playerToken.waitForDeployment();
  console.log("PlayerToken deployed to:", playerToken.target);

  // Initialize the player token (example data)
  const txInit = await playerToken.initialize(
    1, // playerId
    "Lionel Messi", // name
    "Inter Miami", // teamname
    "Forward", // position
    "MLS", // league
    "2023/2024", // season
    1000 // initial supply
  );
  await txInit.wait();
  console.log("PlayerToken initialized");

  // Update player stats (example data)
  const stats = {
    goals: 10,
    assists: 7,
    penalties_scored: 2,
    shots_total: 30,
    shots_on_target: 18,
    duels_total: 50,
    duels_won: 35,
    tackles_total: 5,
    appearances: 12,
    yellow_cards: 1,
    red_cards: 0,
    lastUpdated: Math.floor(Date.now() / 1000),
  };
  const txStats = await playerToken.updatePlayerStats(stats);
  await txStats.wait();
  console.log("Player stats updated");

  // Fetch and print the calculated price
  const price = await playerToken.getPrice();
  console.log("Calculated PlayerToken price:", price.toString());
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
