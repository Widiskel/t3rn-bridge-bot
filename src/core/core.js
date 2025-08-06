import { ethers } from "ethers";
import { privateKey } from "../../accounts/accounts.js";
import { Helper } from "../utils/helper.js";
import logger from "../utils/logger.js";
import { RPC } from "./network/rpc.js";
import { Config } from "../../config.js";

export default class Core {
  constructor(acc) {
    this.acc = acc;
    this.arbProvider = new ethers.JsonRpcProvider(
      RPC.ARBRPC.RPC,
      RPC.ARBRPC.CHAIN_ID
    );
    this.baseProvider = new ethers.JsonRpcProvider(
      RPC.BASERPC.RPC,
      RPC.BASERPC.CHAIN_ID
    );
  }

  async connectWallet() {
    try {
      const data = this.acc;
      this.accIdx = privateKey.indexOf(this.acc);
      await Helper.delay(
        1000,
        this.acc,
        `Connecting to Account : ${this.accIdx + 1}`,
        this
      );
      const type = Helper.determineType(data);
      logger.info(`Account Type : ${type}`);
      if (type == "Secret Phrase") {
        /**
         * @type {Wallet}
         */
        this.arbWallet = new ethers.Wallet.fromPhrase(data, this.arbProvider);
        this.baseWallet = new ethers.Wallet.fromPhrase(data, this.baseProvider);
      } else if (type == "Private Key") {
        /**
         * @type {Wallet}
         */
        this.arbWallet = new ethers.Wallet(data.trim(), this.arbProvider);
        this.baseWallet = new ethers.Wallet(data.trim(), this.baseProvider);
      } else {
        throw Error("Invalid account Secret Phrase or Private Key");
      }
      this.address = this.arbWallet.address;
      await Helper.delay(
        1000,
        this.acc,
        `Wallet connected ${this.address}`,
        this
      );
    } catch (error) {
      throw error;
    }
  }

  async getBalance(update = false) {
    try {
      if (!update) {
        await Helper.delay(
          500,
          this.acc,
          `Getting Wallet Balance of ${this.address}`,
          this
        );
      }

      const arbBalance = ethers.formatEther(
        await this.arbProvider.getBalance(this.address)
      );
      const baseBalance = ethers.formatEther(
        await this.baseProvider.getBalance(this.address)
      );

      this.balance = {
        ETHARB: arbBalance,
        ETHBASE: baseBalance,
      };
      await Helper.delay(500, this.acc, `Balance updated`, this);
    } catch (error) {
      throw error;
    }
  }

  async rawTx(type) {
    try {
      await Helper.delay(
        500,
        this.acc,
        `Try To Executing ${type} RAW Transaction`,
        this
      );

      const contractToInteract =
        type == "ARB"
          ? Config.ARBTOBASECONTRACTADDRESS
          : Config.BASETOARBCONTRACTADDRESS;

      const amountInWei = ethers.parseEther(Config.BRIDGEAMOUNT);
      const data =
        type == "ARB"
          ? Config.ARBTOBASERAWDATA[this.accIdx ?? 0]
          : Config.BASETOARBRAWDATA[this.accIdx ?? 0];
      const provider = type == "ARB" ? this.arbProvider : this.baseProvider;
      const nonce = await this.getOptimalNonce(provider);
      const gasLimit = await this.estimateGasWithRetry(
        provider,
        contractToInteract,
        amountInWei,
        data,
        3,
        1000
      );

      const gas = await provider.getFeeData();

      const tx = {
        to: contractToInteract,
        value: amountInWei,
        // gasLimit,
        gasPrice: gas.gasPrice,
        nonce: nonce,
        data: data,
      };

      await this.executeTx(tx, type);
    } catch (error) {
      throw error;
    }
  }

  async executeTx(tx, type) {
    try {
      logger.info(`TX DATA ${JSON.stringify(Helper.serializeBigInt(tx))}`);
      await Helper.delay(500, this.acc, `Executing ${type} TX...`, this);
      const txRes =
        type == "ARB"
          ? await this.arbWallet.sendTransaction(tx)
          : await this.baseWallet.sendTransaction(tx);

      await Helper.delay(
        500,
        this.acc,
        `${type} Tx Executed Waiting For Block Confirmation...`,
        this
      );
      const txRev = await txRes.wait();
      logger.info(
        `${type} Tx Confirmed and Finalizing: ${JSON.stringify(txRev)}`
      );
      await Helper.delay(
        5000,
        this.acc,
        `${type} Tx Executed \n${
          type == "ARB" ? RPC.ARBRPC.EXPLORER : RPC.BASERPC.EXPLORER
        }tx/${txRev.hash}`,
        this
      );

      await this.getBalance(true);
    } catch (error) {
      if (error.message.includes("504")) {
        await Helper.delay(5000, this.acc, error.message, this);
      } else {
        throw error;
      }
    }
  }

  async getOptimalNonce(provider) {
    try {
      const latestNonce = await provider.getTransactionCount(
        this.address,
        "latest"
      );
      const pendingNonce = await provider.getTransactionCount(
        this.address,
        "pending"
      );
      const optimalNonce =
        pendingNonce > latestNonce ? pendingNonce : latestNonce;
      return optimalNonce;
    } catch (error) {
      throw error;
    }
  }

  async estimateGasWithRetry(
    provider,
    address,
    amount,
    rawdata,
    retries = 3,
    delay = 3000
  ) {
    for (let attempt = 0; attempt < retries; attempt++) {
      try {
        logger.info(`Estimating Gas for ${rawdata} TX`);
        const gasLimit = await provider.estimateGas({
          from: this.address,
          to: address,
          value: amount,
          data: rawdata,
        });
        // console.log(gasLimit);
        return gasLimit * 2;
      } catch (err) {
        await Helper.delay(
          delay,
          this.acc,
          `${err.shortMessage}... Attempt ${attempt + 1} of ${retries}`,
          this
        );
        if (attempt === retries - 1) {
          throw Error(`Failed to estimate gas after ${retries} attempts.`);
        }
      }
    }
  }
}
