import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";

// 0xbcc2501734752c19bb035c3e801e8d6f42353e88
const sun1_akina =
  "87e23825078b26f28d16b674879b3d02f67ca7a0b1d1c2b632a9ce1af287f856";

const polygon_test =
  "https://polygon-mumbai.g.alchemy.com/v2/bn5hnJZYRm_ga2t_oQLkq2DFYO_8mtOv";

// 0x3f1c0484A0502967422C378Fc57C448f0902291D
const sun4 = "8fd91cdca2dbf657c1829215efd873d0af85d4b4f145cf05ce667134058d5139";

const sun5 = "623e5d58e92a1598449b64eacfda2519c63b8073e80eaea53b58f670805a91ae";

const fate = "b5991ddf39ebf7f908667347730897553300e0f1faab16564c006413af4cb493";

const chatbot =
  "04866b5a4ac61ce8c5e1b89cef405b0a1ce2eee79af2e39ecd9c58726b7ecdd5";

const phone =
  "c42b755e6027f7c065581095d0a6c0573e6f9d6183707d4797f9bf5bd1f9fe2b";

const batch4 =
  "a37e9e900739bafc485fb744e81ac96074e3d768f43322dbb522b7c865aadcdf";

const merryToken =
  "2f89b7faac37d28eec04c6f5a6bd954013045e59720514d6e1c7875011cf832d";

const config: HardhatUserConfig = {
  // defaultNetwork: "arb",
  // defaultNetwork: "ftmtest",
  // defaultNetwork: "ftm",
  // defaultNetwork: "hardhat",
  //defaultNetwork: "mumbai",
  defaultNetwork: "localhost",

  solidity: "0.8.17",

  etherscan: {
    // arbiscan apikey
    apiKey: "9WEYJEV974N4CG5X2DGRCJQ55BSKUTMH8T",
  },

  networks: {
    ftm: {
      url: "https://rpc.ankr.com/fantom",
      accounts: [sun4],
    },

    ftmtest: {
      url: "https://fantom-testnet.public.blastapi.io",
      accounts: [sun4],
    },

    mumbai: {
      url: polygon_test,
      accounts: [sun5],
    },
    arb: {
      url: "https://arb-mainnet.g.alchemy.com/v2/RR76BvJjtdya__moXIcRlmLIkuvQJa0I",
      // accounts: [merryToken]
      accounts: [sun4],
    },
  },
};

export default config;
