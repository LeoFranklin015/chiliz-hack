
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";


contract PlayerToken is ERC20, Ownable {
    // Player metadata structure (stored once at deployment)
    struct PlayerMetadata {
        uint256 playerId;
        string name;
        string teamname;
        string position;
        string league;
        string season;
    }

    // Player statistics structure (updated by owner)
    struct PlayerStats {
        // Core stats
        uint256 goals;
        uint256 assists;
        uint256 penalties_scored;
        uint256 shots_total;
        uint256 shots_on_target;
        uint256 duels_total;
        uint256 duels_won;
        uint256 tackles_total;
        uint256 appearances;
        uint256 yellow_cards;
        uint256 red_cards;
        // Metadata
        uint256 lastUpdated;
    }
    
    // Player metadata (immutable after deployment)
    PlayerMetadata public playerMetadata;
    
    // Player statistics (updated by owner)
    PlayerStats public playerStats;
    
    // Data history mapping (timestamp => PlayerStats)
    mapping(uint256 => PlayerStats) public statsHistory;
    uint256[] public updateTimestamps;
    
    // Events
    event PlayerDataUpdated(
        uint256 indexed playerId,
        uint256 goals,
        uint256 assists,
        uint256 appearances,
        uint256 timestamp
    );

    constructor(
        string memory name,
        string memory symbol
    ) ERC20(name, symbol) Ownable(msg.sender) {
        // Initialize in separate function to avoid stack too deep
    }


    function initialize(
        uint256 _playerId,
        string memory _name,
        string memory _teamname,
        string memory _position,
        string memory _league,
        string memory _season,
        uint256 _initialSupply
    ) external onlyOwner {
        require(playerMetadata.playerId == 0, "PlayerToken: Already initialized");
        
        playerMetadata = PlayerMetadata({
            playerId: _playerId,
            name: _name,
            teamname: _teamname,
            position: _position,
            league: _league,
            season: _season
        });
        
        playerStats.lastUpdated = block.timestamp;
        _mint(msg.sender, _initialSupply);
    }


    function updatePlayerStats(
        PlayerStats calldata _stats
    ) external onlyOwner {
        // Store current stats in history
        uint256 timestamp = block.timestamp;
        statsHistory[timestamp] = playerStats;
        updateTimestamps.push(timestamp);
        
        // Update current stats
        playerStats = _stats;
        playerStats.lastUpdated = timestamp;
        
        emit PlayerDataUpdated(
            playerMetadata.playerId,
            _stats.goals,
            _stats.assists,
            _stats.appearances,
            timestamp
        );
    }


    function getPlayerMetadata() external view returns (PlayerMetadata memory) {
        return playerMetadata;
    }


    function getPlayerStats() external view returns (
        uint256 goals,
        uint256 assists,
        uint256 penalties_scored,
        uint256 shots_total,
        uint256 shots_on_target,
        uint256 duels_total,
        uint256 duels_won,
        uint256 tackles_total,
        uint256 appearances,
        uint256 yellow_cards,
        uint256 red_cards
    ) {
        return (
            playerStats.goals,
            playerStats.assists,
            playerStats.penalties_scored,
            playerStats.shots_total,
            playerStats.shots_on_target,
            playerStats.duels_total,
            playerStats.duels_won,
            playerStats.tackles_total,
            playerStats.appearances,
            playerStats.yellow_cards,
            playerStats.red_cards
        );
    }


    function getStatsHistory(uint256 timestamp) external view returns (PlayerStats memory) {
        return statsHistory[timestamp];
    }
    function getUpdateTimestamps() external view returns (uint256[] memory) {
        return updateTimestamps;
    }


    function getUpdateCount() external view returns (uint256) {
        return updateTimestamps.length;
    }


    function decimals() public view virtual override returns (uint8) {
        return 0;
    }


    function mint(address to, uint256 amount) external onlyOwner {
        _mint(to, amount);
    }


    function burn(address from, uint256 amount) external onlyOwner {
        _burn(from, amount);
    }

    // Calculate player performance based on stats and position (using only available fields)
    function calculatePerformance(string memory position) public view returns (uint8) {
        uint256 score = 0;
        bytes32 pos = keccak256(abi.encodePacked(toLower(position)));
        if (pos == keccak256(abi.encodePacked("attacker"))) {
            score = 5 * playerStats.goals +
                    3 * playerStats.assists +
                    2 * playerStats.shots_on_target +
                    1 * playerStats.duels_won;
            if (score > 100) score = 100;
            score = score / 10;
        } else if (pos == keccak256(abi.encodePacked("defender"))) {
            int256 tempScore = int256(
                4 * playerStats.tackles_total +
                2 * playerStats.duels_won
            ) - int256(2 * (playerStats.yellow_cards + playerStats.red_cards));
            if (tempScore < 0) tempScore = 0;
            if (tempScore > 100) tempScore = 100;
            score = uint256(tempScore) / 10;
        } else if (pos == keccak256(abi.encodePacked("goalkeeper"))) {
            uint256 cardPenalty = (playerStats.yellow_cards + 2 * playerStats.red_cards) * 10;
            uint256 cardFactor = cardPenalty > 100 ? 0 : 100 - cardPenalty;
            score = cardFactor / 10;
        } else if (pos == keccak256(abi.encodePacked("midfielder"))) {
            score = 3 * playerStats.goals +
                    4 * playerStats.assists +
                    1 * playerStats.duels_won;
            if (score > 100) score = 100;
            score = score / 10;
        } else {
            score = (playerStats.goals + playerStats.assists + playerStats.duels_won) / 3;
            if (score < 1) score = 1;
            else if (score > 10) score = 10;
            return uint8(score);
        }
        if (score < 1) score = 1;
        if (score > 10) score = 10;
        return uint8(score);
    }

    // Helper function to lowercase a string (ASCII only)
    function toLower(string memory str) internal pure returns (string memory) {
        bytes memory bStr = bytes(str);
        bytes memory bLower = new bytes(bStr.length);
        for (uint i = 0; i < bStr.length; i++) {
            if ((uint8(bStr[i]) >= 65) && (uint8(bStr[i]) <= 90)) {
                bLower[i] = bytes1(uint8(bStr[i]) + 32);
            } else {
                bLower[i] = bStr[i];
            }
        }
        return string(bLower);
    }

    // Get the price of the player token based on supply, demand, and performance
    function getPrice() public view returns (uint256) {
        uint256 supply = totalSupply();
        // Demand proxy: tokens not held by owner (could be improved with real demand tracking)
        uint256 demand = supply - balanceOf(owner());
        if (supply == 0) return 0;
        uint8 perf = calculatePerformance(playerMetadata.position);
        // Base price in wei (e.g., 1 ether for scaling)
        uint256 base = 1 ether;
        // Price formula: base * (performance + demand) / (supply + 1)
        uint256 price = base * (uint256(perf) + demand) / (supply + 1);
        return price;
    }
    
}
