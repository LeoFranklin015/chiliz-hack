import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const address = searchParams.get("address");
    const team = searchParams.get("team");
    const position = searchParams.get("position");
    const search = searchParams.get("search");

    if (!address) {
      return NextResponse.json(
        { error: "Missing address parameter" },
        { status: 400 }
      );
    }

    // Read the player registry file to get valid contract addresses
    const registryPath = path.join(
      process.cwd(),
      "..",
      "contracts",
      "enhanced-player-data-61-2024.json"
    );
    const registryData = JSON.parse(fs.readFileSync(registryPath, "utf8"));

    // Create a map of contract addresses to player data for quick lookup
    const playerRegistry = new Map();
    registryData.players.forEach((player: any) => {
      playerRegistry.set(player.tokenAddress.toLowerCase(), {
        playerId: player.playerId,
        playerName: player.playerName,
        teamName: player.teamName,
        position: player.position,
        teamCode: player.teamCode,
        teamLogo: player.teamLogoUrl,
        teamVenue: player.teamVenue,
        teamContractAddress: player.teamContractAddress,
        teamId: player.teamId,
        image: player.photoUrl,
        tokenName: player.tokenName,
        tokenSymbol: player.tokenSymbol,
        deployedAt: player.deploymentTime,
      });
    });

    // Fetch token holdings from Chiliz API
    const apiUrl = `https://spicy-explorer.chiliz.com/api?module=account&action=tokenlist&address=${address}`;

    const res = await fetch(apiUrl, {
      headers: {
        accept: "application/json",
      },
    });

    if (!res.ok) {
      return NextResponse.json(
        { error: "Failed to fetch token holdings from Chiliz API" },
        { status: res.status }
      );
    }

    const apiData = await res.json();

    // Filter tokens to only include those in our player registry
    let filteredTokens = [];

    if (apiData.result && Array.isArray(apiData.result)) {
      filteredTokens = apiData.result
        .filter((token: any) => {
          const contractAddress = token.contractAddress?.toLowerCase();
          return playerRegistry.has(contractAddress);
        })
        .map((token: any) => {
          const contractAddress = token.contractAddress?.toLowerCase();
          const playerData = playerRegistry.get(contractAddress);

          return {
            ...token,
            playerData: playerData,
          };
        });
    }

    // Apply additional filters
    if (team) {
      filteredTokens = filteredTokens.filter((token: any) =>
        token.playerData.teamName.toLowerCase().includes(team.toLowerCase())
      );
    }

    if (position) {
      filteredTokens = filteredTokens.filter(
        (token: any) =>
          token.playerData.position.toLowerCase() === position.toLowerCase()
      );
    }

    if (search) {
      filteredTokens = filteredTokens.filter(
        (token: any) =>
          token.playerData.playerName
            .toLowerCase()
            .includes(search.toLowerCase()) ||
          token.playerData.tokenSymbol
            .toLowerCase()
            .includes(search.toLowerCase())
      );
    }

    return NextResponse.json({
      success: true,
      data: filteredTokens,
      total: filteredTokens.length,
      address: address,
      leagueId: registryData.leagueId,
      season: registryData.season,
      lastUpdated: registryData.fetchTime,
      filters: {
        team: team || null,
        position: position || null,
        search: search || null,
      },
    });
  } catch (error) {
    console.error("Error fetching token holdings:", error);
    return NextResponse.json(
      { error: "Failed to fetch token holdings", details: error },
      { status: 500 }
    );
  }
}
