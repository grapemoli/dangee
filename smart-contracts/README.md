# Smart Contracts
The core of the dangee dApp: smart contracts deployed on the Polygon blockchain.

The structure of the dictionary is: 
- **contracts** - ERC721 smart contracts, written for Solidity 8.20 with the help of [OpenZeppelin 5.0.0](https://www.openzeppelin.com/contractsv).
- **scripts** - scripts that take advantage of the Hardhat Runtime Environment
- **tests** - tests using [Chai](https://www.chaijs.com), with the [hardhat-chai-matchers](https://hardhat.org/hardhat-chai-matchers/docs/reference) plugin

## Development
Before proceeding, please make a MetaMask account, and add the Polygon mainnet and testnet to your networks. You will also need a PolygonScan account.
1. Run ```npm install``` to install all dependencies
2. Please make sure you're running  **Node v20**

### .env

You will need the following information in smart-contracts/.env:

PRIVATE_KEY: the private key of the wallet associated with Mumbai.
POLYGONSCAN_API_KEY: API key from your PolygonScan account.

### Compiling & Testing 
1. To compile your smart contracts, run ```npx hardhat compile```
2. To run your tests against the smart contracts, run ```npx hardhat test```

- Note: You can append ```/{fileName}``` to compile or test specific files.

### Useful Hardhat Commands
```shell
npx hardhat help
REPORT_GAS=true npx hardhat test      # reports gas usage
npx hardhat node
npx hardhat run scripts/deploy.js     
npx hardhat test --network hardhat    # sets the network to hardhat
```
