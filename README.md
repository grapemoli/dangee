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

### User Roles
There are two, technically three, roles on the smart contracts.
1. **DEFAULT_ADMIN** - the original creator of the contract (me)
2. **MINT_ROLE** - any users granted the ability to mint NFTs
3. users who are neither minters nor admins.

As the role names imply, an admin work with any method on the smart contract. Users with the **MINT_ROLE** role are able to mint NFTs.
Note, these users cannot revoke nor grant **MINT_ROLE** access to other users.

The **MINT_ROLE** role allows the smart contract to essentially keep track of those who are "signed up" to the platform. Those
who are signed onto the platform are automatically given the **MINT_ROLE** access. In turn, this means that users with such role
are not registered with the platform (more on this later).

## Interacting with dangee
Coming soon...

## Development

### Front End Development
Coming soon...

### Smart Contract Development
Before proceeding, please make a MetaMask account (or any wallet), and add the [Polygon mainnet and testnet to your networks](https://docs.polygon.technology/tools/wallets/metamask/add-polygon-network/). You will also need a [PolygonScan](https://polygonscan.com/) 
account. If you'd like to mint NFT's with non-existing images, a [Pinata API](https://app.pinata.cloud/) account will also needed to be made.

For more information, refer to the [```smart-contract``` directory](https://github.com/grapemoli/dangee/tree/main/smart-contracts).

#### smart-contract/.env
You will need the following information in ```smart-contracts/.env```:
- ```PRIVATE_KEY```: the private key of the wallet associated with Mumbai.
- ```POLYGONSCAN_API_KEY```: API key from your [PolygonScan account](https://polygonscan.com/).
- ```WALLET_ADDRESS```: your public MetaMask wallet's address. Add as many as needed.
- ```PINATA_API_KEY```: your Pinata API key.

#### General Setup & Compilation
Go to the ```smart-contracts``` directory. 

1. Run ```npm install```
2. In ```hardhat.config.js```, change the ```defaultNetwork``` to Hardhat, Mumbai, or your network of choice.
2. Create your ```smart-contract/.env``` with your Polygon API key and matic-network-credentials.
3. Run ```npx hardhat compile``` and ```npx hardhat test``` to run the test cases against the smart contracts.
4. Run ```npx hardhat run scripts/deploy.js --network {networkName}``` to deploy to the blockchain.

