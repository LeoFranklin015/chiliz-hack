// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./FanToken.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract FanTokenFactory {
    IERC20 public chz;
    address public owner;

    struct TokenInfo {
        address token;
        string name;
        string symbol;
    }

    TokenInfo[] public tokens;

    modifier onlyOwner() {
        require(msg.sender == owner, "Not owner");
        _;
    }

    constructor(address _chz) {
        chz = IERC20(_chz);
        owner = msg.sender;
    }

    function createTokens(string[][] memory namesAndSymbols, uint256 perTokenAmount) external onlyOwner {
        uint256 totalRequired = perTokenAmount * namesAndSymbols.length;
        require(chz.transferFrom(msg.sender, address(this), totalRequired), "CHZ transfer failed");

        for (uint i = 0; i < namesAndSymbols.length; i++) {
            FanToken token = new FanToken(namesAndSymbols[i][0], namesAndSymbols[i][1]);
            token.transferOwnership(address(this));
            token.mint(msg.sender, perTokenAmount);
            tokens.push(TokenInfo(address(token), namesAndSymbols[i][0], namesAndSymbols[i][1]));
        }
    }

    function redeem(uint256 index, uint256 amount) external {
        require(index < tokens.length, "Invalid index");
        FanToken token = FanToken(tokens[index].token);
        token.burn(msg.sender, amount);
        require(chz.transfer(msg.sender, amount), "CHZ refund failed");
    }

    function getTokens() external view returns (TokenInfo[] memory) {
        return tokens;
    }
}
