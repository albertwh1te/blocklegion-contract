import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";

let dev_account = process.env.dev_account!;
let etherscan_api_key = process.env.etherscan_api_key!;

const config: HardhatUserConfig = {
  // defaultNetwork: "arb",
  // defaultNetwork: "ftmtest",
  // defaultNetwork: "ftm",
  //defaultNetwork: "mumbai",
  defaultNetwork: "localhost",
  // defaultNetwork: "hardhat",
  // defaultNetwork: "goerli",

  solidity: "0.8.17",

  mocha: {
    timeout: 100000000,
  },

  etherscan: {
    apiKey: etherscan_api_key,
  },

  networks: {

    goerli: {
      url: "https://rpc.ankr.com/eth_goerli	",
      accounts: [dev_account],
    },

    ftm: {
      url: "https://rpc.ankr.com/fantom",
      accounts: [dev_account],
    },

    ftmtest: {
      url: "https://fantom-testnet.public.blastapi.io",
      accounts: [dev_account],
    },
  },
};

export default config;
