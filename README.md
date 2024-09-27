# T3RN BRIDGE BOT

## Table Of Contents
- [T3RN BRIDGE BOT](#t3rn-bridge-bot)
  - [Table Of Contents](#table-of-contents)
  - [T3RN Airdrop](#t3rn-airdrop)
  - [BOT FEATURE](#bot-feature)
  - [Prerequisite](#prerequisite)
  - [Setup \& Configure BOT](#setup--configure-bot)
    - [Linux](#linux)
    - [Windows](#windows)
  - [Update Bot](#update-bot)
  - [NOTE](#note)
  - [CONTRIBUTE](#contribute)
  - [SUPPORT](#support)

## T3RN Airdrop
New Airdrops : T3RN
🪂 Register : https://bridge.t1rn.io/


📈 SWAP AND EARN BRN

## BOT FEATURE

- Multi Account Support
- Auto Swap Betwen OP > ARB OR ARB > OP

## Prerequisite

- Git
- Node JS
- OP Sepolia ETH BALANCE / ARB Sepolia ETH BALANCE Depends on config

## Setup & Configure BOT

### Linux
1. Clone project repo `git clone https://github.com/Widiskel/t3rn-bridge-bot.git` and cd to project dir `cd t3rn-bridge-bot`
2. Run 
   ```
   npm install
   ```
3. Run 
   ```
   cp accounts/account_tmp.js accounts/accounts.js
   ```
4. Run 
   ```
   nano accounts/account.js
   ```
   and setup your accounts usig PK or Seed
5. to start the app run 
   ```
   npm run start
   ```
   
### Windows
1. Open your `Command Prompt` or `Power Shell`.
2. Clone project repo `git clone https://github.com/Widiskel/t3rn-bridge-bot.git` and cd to project dir `cd t3rn-bridge-bot`
3. Run `npm install`
4. Navigate to `t3rn-bridge-bot` directory. 
5. Navigate to `accounts` directory and rename `accounts_tmp.js` to `accounts.js`.
6. Open `accounts.js` and setup your wallet. 
7.  Now back to the `t3rn-bridge-bot` folder
8.  Copy `config.js` and `accounts` folder to `app` folder
9.  To start the app open your `Command Prompt` or `Power Shell` again and run `node app/index.js`.

## Update Bot

To update bot follow this step :
1. run `git pull` or `git pull rebase` , if error run `git stash && git pull`
2. run `npm update`
3. start the bot

## NOTE

You can configure amount to swap on config file

If you did'nt get BRN Point, change the config OP or ARB RAWDATA with yours. Where to get it ? do manual TX from ARB to OP or OP to ARB, and go to explorer and copy the Input Data as HEX.

## CONTRIBUTE

Feel free to fork and contribute adding more feature thanks. To get original unencrypted code just DM me on my social media original (index.js and src folder) are Obfuscated during build

## SUPPORT

want to support me for creating another bot ?
**star** my repo or buy me a coffee on

EVM : `0x0fd08d2d42ff086bf8c6d057d02d802bf217559a`

SOLANA : `3tE3Hs7P2wuRyVxyMD7JSf8JTAmEekdNsQWqAnayE1CN`
