// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

// ERC20 interface
interface IERC20 {
    function balanceOf(address account) external view returns (uint256);
    function transferFrom(address from, address to, uint256 amount) external returns (bool);
    function transfer(address to, uint256 amount) external returns (bool);
}

// PlayerToken interface
interface IPlayerToken {
    function calculatePerformance(string memory position) external view returns (uint8);
    function getPlayerMetadata() external view returns (
        uint256 playerId,
        string memory name,
        string memory teamname,
        string memory position,
        string memory league,
        string memory season
    );
}

contract GameContractERC20 {
    // Struct to store game information
    struct Game {
        address creator;
        address[] creatorContracts;
        address joiner;
        address[] joinerContracts;
        bytes32 randomNumber;
        uint256 totalPool;
        address winner;
        bool isActive;
        mapping(address => uint256) tokenBalances;
    }

    // Contract state
    IERC20 public tokenContract; // The ERC20 token used for entry fees
    mapping(bytes32 => Game) public games;
    mapping(address => bytes32) public userToGameCode;
    uint256 public constant ENTRY_FEE = 200;
    uint256 public constant CONTRACT_COUNT = 5;

    // Events
    event GameCreated(address indexed creator, bytes32 gameCode, uint256 timestamp);
    event GameJoined(address indexed joiner, bytes32 gameCode, uint256 timestamp);
    event GameCompleted(address indexed winner, bytes32 gameCode, uint256 totalScore, uint256 timestamp);
    event TokensDeposited(address indexed user, bytes32 gameCode, uint256 amount, uint256 timestamp);
    event TokensDistributed(address indexed winner, bytes32 gameCode, uint256 amount, uint256 timestamp);

    // Constructor to set token contract address for entry fees
    constructor(address _tokenContract) {
        tokenContract = IERC20(_tokenContract);
    }

    // Create a new game
    function createGame(address[] memory contractAddresses) external returns (bytes32) {
        require(contractAddresses.length == CONTRACT_COUNT, "Must provide 5 ERC20 contract addresses");
        require(userToGameCode[msg.sender] == bytes32(0), "User already in a game");

        // Generate game code
        bytes32 gameCode = keccak256(abi.encodePacked(
            block.timestamp,
            block.prevrandao,
            blockhash(block.number - 1),
            msg.sender
        ));

        // Initialize game
        Game storage game = games[gameCode];
        game.creator = msg.sender;
        game.creatorContracts = contractAddresses;
        game.isActive = true;

        // Collect tokens
        _collectTokens(msg.sender, gameCode);

        userToGameCode[msg.sender] = gameCode;
        emit GameCreated(msg.sender, gameCode, block.timestamp);
        return gameCode;
    }

    // Join an existing game
    function joinGame(bytes32 gameCode, address[] memory contractAddresses) external {
        Game storage game = games[gameCode];
        require(game.isActive, "Game does not exist or is completed");
        require(game.joiner == address(0), "Game already has a joiner");
        require(contractAddresses.length == CONTRACT_COUNT, "Must provide 5 ERC20 contract addresses");
        require(userToGameCode[msg.sender] == bytes32(0), "User already in a game");

        game.joiner = msg.sender;
        game.joinerContracts = contractAddresses;

        // Collect tokens
        _collectTokens(msg.sender, gameCode);

        // Generate random number and play game
        _generateRandomNumber(gameCode);
        _playGame(gameCode);

        userToGameCode[msg.sender] = gameCode;
        emit GameJoined(msg.sender, gameCode, block.timestamp);
    }

    // Internal function to collect tokens
    function _collectTokens(address user, bytes32 gameCode) internal {
        Game storage game = games[gameCode];
        require(tokenContract.transferFrom(user, address(this), ENTRY_FEE), "Token transfer failed");
        game.tokenBalances[user] = ENTRY_FEE;
        game.totalPool += ENTRY_FEE;
        emit TokensDeposited(user, gameCode, ENTRY_FEE, block.timestamp);
    }

    // Internal function to generate random number
    function _generateRandomNumber(bytes32 gameCode) internal {
        Game storage game = games[gameCode];
        game.randomNumber = keccak256(abi.encodePacked(
            block.timestamp,
            block.prevrandao,
            blockhash(block.number - 1),
            gameCode,
            game.creator,
            game.joiner
        ));
    }

    // Internal function to rotate array based on random number
    function _rotateArray(address[] memory arr, uint256 shift) internal pure returns (address[] memory) {
        address[] memory rotated = new address[](arr.length);
        for (uint256 i = 0; i < arr.length; i++) {
            rotated[i] = arr[(i + shift) % arr.length];
        }
        return rotated;
    }

    // Internal function to play the game
    function _playGame(bytes32 gameCode) internal {
        Game storage game = games[gameCode];
        
        // Rotate creator's contracts based on random number
        uint256 shift = uint256(game.randomNumber) % CONTRACT_COUNT;
        address[] memory rotatedCreatorContracts = _rotateArray(game.creatorContracts, shift);

        // Get scores by calculating performance for each PlayerToken contract
        uint256 creatorScore = 0;
        uint256 joinerScore = 0;

        for (uint256 i = 0; i < CONTRACT_COUNT; i++) {
            IPlayerToken creatorToken = IPlayerToken(rotatedCreatorContracts[i]);
            IPlayerToken joinerToken = IPlayerToken(game.joinerContracts[i]);
            
            // Get creator player performance
            try creatorToken.getPlayerMetadata() returns (
                uint256 playerId,
                string memory name,
                string memory teamname,
                string memory position,
                string memory league,
                string memory season
            ) {
                try creatorToken.calculatePerformance(position) returns (uint8 cScore) {
                    creatorScore += uint256(cScore);
                } catch {
                    creatorScore += 0; // Handle failed performance calculation
                }
            } catch {
                creatorScore += 0; // Handle failed metadata retrieval
            }
            
            // Get joiner player performance
            try joinerToken.getPlayerMetadata() returns (
                uint256 playerId,
                string memory name,
                string memory teamname,
                string memory position,
                string memory league,
                string memory season
            ) {
                try joinerToken.calculatePerformance(position) returns (uint8 jScore) {
                    joinerScore += uint256(jScore);
                } catch {
                    joinerScore += 0; // Handle failed performance calculation
                }
            } catch {
                joinerScore += 0; // Handle failed metadata retrieval
            }
        }

        // Determine winner
        address winner = creatorScore >= joinerScore ? game.creator : game.joiner;
        game.winner = winner;
        game.isActive = false;

        // Distribute tokens
        require(tokenContract.transfer(winner, game.totalPool), "Token distribution failed");
        
        // Clean up
        delete userToGameCode[game.creator];
        delete userToGameCode[game.joiner];

        emit GameCompleted(winner, gameCode, creatorScore >= joinerScore ? creatorScore : joinerScore, block.timestamp);
        emit TokensDistributed(winner, gameCode, game.totalPool, block.timestamp);
    }

    // View functions
    function getGameDetails(bytes32 gameCode) external view returns (
        address creator,
        address[] memory creatorContracts,
        address joiner,
        address[] memory joinerContracts,
        address winner,
        bool isActive,
        uint256 totalPool
    ) {
        Game storage game = games[gameCode];
        return (
            game.creator,
            game.creatorContracts,
            game.joiner,
            game.joinerContracts,
            game.winner,
            game.isActive,
            game.totalPool
        );
    }

    function getTokenBalance(bytes32 gameCode, address user) external view returns (uint256) {
        return games[gameCode].tokenBalances[user];
    }
}