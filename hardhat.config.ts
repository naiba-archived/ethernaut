import { resolve } from "path";
import { config as dotenvConfig } from "dotenv";
import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import "@tovarishfin/hardhat-yul";
import "hardhat-storage-layout";

const dotenvConfigPath: string = process.env.DOTENV_CONFIG_PATH || "./.env";
dotenvConfig({ path: resolve(__dirname, dotenvConfigPath) });

const config: HardhatUserConfig = {
  solidity: {
    version: "0.8.17",
    // settings: {
    //   optimizer: {
    //     enabled: true,
    //     runs: 1000,
    //   }
    // }
  },
  networks: {
    sepolia: {
      url: "https://sepolia.infura.io/v3/" + process.env.INFURA_PROJECT_ID,
      accounts: [process.env.PK!],
    },
  },
};

export default config;
