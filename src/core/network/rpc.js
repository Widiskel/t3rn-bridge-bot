import { Config } from "../../../config.js";

export class RPC {
  static ARBRPC = {
    CHAIN_ID: 421614,
    RPC: Config.ARBRPCURL,
    EXPLORER: "https://sepolia.arbiscan.io/",
    SYMBOL: "ARB ETH",
  };

  static BASERPC = {
    CHAIN_ID: 84532,
    RPC: Config.BASERPCURL,
    EXPLORER: "https://base-sepolia.blockscout.com/",
    SYMBOL: "BASE ETH",
  };
}
