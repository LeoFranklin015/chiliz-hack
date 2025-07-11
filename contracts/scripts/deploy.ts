import { ethers } from "hardhat";

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with the account:", deployer.address);

  const PlayerToken = await ethers.getContractFactory("PlayerToken");
  const playerToken = await PlayerToken.deploy("PlayerToken", "PT");
  await playerToken.waitForDeployment();
  console.log("PlayerToken deployed to:", playerToken.target);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
