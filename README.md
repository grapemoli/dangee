# dangee
A Web3-Based NFT Trading Platform.

## Description
dangee is a Web3-based NFT trading platform (a dApp) built on the [Polygon](https://polygon.technology) blockchain. 
The Polygon blockchain, in particular, is used due to its compatability with Ethereum while featuring much lower gas fees.

User's are able to register onto the platform using Web3 Authentication (i.e., their wallets). Outside of authentication,
the user is able to:
1. interact with smart contracts in the way of minting NFTs, and 
2. trade/sell NFTs privately with other
users/wallets.

## Technologies
- Node.js version 20
- **Front-end Framework:** React 
- **Back-end Framework:** MoralisAPI
- hardhat (for smart contract development)

## Running
### Smart Contract Development
Go to the ```hardhat-test``` directory. 

1. Run ```npm install``` to install all dependencies.
2. Create your ```.env``` with your Polygon API key and matic-network-credentials.