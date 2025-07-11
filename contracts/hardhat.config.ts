import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import "dotenv/config";

const config: HardhatUserConfig = {
  solidity: "0.8.28",
  networks: {
    spicy: {
      url: "https://spicy-rpc.chiliz.com",
      accounts: [process.env.PRIVATE_KEY!],
      chainId: 88882,
    },
  },
};

export default config;
