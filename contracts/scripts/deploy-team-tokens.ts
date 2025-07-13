import { ethers } from "hardhat";
import * as fs from "fs";

const tokenData = [
  ["testANG", "ANG"],
  ["testLIL", "LIL"],
  ["testLYO", "LYO"],
  ["testMAR", "MAR"],
  ["testMON", "MON"],
  ["testNAN", "NAN"],
  ["testNIC", "NIC"],
  ["testPAR", "PAR"],
  ["testREI", "REI"],
  ["testREN", "REN"],
  ["testSTR", "STR"],
  ["testTOU", "TOU"],
  ["testBRE", "BRE"],
  ["testAUX", "AUX"],
  ["testHAV", "HAV"],
  ["testMET", "MET"],
  ["testLEN", "LEN"],
  ["testETI", "ETI"],
  ["testMOA", "MOA"],
];

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deploying tokens with account:", deployer.address);

  const deployedTokens = [];

  for (let i = 0; i < tokenData.length; i++) {
    const [name, symbol] = tokenData[i];

    console.log(
      `\nDeploying token ${i + 1}/${tokenData.length}: ${name} (${symbol})`
    );

    const FanToken = await ethers.getContractFactory("FanToken");
    const token = await FanToken.deploy(name, symbol);
    await token.waitForDeployment();

    const tokenAddress = await token.getAddress();
    console.log(`✅ ${name} deployed to: ${tokenAddress}`);

    deployedTokens.push({
      name,
      symbol,
      address: tokenAddress,
    });
  }

  console.log("\n🎉 All tokens deployed successfully!");
  console.log("\nDeployed Tokens:");
  deployedTokens.forEach((token, index) => {
    console.log(
      `${index + 1}. ${token.name} (${token.symbol}): ${token.address}`
    );
  });
}

// Function to mint tokens to a specific account
async function mintTokensToAccount(
  targetAccount: string,
  amountPerToken: string = "1000000"
) {
  console.log(
    `\n🪙 Minting ${amountPerToken} tokens to account: ${targetAccount}`
  );

  try {
    // Read the deployed token addresses
    const tokenAddresses = JSON.parse(
      fs.readFileSync("teamFanTokenAddress.json", "utf8")
    );

    const [deployer] = await ethers.getSigners();
    console.log("Using deployer account:", deployer.address);

    const mintAmount = ethers.parseUnits(amountPerToken, 18);

    for (const [symbol, address] of Object.entries(tokenAddresses)) {
      try {
        console.log(`\nMinting ${symbol} tokens...`);

        const FanToken = await ethers.getContractAt(
          "FanToken",
          address as string
        );
        const mintTx = await FanToken.mint(targetAccount, mintAmount);
        await mintTx.wait();

        console.log(
          `✅ Minted ${amountPerToken} ${symbol} tokens to ${targetAccount}`
        );
      } catch (error) {
        console.error(`❌ Failed to mint ${symbol} tokens:`, error);
      }
    }

    console.log("\n🎉 Token minting completed!");
  } catch (error) {
    console.error("❌ Error reading token addresses:", error);
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
