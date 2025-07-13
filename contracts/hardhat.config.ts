import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import "dotenv/config";

const config: HardhatUserConfig = {
  solidity: {
    version: "0.8.20",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
      viaIR: true,
    },
  },
  networks: {
    localhost: {
      url: "http://127.0.0.1:8545",
      chainId: 31337,
    },
    ...(process.env.PRIVATE_KEY && {
      spicy: {
        url: "https://spicy-rpc.chiliz.com",
        accounts: [process.env.PRIVATE_KEY],
        chainId: 88882,
      },
    }),
  },
};

export default config;
