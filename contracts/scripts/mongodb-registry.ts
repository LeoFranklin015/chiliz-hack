import { ethers } from "hardhat";
import { PlayerToken as PlayerTokenType } from "../typechain-types/contracts/PlayerToken";
import * as fs from "fs";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

// MongoDB Data API configuration
const MONGODB_API_KEY = process.env.MONGODB_API_KEY;
const MONGODB_ENDPOINT = process.env.MONGODB_ENDPOINT;
const MONGODB_DATABASE_NAME = process.env.MONGODB_DATABASE_NAME;
const MONGODB_DATA_SOURCE = process.env.MONGODB_DATA_SOURCE;
const COLLECTION_NAME = 'player_token_registry';

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

// Store player token data in MongoDB
async function storePlayerTokenData(data: any) {
  try {
    await makeMongoDBRequest('insertOne', {
      document: {
        ...data,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    });
    console.log(`✅ Stored player token data in MongoDB: ${data.playerId || data.contractAddress}`);
  } catch (error) {
    console.error('❌ Failed to store player token data:', error);
  }
}

// Update player token data in MongoDB
async function updatePlayerTokenData(filter: any, update: any) {
  try {
    await makeMongoDBRequest('updateOne', {
      filter,
      update: {
        $set: {
          ...update,
          updatedAt: new Date()
        }
      },
      upsert: true
    });
    console.log(`✅ Updated player token data in MongoDB`);
  } catch (error) {
    console.error('❌ Failed to update player token data:', error);
  }
}

// Listen to PlayerToken events
async function listenToPlayerTokenEvents() {
  console.log('🎧 Starting PlayerToken event listener...');
  
  // Get the provider
  const provider = ethers.provider;
  
  // Listen to all events from PlayerToken contracts
  provider.on('*', async (event) => {
    try {
      // Check if this is a PlayerToken event
      if (event && event.logs) {
        for (const log of event.logs) {
          // Parse the event based on the event signature
          if (log.topics && log.topics.length > 0) {
            const eventSignature = log.topics[0];
            
            // PlayerTokenDeployed event
            if (eventSignature.includes('PlayerTokenDeployed')) {
              console.log(`🏗️  PlayerToken deployed event detected`);
              // Store basic event data
              await storePlayerTokenData({
                contractAddress: log.address,
                eventType: 'deployed',
                blockNumber: log.blockNumber,
                transactionHash: log.transactionHash,
                timestamp: new Date().toISOString()
              });
            }
            
            // PlayerTokenInitialized event
            if (eventSignature.includes('PlayerTokenInitialized')) {
              console.log(`🔧 PlayerToken initialized event detected`);
              await storePlayerTokenData({
                contractAddress: log.address,
                eventType: 'initialized',
                blockNumber: log.blockNumber,
                transactionHash: log.transactionHash,
                timestamp: new Date().toISOString()
              });
            }
            
            // PlayerTokenPurchased event
            if (eventSignature.includes('PlayerTokenPurchased')) {
              console.log(`💰 PlayerToken purchased event detected`);
              await storePlayerTokenData({
                contractAddress: log.address,
                eventType: 'purchased',
                blockNumber: log.blockNumber,
                transactionHash: log.transactionHash,
                timestamp: new Date().toISOString()
              });
            }
            
            // PlayerTokenBurned event
            if (eventSignature.includes('PlayerTokenBurned')) {
              console.log(`🔥 PlayerToken burned event detected`);
              await storePlayerTokenData({
                contractAddress: log.address,
                eventType: 'burned',
                blockNumber: log.blockNumber,
                transactionHash: log.transactionHash,
                timestamp: new Date().toISOString()
              });
            }
            
            // PlayerDataUpdated event
            if (eventSignature.includes('PlayerDataUpdated')) {
              console.log(`📊 Player data updated event detected`);
              await storePlayerTokenData({
                contractAddress: log.address,
                eventType: 'stats_updated',
                blockNumber: log.blockNumber,
                transactionHash: log.transactionHash,
                timestamp: new Date().toISOString()
              });
            }
            
            // TokensClaimed event
            if (eventSignature.includes('TokensClaimed')) {
              console.log(`🏆 Tokens claimed event detected`);
              await storePlayerTokenData({
                contractAddress: log.address,
                eventType: 'claimed',
                blockNumber: log.blockNumber,
                transactionHash: log.transactionHash,
                timestamp: new Date().toISOString()
              });
            }
            
            // PlayerClaimed event
            if (eventSignature.includes('PlayerClaimed')) {
              console.log(`👤 Player claimed event detected`);
              await storePlayerTokenData({
                contractAddress: log.address,
                eventType: 'player_claimed',
                blockNumber: log.blockNumber,
                transactionHash: log.transactionHash,
                timestamp: new Date().toISOString()
              });
            }
          }
        }
      }
    } catch (error) {
      console.error('❌ Error processing event:', error);
    }
  });
  
  console.log('✅ Event listener started successfully');
  console.log('📡 Listening for PlayerToken events...');
}

// Main function
async function main() {
  try {
    await listenToPlayerTokenEvents();
    
    // Keep the script running
    process.on('SIGINT', () => {
      console.log('\n🛑 Event listener stopped');
      process.exit(0);
    });
    
    process.on('SIGTERM', () => {
      console.log('\n🛑 Event listener stopped');
      process.exit(0);
    });
    
  } catch (error) {
    console.error('❌ Failed to start event listener:', error);
    process.exit(1);
  }
}

// Run the script
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
}); 