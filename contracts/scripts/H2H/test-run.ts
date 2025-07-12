import { ethers } from "hardhat";
import * as fs from "fs";
import * as path from "path";

async function main() {
    const [deployer] = await ethers.getSigners();
    console.log("Deployer address:", deployer.address);

    // Read deployment summary to get token addresses
    const deploymentSummaryPath = path.join(__dirname, "../../deployment-summary-1752340057956.json");
    const deploymentSummary = JSON.parse(fs.readFileSync(deploymentSummaryPath, "utf8"));
    
    // Get 10 random token addresses from the deployment summary
    const tokenAddresses = deploymentSummary.deployedTokensList
        .slice(0, 10)
        .map((token: any) => token.tokenAddress);

    console.log("Using token addresses:", tokenAddresses);

    // Create two new random accounts for testing
    const userA = ethers.Wallet.createRandom();
    const userB = ethers.Wallet.createRandom();
    
    console.log("User A address:", userA.address);
    console.log("User B address:", userB.address);

    // Fund the new accounts with gas
    const fundingAmount = ethers.parseEther("15.0");
    
    const fundUserATx = await deployer.sendTransaction({
        to: userA.address,
        value: fundingAmount
    });
    await fundUserATx.wait();
    console.log("Sent 15.0 ETH to", userA.address, "for gas fees");
    
    const fundUserBTx = await deployer.sendTransaction({
        to: userB.address,
        value: fundingAmount
    });
    await fundUserBTx.wait();
    console.log("Sent 15.0 ETH to", userB.address, "for gas fees");

    // Connect the new accounts to the provider
    const provider = ethers.provider;
    const userASigner = userA.connect(provider);
    const userBSigner = userB.connect(provider);

    // Deploy a new GameContractERC20 using the specified token address
    const GameContractERC20 = await ethers.getContractFactory("GameContractERC20");
    const entryFeeTokenAddress = "0xAf4F8D2Bb4cB6e79456440Dd04A147AA64b6b3A1";
    
    console.log("Deploying new GameContractERC20 with entry fee token:", entryFeeTokenAddress);
    const gameContract = await GameContractERC20.deploy(entryFeeTokenAddress);
    await gameContract.waitForDeployment();
    
    const gameContractAddress = await gameContract.getAddress();
    console.log("Deployed new GameContractERC20 at:", gameContractAddress);

    // Mint tokens for both users on all PlayerToken contracts
    console.log("Minting tokens for User A on PlayerToken contracts...");
    for (const tokenAddress of tokenAddresses) {
        try {
            const tokenContract = await ethers.getContractAt("PlayerToken", tokenAddress);
            const mintTx = await tokenContract.mint(userA.address, 1000);
            await mintTx.wait();
            console.log("Minted 1000 tokens for User A on", tokenAddress);
        } catch (error: any) {
            console.log("Failed to mint for User A on", tokenAddress, ":", error.message);
        }
    }

    console.log("Minting tokens for User B on PlayerToken contracts...");
    for (const tokenAddress of tokenAddresses) {
        try {
            const tokenContract = await ethers.getContractAt("PlayerToken", tokenAddress);
            const mintTx = await tokenContract.mint(userB.address, 1000);
            await mintTx.wait();
            console.log("Minted 1000 tokens for User B on", tokenAddress);
        } catch (error: any) {
            console.log("Failed to mint for User B on", tokenAddress, ":", error.message);
        }
    }

    // Mint entry fee tokens for both users
    console.log("Providing entry fee tokens for both users...");
    const entryFeeTokenContract = await ethers.getContractAt("@openzeppelin/contracts/token/ERC20/IERC20.sol:IERC20", entryFeeTokenAddress);
    
    // Check if deployer has entry fee tokens to transfer
    const deployerBalance = await entryFeeTokenContract.balanceOf(deployer.address);
    console.log("Deployer entry fee token balance:", deployerBalance.toString());
    
    if (deployerBalance >= 1000) {
        try {
            const transferUserATx = await (entryFeeTokenContract as any).connect(deployer).transfer(userA.address, 1000);
            await transferUserATx.wait();
            console.log("Transferred 1000 entry fee tokens to", userA.address);
        } catch (error: any) {
            console.log("Failed to transfer entry fee tokens to User A:", error.message);
        }
        
        try {
            const transferUserBTx = await (entryFeeTokenContract as any).connect(deployer).transfer(userB.address, 1000);
            await transferUserBTx.wait();
            console.log("Transferred 1000 entry fee tokens to", userB.address);
        } catch (error: any) {
            console.log("Failed to transfer entry fee tokens to User B:", error.message);
        }
    } else {
        console.log("Deployer doesn't have enough entry fee tokens. Trying to mint...");
        try {
            // Try to mint using PlayerToken interface
            const playerTokenContract = await ethers.getContractAt("PlayerToken", entryFeeTokenAddress);
            const mintUserATx = await playerTokenContract.mint(userA.address, 1000);
            await mintUserATx.wait();
            console.log("Minted 1000 entry fee tokens for", userA.address);
        } catch (error: any) {
            console.log("Failed to mint entry fee tokens for User A:", error.message);
        }
        
        try {
            const playerTokenContract = await ethers.getContractAt("PlayerToken", entryFeeTokenAddress);
            const mintUserBTx = await playerTokenContract.mint(userB.address, 1000);
            await mintUserBTx.wait();
            console.log("Minted 1000 entry fee tokens for", userB.address);
        } catch (error: any) {
            console.log("Failed to mint entry fee tokens for User B:", error.message);
        }
    }

    // Check balances and approve tokens
    console.log("Checking balances and approving tokens...");
    
    const userAEntryBalance = await entryFeeTokenContract.balanceOf(userA.address);
    console.log(userA.address, "entry fee token balance:", userAEntryBalance.toString());
    
    const userBEntryBalance = await entryFeeTokenContract.balanceOf(userB.address);
    console.log(userB.address, "entry fee token balance:", userBEntryBalance.toString());

    // Approve tokens for the game contract
    const approveAmount = 200;
    
    const approveUserATx = await (entryFeeTokenContract as any).connect(userASigner).approve(gameContractAddress, approveAmount);
    await approveUserATx.wait();
    console.log(userA.address, "approved", approveAmount, "tokens to game contract");
    
    const approveUserBTx = await (entryFeeTokenContract as any).connect(userBSigner).approve(gameContractAddress, approveAmount);
    await approveUserBTx.wait();
    console.log(userB.address, "approved", approveAmount, "tokens to game contract");

    // Check if users are already in games
    console.log("Checking if users are already in games...");
    const userAGameCode = await gameContract.userToGameCode(userA.address);
    const userBGameCode = await gameContract.userToGameCode(userB.address);
    
    if (userAGameCode !== ethers.ZeroHash) {
        console.log("User A is already in a game:", userAGameCode);
    }
    if (userBGameCode !== ethers.ZeroHash) {
        console.log("User B is already in a game:", userBGameCode);
    }

    // Create a game with User A
    console.log("Creating game...");
    const creatorTokenAddresses = tokenAddresses.slice(0, 5); // Take first 5 addresses
    console.log("Creator token addresses:", creatorTokenAddresses);
    
    const createGameTx = await gameContract.connect(userASigner).createGame(creatorTokenAddresses);
    const createGameReceipt = await createGameTx.wait();
    console.log("Game created successfully!");
    
    if (!createGameReceipt || !createGameReceipt.logs) {
        throw new Error("createGameReceipt or its logs are null");
    }
    // Get the game code from the event
    let gameCode: string | undefined;
    for (const log of createGameReceipt.logs) {
        try {
            const parsed = gameContract.interface.parseLog(log);
            if (parsed && parsed.name === "GameCreated") {
                gameCode = parsed.args[1]; // gameCode is the second argument
                break;
            }
        } catch (e) {
            // Not a GameCreated event, skip
        }
    }
    if (!gameCode || gameCode === ethers.ZeroHash) {
        console.error("Could not find GameCreated event or gameCode is invalid. All logs:");
        for (const log of createGameReceipt.logs) {
            console.error(log);
        }
        throw new Error("Failed to get valid gameCode from GameCreated event");
    }
    console.log("Game code:", gameCode);

    // Join the game with User B
    console.log("Joining game...");
    const joinerTokenAddresses = tokenAddresses.slice(5, 10); // Take next 5 addresses
    console.log("Joiner token addresses:", joinerTokenAddresses);
    
    const joinGameTx = await gameContract.connect(userBSigner).joinGame(gameCode, joinerTokenAddresses);
    const joinGameReceipt = await joinGameTx.wait();
    console.log("Game joined successfully!");

    // Get game details
    const gameDetails = await gameContract.getGameDetails(gameCode);
    console.log("Game details:", gameDetails);
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });